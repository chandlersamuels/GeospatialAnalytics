//Dynamic text for Captions


Header = "<b>Shentel trouble tickets</b>"
Header2 = "Service types"
source = "<i><b>Source:</b> Shentel</i>"
legendHeader = "<b>Service Types</b>"
Description1 = "Map Type: SVG"
Description2 = "Map Feature: Discrete points"

PopUpText_Description = "Latitude"


document.getElementById("Header").innerHTML = Header;
document.getElementById("Header2").innerHTML = Header2;
document.getElementById("Source").innerHTML = source;
document.getElementById("legendHeader").innerHTML = legendHeader;
document.getElementById("Description1").innerHTML = Description1;
document.getElementById("Description2").innerHTML = Description2;
//-----------------------------------------------------------------

var serviceType = [];
var locations = [];
var colorScheme = "Red"
var colorScale = d3.scaleOrdinal()
      .range(['#C0C0C0', '#808080', '#FF0000', '#800000', '#FFFF00', '#808000', '#00FF00', '#008000', '#00FFFF', '#008080', '#0000FF','#000080','#FF00FF','#800080','#CD5C5C','#F08080','#E9967A','#34495E','#5DADE2','#AF7AC5']);

function renderChart(){

  console.log("here")

d3.queue() //used to ensure that all data is loaded into the program before execution
  .defer(d3.json, "4StateMap/fourstates.topojson")
  .defer(d3.csv, "Data/shentel-troubles-may.csv", function(d) {
    if(d.Longitude == 0 || d.Latitude == 0){
      console.log("invalid Lat/long at house id: "+ d.houseID)

    }else{
      locations.push([+d.Longitude, +d.Latitude, d.ServiceType, d.Description, +d.Accountnum])
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



function ready(error, data){//ready function starts the program once all data is loaded
  if(error) throw error;

  uniqueServiceType = serviceType.unique()
  console.log(uniqueServiceType)

  //USMap
  var shentelstates = topojson.feature(data, {
    type: "GeometryCollection",
    geometries: data.objects.fourstates.geometries //grabbing the points to create the polygon points so it can trace the Map
  });

  //identify projection -using geoalbersUSA
  var projection = d3.geoAlbersUsa() //geoAlbersUsa is the basic map projection, there are many more. This is the best for plane US view.
    .fitExtent([[20,20],[700,500]], shentelstates) //FitExtent used to fit the "Tile" for the viewer

  var geoPath = d3.geoPath().projection(projection) //initialize the path
 //initialize the path

 var div = d3.select("body").append("div")
   .attr("class", "tooltip")
   .style("opacity", 0);

  d3.select("svg.pivotCount").selectAll("path") //assign the projected map to the svg in HTML
    .data(shentelstates.features)//.data is given from the argument from the ready function, includes features on the map
    .enter()
    .append("path")
    .attr("d", geoPath)
    .style("stroke", "#808080") //These two lines are used to create the outline of regions on the map whether its states or counties... etc
    .style("stroke-width", "2")
    .attr("fill", 'lightgrey')

    console.log(locations)

    d3.select("svg.pivotCount").selectAll("circle")
  		.data(locations).enter()
  		.append("circle")
  		.attr("cx", function (d) { return projection(d)[0] })
  		.attr("cy", function (d) { return projection(d)[1]; })
  		.attr("r", "2px")
  		.attr("fill", function(d){ console.log(colorScale(d[2])); return colorScale(d[2])})
      .on("mouseover", function(d) {
        console.log()
         div.transition()
           .duration(200)
           .style("opacity", .9);
         div.html('Service Account: '+d[4]+ '<br>' + "Service Type: " + d[2] + '<br>' + "Description: " + d[3])
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
         })
       .on("mouseout", function(d) {
         div.transition()
           .duration(500)
           .style("opacity", 0);
         });
//--------------------------------------------------------------------------------------------
    console.log(locations)
     var legend = d3.select("svg.legend")
       .attr("width", 250)
       .attr("height", 500)
       .selectAll("d")
       .data(uniqueServiceType) //unique list of services
       .enter()
       .append("g")
       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

     legend.append("rect")
       .data(uniqueServiceType) //uniqueServiceTypes
       .attr("width", 18)
       .attr("height", 18)
       .style("fill", function(d){ return colorScale(d)});

     legend.append("text")
       .data(uniqueServiceType)//create unique list of service types
       .attr("x",24)
       .attr("y",9)
       .attr("dy",".30em")
       .text(function(d){return d;});





}


function getColor(selectObject){
    colorScheme = selectObject.value;
    d3.select("svg").selectAll("*").remove();
    d3.select("svg.legend").selectAll("*").remove();
    renderChart()
}


renderChart()
