Header = "<b>Shentel: netRGUs</b>"
Header2 = "Monthly"
source = "<i><b>Source:</b> Shentel </i>"
Description1 = "Map Type: Slippy"
Description2 = "Map Feature: Summarized by Area"


document.getElementById("Header").innerHTML = Header;
document.getElementById("Header2").innerHTML = Header2;
document.getElementById("Source").innerHTML = source;
document.getElementById("Description1").innerHTML = Description1;
document.getElementById("Description2").innerHTML = Description2;

var income_domainPOS = []
var income_domainNEG = []
var chartData = {}
var chartDataRange = []
var colorRange = 6
var colorScheme = "Blues"


function renderChart(){

  d3.queue() //used to ensure that all data is loaded into the program before execution
    .defer(d3.json, "USbyCounty/4states.geojson")
    .defer(d3.csv, "Data/netRGUbyCounty.csv", function(d) {
      console.log(d)
      chartData[d.state + '-'+ d.county] = +d.netRGUs;
      chartDataRange.push(+d.netRGUs)
  })
  .await(ready);
}

function ready(error, data){
  if(error) throw error;

  console.log(chartDataRange)

  var max = d3.max(chartDataRange, function(d) { return d;});
  var min = d3.min(chartDataRange, function(d) { return d;});

  income_domainNEG = rangeNEG(0, min, colorRange);
  income_domainPOS = range(max, 0, colorRange);

  console.log(income_domainNEG)

  legendTextPOS = income_domainPOS.map(String).reverse()
  legendTextNEG = income_domainNEG.map(String).reverse()

  var income_color={}

  income_colorPOS = d3.scaleLinear() //scaleLinear for D3.V4
    .domain(income_domainPOS)
    .range(colorbrewer["Greens"][colorRange]);

  income_colorNEG = d3.scaleLinear() //scaleLinear for D3.V4
    .domain(income_domainNEG)
    .range(colorbrewer["Reds"][colorRange]);


  console.log(data)
  console.log(chartData)
//augment geojson data with count attribute from csv
 _.each(data.features, function(feature){
   feature.properties.netRGU = chartData[feature.properties.STATEFP + '-' + feature.properties.NAME];
 })

console.log(data)

 var statesData = data
 var map = L.map('mapid').setView([39.4143, -77.4105], 6); //()[lat, long], zoom)
 L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png').addTo(map);



 function style(feature){
   if(feature.properties.netRGU == undefined){
      return {
          fillColor: "grey", //conf
          weight: 2,
          opacity: 1,
          color: 'darkgrey',
          dashArray: '1',
          fillOpacity: .2
      };}
      else{
        colorScheme = "Reds"
        if(feature.properties.netRGU < 0){
          return {
              fillColor: income_colorNEG(feature.properties.netRGU), //conf
              weight: 2,
              opacity: 1,
              color: 'darkgrey',
              dashArray: '1',
              fillOpacity: 1
          };}
        else {
          colorScheme = "Greens"
          return {
              fillColor: income_colorPOS(feature.properties.netRGU), //conf
              weight: 2,
              opacity: 1,
              color: 'darkgrey',
              dashArray: '1',
              fillOpacity: 1
            };}
      }
    }

var geojson;

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#666',
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
      this._div.innerHTML = '<h4>Monthly Net RGUs</h4>' +  (props ?
          '<b>' + props.NAME + '</b><br />' + props.netRGU+ ' netRGUs'
          : 'Hover over a county'); //Things that goes inside the pop-up window.
  };

  info.addTo(map);

//Adding Legend to the map--------------------------------------------------------------------------------------------

  var legend = L.control({position: 'bottomright'}); //
  var legend2 = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < legendTextPOS.length; i++) {
          div.innerHTML +=
              '<i style="background:' + income_colorPOS(legendTextPOS[i]) + '"></i> ' +
              legendTextPOS[i] + (legendTextPOS[i + 1] ? '&ndash;' + '<br>' : '-');
      }

      return div;
  };

  legend2.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < legendTextNEG.length; i++) {
          div.innerHTML +=
              '<i style="background:' + income_colorNEG(legendTextNEG[i]) + '"></i> ' +
              legendTextNEG[i] + (legendTextNEG[i + 1] ? '&ndash;' + '<br>' : '-');
      }

      return div;
  };

  legend.addTo(map);
  legend2.addTo(map);

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
