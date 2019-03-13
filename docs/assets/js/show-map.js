
var attrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

var map = new L.Map('map', {
    zoom: 10,
    center: new L.latLng([43.45850, -80.51511]),
    scrollWheelZoom:false,
  });

var baseLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: attrib });     //base layer

var collisionLayer = null;

$.getJSON(
  "https://opendata.arcgis.com/datasets/75fa68b17e5b421d9d881f987c2d43fc_0.geojson",
  function(data) { 
      console.log(data);
      collisionLayer = L.geoJson(data)
      });


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
    textPlaceholder: "Search by address v14",
    minLength: 3
});

map.addLayer(baseLayer);
map.addLayer(collisionLayer);
map.addControl(searchControl);

