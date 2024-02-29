// var productPrice = document.getElementsByClassName("buy__price");
// console.log(productPrice);

// for (var i = 0; i < productPrice.length; i++) {
//   var allPrice = productPrice[i].innerHTML
//   console.log(allPrice)
// }

// AUTHORIZATION ACCESS OR BAN


let $AUTH = new URLSearchParams(window.location.search).get("auth");
if($AUTH == null) window.location.href = "login.html?redirect=1";

fetch("assets/scripts/auth.json").then((auth) => {
    return auth.json();
}).then((auth) => {
    if($AUTH != auth.auth){
        window.location.href = "login.html?redirect=1";
      }
});



var $CART;

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
function ready() {
  $CART = document.querySelector(".buy__allRows .list-group")
  var removeCartItemButtons = document.getElementsByClassName("remove__button");
  // console.log(removeCartItemButtons);

  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName("buy__input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }

  var addToCartButtons = document.getElementsByClassName("buy__button");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }

  document
    .getElementsByClassName("purchase__button")[0]
    .addEventListener("click", purchaseClicked);
}

function purchaseClicked() {
  alert("Kiitos tilauksestasi!");
  var cartItems = document.getElementsByClassName("buy__allRows")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();

  window.location.search = "?auth=" + new URLSearchParams(window.location.search).get("auth");
}

function removeCartItem(event) {
  let total = +document.getElementsByClassName("buy__totalPrice")[0].innerText.slice(0,-1);
  if(total > 0){
    event.target.parentElement.parentElement.parentElement.parentElement.remove();
    updateCartTotal();
  }
  
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function addToCartClicked(event) {
  var button = event.target;
  var shopItem = button.parentElement.parentElement;
  // var title = shopItem.getElementsByClassName("cart__name")[0].innerText;
  var price = shopItem.getElementsByClassName("cart__description")[0].innerText;
  var imageSrc = shopItem.getElementsByClassName("cart__photo")[0].src;

  addItemToCart(price, imageSrc);
  updateCartTotal();
}



function AddToCart(seller, pid, name, price){
  let im = 1 + (pid % 3);

  let li = document.createElement("li");
  li.classList.add("list-group-item");

  let item = document.createElement("div");
  item.classList.add("buy__item");

  let picture = document.createElement("div");
  picture.classList.add("buy__picture");

  let img = document.createElement("img");
  img.src = `./assets/img/cart/${im}.jpg`;
  img.style.width = "100%";

  picture.appendChild(img);
  item.appendChild(picture);

  let box = document.createElement("div");
  box.classList.add("box");

  let col = document.createElement("div");
  col.classList.add("col-auto");

  box.appendChild(col);

  let col_content = ` 

    <span class="fa fa-trash remove__button"></span>
    <h3>${name}</h3>
    <span>Tuotenumero ${pid}</span>
    <p>Myyjä: ${seller}</p>
    <div class="buy__price">
      <b class="bluetext">${price} €</b>
    </div>

  `;

  col.innerHTML = col_content;

  item.appendChild(box);
  li.appendChild(item);


  col.getElementsByClassName("remove__button")[0]
  .addEventListener("click", removeCartItem);

  $CART.appendChild(li);

}

function updateCartTotal(){
  let total = 0;
  let rows = $CART.querySelectorAll(".buy__price .bluetext");

  rows.forEach((row) => total += +row.textContent.slice(0,-1));

  document.getElementsByClassName("buy__totalPrice")[0].innerText = total.toFixed(2) + " €";
}




function parseGETParams(){
  let params = window.location.search.substring(1);

  let str = new URLSearchParams(params);

  for(const value of str.getAll("t")){
    console.log(value);
    let parsed = value.replaceAll("!", " ").split(";");

    let seller = parsed[0];
    let pid   = parsed[1];
    let name  = parsed[2];
    let price = parsed[3];
  
    AddToCart(seller, pid, name, (+price).toFixed(2));
    updateCartTotal();

  }
}


parseGETParams();