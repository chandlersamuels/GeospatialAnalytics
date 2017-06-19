Header = "<b>Shentel: Trouble tickets with service type</b>"
Header2 = "All-Time"
source = "<i><b>Source:</b> Shentel </i>"
Description1 = "Map Type: Slippy-SVG"
Description2 = "Map Feature: Summarized by Area and Discrete data points"

document.getElementById("Header").innerHTML = Header;
document.getElementById("Header2").innerHTML = Header2;
document.getElementById("Source").innerHTML = source;
document.getElementById("Description1").innerHTML = Description1;
document.getElementById("Description2").innerHTML = Description2;

var income_domain = []
var chartData = {}
var chartDataRange = []
var colorRange = 9
var colorScheme = "Reds"
serviceType = [] //array used to hold all sequential service types
locations = []


function renderChart(){

  d3.queue() //used to ensure that all data is loaded into the program before execution
    .defer(d3.json, "USbyCounty/4states.geojson")
    .defer(d3.csv, "Data/ticketcountbyCounty.csv", function(d) {
      chartData[d.state + '-' + d.county] = +d.tickets;
      console.log(chartData)
      chartDataRange.push(+d.tickets)
  })
    .defer(d3.csv, "Data/shentel-troubles-may.csv", function(d) {
      if(d.Longitude == 0 || d.Latitude == 0){ //statement can be updated in case of flaws in readable data from csv.
      console.log("invalid Lat/long at house id: "+ d.StoreName)

    }else{
      locations.push([+d.Latitude, +d.Longitude, d.ServiceType]); //adding information from csv one by one
      serviceType.push(d.ServiceType); //adding information from csv one by one.

  }
    //sets the key as the id plus converts string to int
})
  .await(ready);
}

Array.prototype.contains = function(v) { //Prototype functions are used to create unique arrays(meaning there are no duplicates)
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

function ready(error, data){
  if(error) throw error;

  console.log(chartData)
  console.log(chartDataRange)

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
   feature.properties.tickets = chartData[feature.properties.STATEFP+ '-' + feature.properties.NAME];
 })

console.log(data)

 var statesData = data
 var map = L.map('mapid').setView([39.4143, -77.4105], 6); //()[lat, long], zoom)
 L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);



 function style(feature){
   if(feature.properties.tickets == undefined){
      return {
          fillColor: "grey", //conf
          weight: 2,
          opacity: 1,
          color: 'darkgrey',
          dashArray: '1',
          fillOpacity: .2
      };}
      else{
        return {
            fillColor: income_color(feature.properties.tickets), //conf
            weight: 2,
            opacity: 1,
            color: 'darkgrey',
            dashArray: '1',
            fillOpacity: .6
        };}
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


uniqueServiceType = serviceType.unique() //taking all serviceTypes from CSV and creating a unique list for the legend and other purposes
console.log(uniqueServiceType);
var colors = ['#C0C0C0', '#808080', '#FF0000', '#800000', '#FFFF00', '#808000', '#00FF00', '#008000', '#00FFFF', '#008080', '#0000FF','#000080','#FF00FF','#800080','#CD5C5C','#F08080','#E9967A','#34495E','#5DADE2','#AF7AC5'];


servwithcolors = []; //initializing the array that will hold the specific service type to each color[servicetype,color]

for(var i = 0; i < uniqueServiceType.length; i++)
{
    servwithcolors.push([uniqueServiceType[i],colors[i]]) //populating the servwithcolors array
}

function colorScale(arraySpot){ //assigning color to a circle
  for(var i = 0; i < servwithcolors.length; i++){
    if(arraySpot[2]==servwithcolors[i][0]){ //loop through Service type until it matches if the locations/ServiceType. When it does return the color attributed to it.
      return servwithcolors[i][1];
    }
  }
}

function Description(locations){ //adding description for popup window over mouseover
  description = "ServiceType: " + locations[2];
  return description;
}

for(var i = 0; i < locations.length; i++)
  var circle = L.circle(locations[i], {
    color: colorScale(locations[i]),
    fillColor: colorScale(locations[i]),
    fillOpacity: 0.5,
    radius: 15
}).bindPopup(Description(locations[i])).on('mouseover', function (e) {
      this.openPopup();
    }).on('mouseout', function (e) {
          this.closePopup();
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
      this._div.innerHTML = '<h4>Monthly Ticket Count</h4>' +  (props ?
          '<b>' + props.NAME + '</b><br />' + props.tickets+ ' tickets'
          : 'Hover over a county'); //Things that goes inside the pop-up window.
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


  var legend2 = L.control({position: 'bottomleft'}); //

  legend2.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < servwithcolors.length; i++) {
          div.innerHTML +=
              '<i style="background:' + servwithcolors[i][1] + '"></i> ' +
              servwithcolors[i][0] + (servwithcolors[i][0] ? '' + '<br>' : '+');
      }

      return div;
  };

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
