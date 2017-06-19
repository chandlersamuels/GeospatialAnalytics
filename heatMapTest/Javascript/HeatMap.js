Header = "<b>Shentel: Trouble Tickets based on Category.</b>"
Header2 = "All-Time"
source = "<i><b>Source:</b> Shentel </i>"
Description1 = "Map Type: Slippy"
Description2 = "Map Feature: Discrete Features"

document.getElementById("Header").innerHTML = Header;
document.getElementById("Header2").innerHTML = Header2;
document.getElementById("Source").innerHTML = source;
document.getElementById("Description1").innerHTML = Description1;
document.getElementById("Description2").innerHTML = Description2;
//-------------------------------------------------------------------------------------------------------- Surrounding Text for HTML page prototype
serviceType = [] //array used to hold all sequential service types
locations = [] //array used to hold a tuple of information pulled from the CSV



var light= 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'; //Lightly colored open maps tile
var standard='http://{s}.tile.osm.org/{z}/{x}/{y}.png'; //traditional Open Maps Tile


function renderChart(){ //function is used to control the flow of when data is being loaded back into the program.
//Calls the ready function once all data is imported into the program.

  d3.queue() //used to ensure that all data is loaded into the program before execution
    .defer(d3.json, "USbyCounty/4states.geojson")
    .defer(d3.csv, "Data/shentel-troubles-may.csv", function(d) {
      if(d.Longitude == 0 || d.Latitude == 0){ //statement can be updated in case of flaws in readable data from csv.
        console.log("invalid Lat/long at house id: "+ d.StoreName)

      }else{
        locations.push([+d.Latitude, +d.Longitude]); //adding information from csv one by one //adding information from csv one by one.
    }
      //sets the key as the id plus converts string to int
  })
  .await(ready);
}


function ready(error, data){//feed in an error and the data that we imported in the renderChart function
  console.log(locations)

  var statesData = data

  var Standard = L.tileLayer(standard);
  var Light = L.tileLayer(light);

  //taking all serviceTypes from CSV and creating a unique list for the legend and other purposes

  var map = L.map('mapid',{
    center: [38.5976, -80.4549],
    zoom: 6,
    Layers: [Standard]
  });

  map.addLayer(Standard)

  var baseMaps = {
    "Standard": Standard,
    "Light": Light
};

  L.control.layers(baseMaps).addTo(map);


  function style(feature){
    return {
        fillColor: "white", //conf
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: .1
    };
  }

  L.geoJson(statesData,{
    style: style
  }).addTo(map);

  var heat = L.heatLayer(locations,{
             radius: 15,
             blur: 5,
             maxZoom: 15,
         }).addTo(map);


//Adding legend ---------------------------------------------------------------------------------------------
}



renderChart()
