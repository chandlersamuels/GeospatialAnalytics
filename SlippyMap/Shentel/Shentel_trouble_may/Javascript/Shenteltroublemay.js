Header = "<b>Shentel: Traffic based on number of Swings.</b>"
Header2 = "All-Time"
source = "<i><b>Source:</b> Shentel </i>"
Description1 = "Map Type: Slippy"
Description2 = "Map Feature: Discrete Features"

document.getElementById("Header").innerHTML = Header;
document.getElementById("Header2").innerHTML = Header2;
document.getElementById("Source").innerHTML = source;
document.getElementById("Description1").innerHTML = Description1;
document.getElementById("Description2").innerHTML = Description2;

serviceType = []
locations = []
doorSwings= []


tileDisplay= 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
tileDisplay2='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
function renderChart(){

  d3.queue() //used to ensure that all data is loaded into the program before execution
    .defer(d3.csv, "Data/shentel-troubles-may.csv", function(d) {
      if(d.Longitude == 0 || d.Latitude == 0){
        console.log("invalid Lat/long at house id: "+ d.StoreName)

      }else{
        locations.push([+d.Latitude, +d.Longitude, d.ServiceType])
        serviceType.push(d.ServiceType)

    }
      //sets the key as the id plus converts string to int
  })
  .await(ready);
}

Array.prototype.contains = function(v) {
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
  console.log(locations)

  uniqueServiceType = serviceType.unique()
  console.log(uniqueServiceType);
  var colors = ['#C0C0C0', '#808080', '#FF0000', '#800000', '#FFFF00', '#808000', '#00FF00', '#008000', '#00FFFF', '#008080', '#0000FF','#000080','#FF00FF','#800080','#CD5C5C','#F08080','#E9967A','#34495E','#5DADE2','#AF7AC5'];
  //var mapboxAccessToken = 'pk.eyJ1IjoiY2hhbmRsZXJzYW11ZWxzIiwiYSI6ImNqMzM3NmlxcTAwMDYycW5tbW9sOGlhbmYifQ.2ahB5hx3ZV8Txhe_A4209A';
  var map = L.map('mapid').setView([39.0458, -76.6413], 8); //()[lat, long], zoom)
  L.tileLayer(tileDisplay2).addTo(map);

  servwithcolors = [];


  for(var i = 0; i < uniqueServiceType.length; i++)
  {
      servwithcolors.push([uniqueServiceType[i],colors[i]])
  }

  console.log(servwithcolors)

function colorScale(arraySpot){
  for(var i = 0; i < servwithcolors.length; i++){
    if(arraySpot[2]==servwithcolors[i][0]){
      return servwithcolors[i][1];
    }
  }
}

for(var i = 0; i < locations.length; i++)
  var circle = L.circle(locations[i], {
    color: colorScale(locations[i]),
    fillColor: colorScale(locations[i]),
    fillOpacity: 0.5,
    radius: 35
}).addTo(map);
}


function getColor(selectObject){
    tileDisplay = selectObject.value;
    d3.select("svg").selectAll("*").remove();;
    renderChart()
}


renderChart()
