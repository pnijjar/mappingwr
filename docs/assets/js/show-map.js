
var attrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

function getPopupText(feature) { 
    return '<a href="' 
      + feature.properties["HYPERLINK"]
      + '">'
      + feature.properties["COMMON_LOCATION_REFERENCE"]
      + '</a>';

} 

function onEachFeature(feature, layer) {
    if (feature.properties) {
        // How is this going to generalize to other entities??
        if (feature.properties["HYPERLINK"]
           && feature.properties["COMMON_LOCATION_REFERENCE"]) { 
             layer.bindPopup(getPopupText(feature));
             console.log(getPopupText(feature));
        }
    }
} // end onEachFeature

// https://leafletjs.com/examples/geojson/
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function pointToLayer(feature, latlng) { 
    return L.circleMarker(latlng, geojsonMarkerOptions);
} 


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


$.getJSON(
  "https://opendata.arcgis.com/datasets/daeb44b4880140f88561840efe3ccfbe_0.geojson",
  function(data) { 
      var geojson = L.geoJson(data, {
          //pointToLayer: pointToLayer,
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
    textPlaceholder: "Search by address v17",
    minLength: 3
});

//map.addLayer(collisionLayer);
map.addControl(searchControl);

