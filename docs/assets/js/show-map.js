
var attrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

function getPopupText(feature) { 
    return '<a href="' 
      + feature.properties["HYPERLINK"]
      + '">'
      + feature.properties["COMMON_LOCATION_REFERENCE"]
      + '</a>';

} 

function getPopupTextCollision(feature) { 
    return '' 
      + feature.properties["ACCIDENTDATE"]
      + ": " 
      + feature.properties["COLLISION_TYPE"];
}


function onEachFeature(feature, layer) {
    if (feature.properties) {
        // How is this going to generalize to other entities??
        if (feature.properties["HYPERLINK"]
           && feature.properties["COMMON_LOCATION_REFERENCE"]) { 
             layer.bindPopup(getPopupText(feature));
           // console.log(getPopupText(feature));
        } 
        else if (feature.properties["ACCIDENTDATE"]) { 
            layer.bindPopup(getPopupTextCollision(feature));
            console.log(getPopupTextCollision(feature));
        } else { 
            layer.bindPopup("Some text goes here");
        }
    }
} // end onEachFeature

// https://leafletjs.com/examples/geojson/
// This makes circles
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function pointToLayer(feature, latlng) { 
    var marker = L.circleMarker(latlng, geojsonMarkerOptions);
    markerClusters.addLayer(marker);
    // var markerIcon = L.divIcon({className: "marker"});
    // return L.marker(latlng, { icon: markerIcon });
} 

var markerClusters = L.markerClusterGroup();

var map = new L.Map('map', {
    zoom: 10,
    center: new L.latLng([43.45850, -80.51511]),
    scrollWheelZoom:false,
  });

var baseLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: attrib });     //base layer

map.addLayer(baseLayer);

var collisionLayer = null;

var pointStyle = {
    "color": "0000ff",
    "weight": 1 
};

// Community centres - Kitchener
//  "https://opendata.arcgis.com/datasets/daeb44b4880140f88561840efe3ccfbe_0.geojson",


// Traffic collisions
//  "https://opendata.arcgis.com/datasets/75fa68b17e5b421d9d881f987c2d43fc_0.geojson",

$.getJSON(
  //"https://opendata.arcgis.com/datasets/75fa68b17e5b421d9d881f987c2d43fc_0.geojson",
  // "https://opendata.arcgis.com/datasets/daeb44b4880140f88561840efe3ccfbe_0.geojson",
  "https://opendata.arcgis.com/datasets/22173b62320f41069914707ae53f610e_0.geojson",
  function(data) { 
      var geojson = L.geoJson(data, {
          pointToLayer: pointToLayer,
          onEachFeature: onEachFeature
      });
      map.addLayer(geojson);
  })


var searchControl = new L.Control.Search({
    url: 'https://nominatim.openstreetmap.org/search?format=json&countrycodes=ca&viewbox=-80.7907,43.2281,-80.0834,43.6032&bounded=1&q={s}',
    jsonpParam: 'json_callback',
    propertyLoc: ['lat','lon'],
    propertyName: 'display_name',
    autoCollapse: false,
    collapsed: false,
    autoType: false,
    container: 'map-searchbar',
    zoom: 15,
    firstTipSubmit: true,
    textPlaceholder: "Search by address v32",
    minLength: 3
});

//map.addLayer(collisionLayer);
map.addLayer(markerClusters);
map.addControl(searchControl);

