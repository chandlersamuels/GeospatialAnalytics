var mapboxAccessToken = 'pk.eyJ1IjoiY2hhbmRsZXJzYW11ZWxzIiwiYSI6ImNqMzM3NmlxcTAwMDYycW5tbW9sOGlhbmYifQ.2ahB5hx3ZV8Txhe_A4209A';
var map = L.map('map').setView([37.8, -96], 4); //()[lat, long], zoom)

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    maxZoom: 50,
    id: 'mapbox.dark' //can choose between any premade maps or can customize map in Mapbox studio
}).addTo(map); //adding to div with id Map



function getColor(d) { //These colors were taken from colorbrewer.
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) { //This focuses on the actual color of the map
    return {
        fillColor: getColor(feature.properties.density), //inside of the us-states formated in GeoJson, its going into features->properties->density
        weight: 2, //this is the outline weight
        opacity: 1, // This is the opacity of the edge
        color: 'white', //color of the ed
        dashArray: '1', //can make dashed lines when increasing the value
        fillOpacity: 1 //
    };
}

var geojson;


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) { //highlight the area selected
    geojson.resetStyle(e.target);
    info.update();
}
function zoomToFeature(e) { //when you click on the state the map will zoom.
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

//-------------------------------------------------------------------------------------------------------------------
//We could use the usual popups on click to show information about different states, but we'll choose a different route -- Showing it on state hover inside a custome control.
var info = L.control(); //L means leaflet control is an attribute

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a state'); //Things that goes inside the pop-up window.
};

info.addTo(map);


//Adding Legend to the map--------------------------------------------------------------------------------------------

var legend = L.control({position: 'bottomright'}); //

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
