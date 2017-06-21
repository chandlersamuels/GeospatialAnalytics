Header = "<b>GSR: Total Cost by State</b>"
Header2 = "All-Time"
source = "<i><b>Source:</b> Grey Suit Retail </i>"
Description1 = "Map Type: Slippy"
Description2 = "Map Feature: Summarized by Area"

document.getElementById("Header").innerHTML = Header;
document.getElementById("Header2").innerHTML = Header2;
document.getElementById("Source").innerHTML = source;
document.getElementById("Description1").innerHTML = Description1;
document.getElementById("Description2").innerHTML = Description2;

var income_domain = []
var chartData = {}
var chartDataRange = []
var colorRange = 9
var colorScheme = "Greens"


function renderChart(){

  d3.queue() //used to ensure that all data is loaded into the program before execution
    .defer(d3.json, "USbyState/USMap.geojson")
    .defer(d3.csv, "Data/tlmsalesbyState.csv", function(d) {
      chartData[d.state] = +d.count;
      chartDataRange.push(+d.count)
  })
  .await(ready);
}



function ready(error, data){
  if(error) throw error;

  var max = d3.max(chartDataRange, function(d) { return d;});
  var min = d3.min(chartDataRange, function(d) { return d;});

  income_domain=range(max, min, colorRange);
  legendText = income_domain.map(String).reverse()

  var income_color={}

  income_color = d3.scaleLinear() //scaleLinear for D3.V4
    .domain(income_domain)
    .range(colorbrewer[colorScheme][colorRange]);


  console.log(data)
  console.log(chartData)
//augment geojson data with count attribute from csv
 _.each(data.features, function(feature){
   feature.properties.sales = chartData[feature.properties.STUSPS];
 })

 var statesData = data
 var map = L.map('mapid').setView([37.8, -96], 4); //()[lat, long], zoom)
 L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);


 function style(feature) {
    return {
        fillColor: income_color(feature.properties.sales),
        weight: 2,
        opacity: 1,
        color: 'darkgrey',
        dashArray: '1',
        fillOpacity: 1
    };
}

var geojson;

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#000',
        dashArray: '',

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
      this._div.innerHTML = '<h4>Total Sales by state</h4>' +  (props ?
          '<b>' + props.NAME + '</b><br />' + props.sales+ ' sales'
          : 'Hover over a state'); //Things that goes inside the pop-up window.
  };

  info.addTo(map);

//Adding Legend to the map--------------------------------------------------------------------------------------------

  var legend = L.control({position: 'bottomright'}); //

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < legendText.length; i++) {
          div.innerHTML +=
              '<i style="background:' + income_color(legendText[i]) + '"></i> ' +
              legendText[i] + (legendText[i + 1] ? '&ndash;' + '<br>' : '-');
      }

      return div;
  };

  legend.addTo(map);

}

renderChart()
//
// document.getElementById("colorRange3").addEventListener('click', function (){
//   colorRange = "3"
//   d3.select("svg").selectAll("*").remove();
//   d3.select("svg.legend").selectAll("*").remove();
//   renderChart()
// })
//
// document.getElementById("colorRange6").addEventListener('click', function(){
//   colorRange = "6"
//   d3.select("svg").selectAll("*").remove();
//   d3.select("svg.legend").selectAll("*").remove();
//   renderChart()
// })
//
// document.getElementById("colorRange9").addEventListener('click', function(){
//   colorRange = "9"
//   d3.select("svg").selectAll("*").remove();
//   d3.select("svg.legend").selectAll("*").remove();
//   renderChart()
// })
//
// function getColor(selectObject){
//     colorScheme = selectObject.value;
//     d3.select("svg").selectAll("*").remove();
//     d3.select("svg.legend").selectAll("*").remove();
//     renderChart()
// }
