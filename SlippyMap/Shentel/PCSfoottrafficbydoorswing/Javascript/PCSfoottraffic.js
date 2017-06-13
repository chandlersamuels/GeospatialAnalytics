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


locations = []
doorSwings= []

tileDisplay= 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'

function renderChart(){

  d3.queue() //used to ensure that all data is loaded into the program before execution
    .defer(d3.csv, "Data/Swing_count_PCS_may_2017.csv", function(d) {
      if(d.Longitude == 0 || d.Latitude == 0){
        console.log("invalid Lat/long at house id: "+ d.StoreName)

      }else{
        locations.push([+d.Latitude, +d.Longitude])
        doorSwings.push(+d.DoorSwings)

    }
      //sets the key as the id plus converts string to int
  })
  .await(ready);
}


function ready(error, data){
  console.log(locations)
  console.log(tileDisplay)
  console.log(doorSwings)

  //var mapboxAccessToken = 'pk.eyJ1IjoiY2hhbmRsZXJzYW11ZWxzIiwiYSI6ImNqMzM3NmlxcTAwMDYycW5tbW9sOGlhbmYifQ.2ahB5hx3ZV8Txhe_A4209A';
  var map = L.map('mapid').setView([39.0458, -76.6413], 8); //()[lat, long], zoom)

  L.tileLayer(tileDisplay).addTo(map);

for(var i = 0; i < locations.length; i++)
  var circle = L.circle(locations[i], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: doorSwings[i]
}).addTo(map);

}


function getColor(selectObject){
    tileDisplay = selectObject.value;
    d3.select("svg").selectAll("*").remove();;
    renderChart()
}


renderChart()
