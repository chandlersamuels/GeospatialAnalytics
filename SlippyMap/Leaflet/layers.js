//By default (as we didn’t pass any options when creating the map instance), all mouse and touch interactions on the map are enabled, and it has zoom and attribution controls.
//Note that setView call also returns the map object — most Leaflet methods act like this when they don’t return an explicit value, which allows convenient jQuery-like method chaining

var cities = L.layerGroup();

L.circle([39.61, -105.02], 500, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(cities);
L.circle([39.74, -104.99], 500, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(cities);
L.circle([39.73, -104.8], 500, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(cities);
L.circle([39.77, -105.233], 500, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(cities);

var mapboxAccessToken = 'pk.eyJ1IjoiY2hhbmRsZXJzYW11ZWxzIiwiYSI6ImNqMzM3NmlxcTAwMDYycW5tbW9sOGlhbmYifQ.2ahB5hx3ZV8Txhe_A4209A';
var mapboxUrl= 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken

var grayscale = L.tileLayer(mapboxUrl, {id: 'mapbox.light'}),
    darkscale = L.tileLayer(mapboxUrl, {id: 'mapbox.dark'}),
    streets = L.tileLayer(mapboxUrl, {id: 'mapbox.streets'});

var myMap = L.map('mapid', {
  center: [39.73, -104.99],
  zoom: 10,
  layers: [grayscale, darkscale, cities]
});

var baseMaps = {

  "Darkscale": darkscale,
  "Grayscale": grayscale,
  "Streets": streets
};

var overlayMaps = {
  "Cities": cities
};

L.control.layers(baseMaps, overlayMaps).addTo(myMap);
