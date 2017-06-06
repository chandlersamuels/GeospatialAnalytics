var mapboxAccessToken = 'pk.eyJ1IjoiY2hhbmRsZXJzYW11ZWxzIiwiYSI6ImNqMzM3NmlxcTAwMDYycW5tbW9sOGlhbmYifQ.2ahB5hx3ZV8Txhe_A4209A';
var map = L.map('mapid2').setView([39.75621, -104.99404], 10); //()[lat, long], zoom)

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    maxZoom: 50,
    id: 'mapbox.streets' //can choose between any premade maps or can customize map in Mapbox studio
}).addTo(map);

var geojsonFeature = {"type":"FeatureCollection","features":[
    {"type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "occupency": 120000,
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
},{"type": "Feature",
"properties": {
    "name": "Bob Evans",
    "amenity": "Restaurant",
    "occupency": 120,
    "popupContent": "I've eaten here once!"
},
"geometry": {
    "type": "Point",
    "coordinates": [-104.70000, 39.85621]
}}]};

function getColor(d){
  return d == "Baseball Stadium" ? '#800026' :
         d == "Restaurant" ? '#ff7800':'#FFEDA0';
}

function getbubbleSize(d){
  return d > 100000 ? 10 :
         d > 10000 ? 8 :
         d > 1000 ? 5:
         d > 100 ? 4 : 5;
}

L.geoJSON(geojsonFeature, {
  pointToLayer: function(feature, latlng){
    return L.circleMarker(latlng, {
      radius: getbubbleSize(feature.properties.occupency),
      fillColor: getColor(feature.properties.amenity),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }
}).addTo(map);

//adding legend ------------------------------------------------------------------------------------
var legend = L.control({position: 'bottomright'}); //

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        places = ["Restaurant", "Baseball Stadium"],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < places.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(places[i]) + '"></i> ' +
            places[i] + (places[i] ? '&ndash;' + places[i] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
