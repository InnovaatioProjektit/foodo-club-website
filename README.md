
# Foodo Club 

#### Course project for Web Solutions Course

We developed a proof-of-concept website of sustainable food service where people can sell and buy food destined to be thrown away. 
As buyers, the users have access to realtime map with pins to locations where food is available. 

The project delivers a frontend built on vanilla html and javascript with a few open source libraries and a map api. The proof-of-concept shows that simple list of globe coordinates on an embedded map may function as a user experience and that this capability is possible with usage of localStorage API and interactive map library.

## Prerequisite

For the interactive map to function, the project requires a map/navigation API access, whether free or paid. The current project uses `api.mapbox.com` services with authorized token and limited tile download rate.

## Stack:

The website was developed by vanilla ajax stack.

* `Pouchdb 7.2.2`
* `Leaflet.js 1.7.1`
* `Cookies.js 1.2.1`
* `Mapbox API`


## Screenshots

<table>
  <tr>
  	<td align="center">
      <img src="docs/1.jpeg" alt="mainpage" width="400"/>
    </td>
     <td align="center">
      <img src="docs/2.jpeg" alt="cartpage" width="400"/>
    </td>
    <td align="center">
      <img src="docs/3.jpeg" alt="interactivemap" width="400"/>
    </td>
  </tr>
</table>

## Contributions

Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>
