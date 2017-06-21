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

function ready(error, data){//feed in an error and the data that we imported in the renderChart function
  console.log(locations)

  var Standard = L.tileLayer(standard);
  var Light = L.tileLayer(light);

  uniqueServiceType = serviceType.unique() //taking all serviceTypes from CSV and creating a unique list for the legend and other purposes
  console.log(uniqueServiceType);
  var colors = ['#C0C0C0', '#808080', '#FF0000', '#800000', '#FFFF00', '#808000', '#00FF00', '#008000', '#00FFFF', '#008080', '#0000FF','#000080','#FF00FF','#800080','#CD5C5C','#F08080','#E9967A','#34495E','#5DADE2','#AF7AC5'];
  //^^list of colors that will be used to color each circle a unique color based on type of category.

  var map = L.map('mapid',{
    center: [38.9520546, -78.318059],
    zoom: 10,
    Layers: [Standard]
  });

  map.addLayer(Standard)

  var baseMaps = {
    "Standard": Standard,
    "Light": Light
};

  L.control.layers(baseMaps).addTo(map);

  servwithcolors = []; //initializing the array that will hold the specific service type to each color[servicetype,color]

  for(var i = 0; i < uniqueServiceType.length; i++)
  {
      servwithcolors.push([uniqueServiceType[i],colors[i]]) //populating the servwithcolors array
  }

  console.log(servwithcolors)

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

//Adding legend ---------------------------------------------------------------------------------------------
var legend = L.control({position: 'bottomright'}); //

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < servwithcolors.length; i++) {
        div.innerHTML +=
            '<i style="background:' + servwithcolors[i][1] + '"></i> ' +
            servwithcolors[i][0] + (servwithcolors[i][0] ? '' + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
}



renderChart()
