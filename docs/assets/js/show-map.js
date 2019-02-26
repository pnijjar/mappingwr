
var geojsonLayer = null;

// This feature had better be from the geoJSON
function getPopupText(feature) {
  return feature.properties["Name"] + ": "
    + feature.properties["information-link"];
}

function onEachFeature(feature, layer) {
    if (feature.properties) {
        if (feature.properties["information-link"]
          && feature.properties["Name"]) {
            layer.bindPopup(getPopupText(feature));
        } // end if information link

        layer.setStyle({
            color: feature.properties["stroke"],
            fillColor: feature.properties["fill"],
            fillOpacity: feature.properties["fill-opacity"],
            weight: feature.properties["stroke-width"],
            opacity: feature.properties["opacity"]
        });
    }

}


var attrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
var map = new L.Map('map', {
    zoom: 10,
    center: new L.latLng([43.45850, -80.51511]),
    scrollWheelZoom:false,
  });

var baseLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: attrib });     //base layer


var searchControl = new L.Control.Search({
    url: 'https://nominatim.openstreetmap.org/search?format=json&countrycodes=ca&viewbox=-80.7907,43.2281,-80.0834,43.6032&bounded=1&q={s}',
    jsonpParam: 'json_callback',
    propertyLoc: ['lat','lon'],
    propertyName: 'display_name',
    autoCollapse: false,
    marker: { 
      icon: new L.Icon.Default(), 
    },
    collapsed: false,
    autoType: false,
    container: 'map-searchbar',
    zoom: 15,
    firstTipSubmit: true,
    textPlaceholder: "Search by address v03",
    minLength: 3
});

map.addLayer(baseLayer);
map.addControl(searchControl);

$.getJSON("./assets/data/WardBoundaries.geojson", function(data) {
    var geojson = L.geoJson(data, {
      onEachFeature: onEachFeature
    });

    geojsonLayer = geojson;


    searchControl.on('search:locationfound', function(e) {
        // Use Mapbox Leaflet PIP (point in polygon) library.
        // Ugh ugh ugh.
        // https://stackoverflow.com/questions/48798336/
        var foundLayers = leafletPip.pointInLayer(e.latlng, geojsonLayer);

        foundLayers.forEach(function(layer) {
          layer.fire('click', {
            latlng: e.latlng
          });
        });

    });

    // map.addLayer(geojson);

});

