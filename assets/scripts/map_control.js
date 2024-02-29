// FUNKTIOIDEN ALUSTUS     ------------------------------------------------------------------------------------------

function createElement(element, attributes, innerHTML){
    let el = document.createElement(element);

    for (const key of Object.keys(attributes)) {
        el.setAttribute(key, attributes[key]);
    }

    if(innerHTML){
        el.innerHTML = innerHTML || "";
    }

    return el;
}

// Luo tarjousten listaan alkio
function createCard(attributes){
    let card = createElement("div", {class: "card fluid"});
    let header = createElement("div", {class: "card-header"});


    let name = createElement("b", {}, attributes.name);
    let subtitle = createElement("span", {class: "subtitle"}, attributes.distance);

    header.appendChild(name);
    header.appendChild(subtitle);

    let ul = createElement("ul", {class: "list-group"});
    let len = attributes.list.length;
    let highlight;

    for(let i= 0; i < len; i++){
        let item = createElement("li", {class: "list-group-item", id: attributes.list[i].uniqueID}, attributes.list[i].name);
        item.appendChild(createElement("span", {class: "badge badge-primary right"}, (attributes.list[i].price).toFixed(2)));

        let storeIcon = createElement("div", {class: "badge right fa fa-shop", id:"purchasable"});
        item.appendChild(storeIcon);

        if(cookies.has(attributes.list[i].uniqueID)){
            // jos tuote on ostoskorissa, estä tilaus
            storeIcon.style.color = "green";
            storeIcon.id = "unavailable";
        }
        

        ul.appendChild(item);

        // Muuta tarjouksen markkerin vihreäksi, kun hiiri on tarjouksen yllä
        item.addEventListener("mouseenter", function(ev){
            let pin = document.querySelector("img[storeid='" + ev.target.id + "']");
            highlight = pin.src;
            pin.src = yellowIcon.options.iconUrl;
            pin.style.zIndex++;
        });

        item.addEventListener("mouseleave", function(ev){
            let pin = document.querySelector("img[storeid='" + ev.target.id + "']");
            pin.src = highlight;
            pin.style.zIndex--;
        });

        // Kun tarjous painetaan, luo tilaus
        item.addEventListener("click", function(ev){
            if(ev.target.id == "purchasable"){
                ev.target.id = "unavailable";
                ev.target.style.color = "green";


                
                cookies.set(ev.target.parentElement.id, "true");

                let data = ev.target.parentElement.innerText.split("\n");

               tooltip.appendChild(createCheckoutLabel(data[0], data[1], "tuote" + ev.target.parentElement.id));
               checkout.style.display = "";

                checkout.
                    firstElementChild.
                        firstElementChild.
                            firstElementChild.
                                firstElementChild.innerHTML = cookies.size;

                checkout.style.webkitAnimation = checkout.style.animation = "";
                setTimeout(function(){
                    checkout.style.webkitAnimation = checkout.style.animation = "shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
                }, 10);
                
                

            // Tuote on jo tilattu, poista tilaus
            }else if(ev.target.id == "unavailable"){
                ev.target.id = "purchasable";
                ev.target.style.color = "";

                cookies.delete(ev.target.parentElement.id);
                tooltip.querySelector('div[id="tuote'+ ev.target.parentElement.id +'"]').remove();


                if(cookies.size <= 0){
                    checkout.style.display = "none";
                }

                checkout.
                    firstElementChild.
                        firstElementChild.
                            firstElementChild.
                                firstElementChild.innerHTML = cookies.size;

                checkout.style.webkitAnimation = checkout.style.animation = "";

            }
            
        });
    }

    card.appendChild(header);
    card.appendChild(ul);

    return card;
}

// Luo ostoskorin listaan alkio
function createCheckoutLabel(name, price, pid){
    let col = createElement("div", {class: "col", id: pid});
    let p = document.createElement("p");
    p.style.display = "inline";

    p.appendChild(createElement("span", {class: "fa fa-food"}));
    p.innerHTML += name;
    p.appendChild(createElement("span", {class: "bluetext"}, price));

    col.appendChild(p);
    return col;

}

// Luo markkerin ponnahdusikkunan tiedot
function createLabel(omistaja, tuote){
    return "<h4>" + omistaja + "</h4>" + '<p class="col">' + tuote + '</p>';
}


// rakentaa ostoskorin GET parametrit jotka lähetetään seuravalle sivulle
function HandleGETRequest(){

    checkout.addEventListener("click", function(e){
        let uri = "" ;
        //uri += "t=" + [seller.name, key, tuote.name, tuote.price].join(";");
        let promises = [];

        for (const key of cookies.keys()){
             promises.push(db.get(key).then(function(tuote){

                return usr.get(String(tuote.ownerID)).then(function(seller){
                    uri += "&t=" + [seller.name, key, tuote.name, tuote.price].join(";");
                });

            }));
        }

        Promise.all(promises).then(function(resolve){
            window.location.href = "cart.html?auth=" + $AUTH + uri.replaceAll(" ", "!");
        });

    })
}


//  GLOBAALIT  -----------------------------------------------------------------------------------------------

var widget = document.querySelector(".widget");
var checkout = document.querySelector("#checkout");
var tooltip = document.querySelector(".tooltip .container");
var cookies = new Map();
var mapView = L.map('mapid').setView([60.20, 24.921], 13);



//  MAP HERE -----------------------------------------------------------------------------------------------


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic3R1bmdiZWUiLCJhIjoiY2tmejFzZTUwMDJ3YzJ2cWlieDFxcGJlbCJ9.91c1-jruLw9cdzsW_v7d0A'
}).addTo(mapView);


// VIhreän värinen markkeri
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // VIhreän värinen markkeri
var yellowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // mustan värinen markkeri
var blackIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
  

// kursorin markkeri
var clientMarker = L.marker([60.20, 24.921], {icon: blackIcon}).addTo(mapView);
var clientMarkerCoords = clientMarker.getLatLng();

function onMapClick(e) {
    // päivitä kursorin markkeri 

    clientMarker
        .setLatLng(e.latlng)
        .setPopupContent("You clicked the map at " + e.latlng.toString());
        

    clientMarkerCoords = e.latlng;


    // Siivoa tarjouspöytä
    let child = widget.firstElementChild;
    widget.innerHTML = "";
    widget.appendChild(child);
    // Hae lähiommäiset markerit tietokannasta ja llsää kartalle
    DistanceQuery();
}

mapView.on('click', onMapClick);



// DATABASE HERE ------------------------------------------------------------------------------

// Sisäinen frontend tietokanta, joka käyttää INDEXED_DB. 

var db = new PouchDB('foodo');
var usr = new PouchDB('users');


// Tuotteiden omistajat
usr.bulkDocs([
{
    _id: "0",
    id: 0,
    name: "Olavin Puoti"
},
{
    _id: "1",
    id: 1,
    name: "Nico Anttila"
},
{
    _id: "2",
    id: 2,
    name: "Jenni Yu"
},
{
    _id: "3",
    id: 3,
    name: "Terhi Lätti"
},

{
    _id: "4",
    id: 4,
    name: "Jussi"
},

{
    _id: "5",
    id: 5,
    name: "Ravintola Muru"
},

{
    _id: "6",
    id: 6,
    name: "Ravintola South"
},

{
    _id: "7",
    id: 7,
    name: "Cafe Cardemumma"
},

{
    _id: "8",
    id: 8,
    name: "Hanyio Tai"
},

{
    _id: "9",
    id: 9,
    name: "Kahvila Tauko"
},


{
    _id: "10",
    id: 10,
    name: "Teuvo A."
},

{
    _id: "11",
    id: 11,
    name: "Jaakko N."
},

{
    _id: "12",
    id: 12,
    name: "Pizza Sello"
},

{
    _id: "13",
    id: 13,
    name: "Timo Heikkinen"
},

{
    _id: "14",
    id: 14,
    name: "Zneshana"
},

{
    _id: "15",
    id: 15,
    name: "Annukka"
},


{
    _id: "16",
    id: 16,
    name: "K-Supermarket Kulinaari"
},

{
    _id: "17",
    id: 17,
    name: "Catering Kumppanit"
},

{
    _id: "18",
    id: 18,
    name: "Karamalmin kampus"
},

]);

// Tuotteiden markkerit 
db.bulkDocs([
    {
        _id: '1000',
        uniqueID: "1000",
        ownerID: 0,
        name: "Risella Basmati",
        desc: "hm",
        price: 2.30,
        coords: [60.19, 24.932]
    },

    {
        _id: '1001',
        uniqueID: "1001",
        ownerID: 0,
        name: "Risella Meksikolainen",
        desc: "",
        price: 2.30,
        coords: [60.19, 24.93]
    },

    {
        _id: "1002",
        uniqueID: "1002",
        ownerID: 1,
        name: "Juhla Mokka",
        desc: "",
        price: 3.00,
        coords: [60.20, 24.94]
    },

    {
        _id: '1003',
        uniqueID: "1003",
        ownerID: 2,
        name: "Tandoor Chicken",
        desc: "",
        price: 4.00,
        coords: [60.1982, 24.9018]
    },


    {
        _id: '1004',
        uniqueID: "1004",
        ownerID: 3,
        name: "Churrasco-vartaat",
        desc: "",
        price: 6.00,
        coords: [60.174485, 24.922748]
    },

    {
        _id: '1005',
        uniqueID: "1005",
        ownerID: 4,
        name: "Grillattu kana",
        desc: "",
        price: 4.00,
        coords: [60.182899, 24.946029]
    },

    {
        _id: '1006',
        uniqueID: "1006",
        ownerID: 5,
        name: "Grillattu kana",
        desc: "",
        price: 3.00,
        coords: [60.214441, 24.901337]
    },


    {
        _id: '1007',
        uniqueID: "1007",
        ownerID: 5,
        name: "Caesar-salaatti",
        desc: "",
        price: 2.60,
        coords: [60.314311, 24.901637]
    },

    {
        _id: '1008',
        uniqueID: "1008",
        ownerID: 5,
        name: "Metrilaku",
        desc: "",
        price: 15.00,
        coords: [60.214311, 24.921637]
    },

    {
        _id: '1009',
        uniqueID: "1009",
        ownerID: 6,
        name: "Sushi",
        desc: "",
        price: 3.60,
        coords: [60.206917, 24.970392]
    },

    {
        _id: '1010',
        uniqueID: "1010",
        ownerID: 7,
        name: "Turun sinappia väkevä",
        desc: "",
        price: 1.30,
        coords: [60.194856, 24.971233]
    },

    {
        _id: '1011',
        uniqueID: "1011",
        ownerID: 8,
        name: "SportLife Nutrition",
        desc: "",
        price: 1.20,
        coords: [60.169488, 24.931077]
    },

    {
        _id: '1012',
        uniqueID: "1012",
        ownerID: 9,
        name: "Baikal 2L juoma",
        desc: "",
        price: 0.90,
        coords: [60.211371, 24.911248]
    },

    {
        _id: '1013',
        uniqueID: "1013",
        ownerID: 9,
        name: "Kellogg Tresor",
        desc: "",
        price: 1.80,
        coords: [60.205763, 24.908885]
    },

    {
        _id: '1014',
        uniqueID: "1014",
        ownerID: 10,
        name: "Pizza Pecorino",
        desc: "",
        price: 4.20,
        coords: [60.220889, 24.860325]
    },


    {
        _id: '1015',
        uniqueID: "1015",
        ownerID: 10,
        name: "Valio Jogurtti",
        desc: "",
        price: 1.00,
        coords: [60.219195, 24.870824]
    },

    {
        _id: '1016',
        uniqueID: "1016",
        ownerID: 11,
        name: "Lunden Hernekeitto",
        desc: "",
        price: 2.00,
        coords: [60.204720, 24.934609]
    },

    {
        _id: '1017',
        uniqueID: "1017",
        ownerID: 12,
        name: "Lohikeitto",
        desc: "",
        price: 2.31,
        coords: [60.242412, 25.037168]

    },

    {
        _id: '1018',
        uniqueID: "1018",
        ownerID: 13,
        name: "Karjalanpiirakat",
        desc: "",
        price: 3.20,
        coords: [60.263365, 24.952367]

    },

    {
        _id: '1019',
        uniqueID: "1019",
        ownerID: 14,
        name: "Cheddar Cheese Sauce",
        desc: "",
        price: 0.90,
        coords: [60.179014, 24.807707]

    },

    {
        _id: '1020',
        uniqueID: "1020",
        ownerID: 15,
        name: "Kaura & Linssi Soure Cream 100g",
        desc: "",
        price: 0.60,
        coords: [60.173618, 24.800112]

    },

    {
        _id: '1021',
        uniqueID: "1021",
        ownerID: 16,
        name: "Heinz Tomaattiketsuppi 4 kpl",
        desc: "",
        price: 4.40,
        coords: [60.227268, 24.780040]

    },


    {
        _id: '1022',
        uniqueID: "1022",
        ownerID: 17,
        name: "Taffel KikX kikhernelastu",
        desc: "",
        price: 3.50,
        coords: [60.207328, 24.595598]

    },

    {
        _id: '1023',
        uniqueID: "1023",
        ownerID: 18,
        name: "Crazy Gamer Beer",
        desc: "",
        price: 14.80,
        coords: [60.223533, 24.758246]

    }
  ]);


  // Puhdistaa database ja poistaa muistista alkiot
  function resetQuery(){
      db.destroy();
      usr.destroy();

  }


// Erottaa tarvittavat objektit listasta
function ReduceQuery(find, row){
    let ret = [];
    let c = [];

    while(row.length > 0 ){
        let pop = row.shift();
        if(pop.doc.ownerID == find){
            ret.push(pop.doc);
            continue;
        }
        c.push(pop);
    }

    c.forEach((o) => row.push(o));

    return ret;
}

// Sama kuin: 
// 1. SELECT * FROM Tuotteet WHERE COORDS.DISTANCE(clientMarker) < 2000 m
// 2. FROM usr SELECT id WHERE tuotteet.id = usr.id;


// Laske etäisyys käyttäjän ja markkerin välillä
function QueryDistanceTest(doc){
    let x = doc.coords[0],
        y = doc.coords[1];

    let d = clientMarkerCoords.distanceTo(L.marker([x,y]).getLatLng()).toFixed(0);

    if(d < 8000) emit(d);

}

// missä meidän kaikki markerit sijaitsevat
let markerLayer = new L.LayerGroup().addTo(mapView);

// Optimoitu etäisyyden haku ja tarjousten lisääminen DOMiin.
function DistanceQuery(){

    for(let pos in markerLayer._layers){
        markerLayer._layers[pos].remove();
    }

    // 1
    db.query(QueryDistanceTest, {startKey:"0", endKey: "8000", include_docs: true}).then(function (result) {
        // JOS QDT palauttaa key -> väliltä 0 ja 8000, silloin palauta result

        // lyhyemmän matkan 
        result.rows.sort((a,b) => a.key - b.key);
        console.log(result);

        while(result.rows.length > 0){
            let child_id = result.rows[0].doc.ownerID;
            let distance = result.rows[0].key;
            let query = ReduceQuery(child_id, result.rows);

            usr.get(String(child_id)).then(function(row){
                return row.name;

            }).then(function(name){
                query.forEach((tuote) => {
                    // jokaistsa tuotetta kohti, lisätään kartalle markkeri

                    let x = tuote.coords[0],
                        y = tuote.coords[1];

                        let marker;
                        if(distance < 2000){
                            // Keltaiset markkerit
                            marker = L.marker([x,y], {icon: greenIcon}).bindPopup(createLabel(tuote.name, name));

                        }else{
                            // Siniset markkerit
                            marker = L.marker([x,y]).bindPopup(createLabel(tuote.name, name));
                        }
                        
                        marker.addTo(markerLayer);
                        marker._icon.setAttribute("storeid", tuote.uniqueID);

                });

                let card = createCard({
                    name: name,
                    distance: (distance  / 1000 ).toFixed(1) + " km",
                    list : query
                });

                widget.appendChild(card);

            });

        }
    });  
}


// ensimmäinen haku
DistanceQuery();
HandleGETRequest();