//Dynamic text for Captions


Header = "<b>Service Locations</b>"
Header2 = "Maryland: service locations"
source = "<i><b>Source:</b> Shentel</i>"
legendHeader = "<b>Check456</b>"
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

//var income_domain = []
//var colorRange = 3
//var locationsMap = d3.map();
//var scaletype = "linear"
//var colorScheme = "Greens"

var locations = [];

function renderChart(){

  console.log("here")

d3.queue() //used to ensure that all data is loaded into the program before execution
  .defer(d3.json, "USbycounty/Maryland/Maryland.topojson")
  .defer(d3.csv, "Data/housefilePoints1.csv", function(d) {
    if(d.Longitude == 0 || d.Latitude == 0){
      console.log("invalid Lat/long at house id: "+ d.houseID)

    }else{
      locations.push([+d.Longitude, +d.Latitude])

    }
      //sets the key as the id plus converts string to int
  })
  .await(ready);
}


function ready(error, data){//ready function starts the program once all data is loaded
  if(error) throw error;
  console.log("here")

  // //max-min are obtained for helper.js range function
  // //Used to create a the domain array for variance in data
  // var max = d3.max(pivotcountDataArray, function(d) { return d;});
  // var min = d3.min(pivotcountDataArray, function(d) { return d;});
  //
  //
  // //returns an array of integers
  // income_domain = range(max, min, colorRange);
  //converts the array of integers to string, and reverses for legend purposes
  //var legendText = income_domain.map(String).reverse();


   //want to give multiple options for types of graphs
  // var income_color = {}
  //
  //
  //
  //
  // console.log(scaletype)
  // console.log(colorScheme)
  //
  // if(scaletype == "linear")
  // {
  //   income_color = d3.scaleLinear() //scaleLinear for D3.V4
  //     .domain(income_domain)
  //     .range(colorbrewer[colorScheme][colorRange]); //using color brewer
  //     //["rgb(158,202,225)","rgb(107,174,214)","rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)"]
  // }
  // else
  // {
  //   console.log("logarithmic")
  //   income_color = d3.scaleLog() //scaleLog for D3.v4
  //       .base(Math.E)
  //       .domain(income_domain)
  //       .range(colorbrewer[colorScheme][colorRange]);
  // }

  //USMap
  var maryland = topojson.feature(data, {
    type: "GeometryCollection",
    geometries: data.objects.Maryland.geometries //grabbing the points to create the polygon points so it can trace the Map
  });

  //identify projection -using geoalbersUSA
  var projection = d3.geoAlbersUsa() //geoAlbersUsa is the basic map projection, there are many more. This is the best for plane US view.
    .fitExtent([[20,20],[700,500]], maryland) //FitExtent used to fit the "Tile" for the viewer

  var geoPath = d3.geoPath().projection(projection) //initialize the path
 //initialize the path



  // Define the div for the tooltip



  d3.select("svg.pivotCount").selectAll("path") //assign the projected map to the svg in HTML
    .data(maryland.features)//.data is given from the argument from the ready function, includes features on the map
    .enter()
    .append("path")
    .attr("d", geoPath)
    .style("stroke", "#808080") //These two lines are used to create the outline of regions on the map whether its states or counties... etc
    .style("stroke-width", "2")
    .attr("fill", 'lightgrey')
    .on("mouseover", function(d) {
      //var namehouseID = locationsMap.get([d.longitude, d.latitude);
      //var latlong = locationsMap.get(d.houseID)
    	div.transition()
      	   .duration(200)
           .style("opacity", .9)
        //   var text = "House ID: "+ namehouseID +"<br/>" + PopUpText_Description + latlong;
          // div.html(text)
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
	})
    .on("mouseout", function(d) {
        div.transition()
           .duration(500)
           .style("opacity", 0);
    });



    aa = [[-106.139515, 38.829332],[-75.1652, 39.9526]];
    console.log(locations)
    console.log(aa)

    d3.select("svg.pivotCount").selectAll("circle")
  		.data(locations).enter()
  		.append("circle")
  		.attr("cx", function (d) { console.log(projection(d)[0]); return projection(d)[0] })
  		.attr("cy", function (d) { return projection(d)[1]; })
  		.attr("r", "8px")
  		.attr("fill", "Red")


}
renderChart()

//Creating a legend  --------------------------------------------------------------------
// var legend = d3.select("svg.legend")
//   .attr("width", 200)
//   .attr("height", 200)
//   .selectAll("d")
//   .data(income_color.domain().slice().reverse())
//   .enter()
//   .append("g")
//   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
//
//   legend.append("rect")
//     .attr("width", 18)
//     .attr("height", 18)
//     .style("fill", income_color);
//
//   legend.append("text")
//     .data(legendText)
//     .attr("x",24)
//     .attr("y",9)
//     .attr("dy",".30em")
//     .text(function(d){return d;});
// }
//
// // document.getElementById("Linear").addEventListener('click', function(){
// //   scaletype = "linear"
// //   d3.select("svg").selectAll("*").remove();
// //   renderChart()
// // })
// //
// // document.getElementById("Logarithmic").addEventListener('click', function(){
// //   scaletype = "Logarithmic"
// //   d3.select("svg").selectAll("*").remove();
// //   renderChart()
// // })
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

// var getColor = document.getElementById("selectOpt", function(){
//   var colorScheme = getColor.options[getColor.selectedIndex].value;
//   d3.select("svg").selectAll("*").remove();
//   d3.select("svg.legend").selectAll("*").remove();
//   renderChart()
// });
//
//
// var e



//     // add circles to svg
//     svg.selectAll("circle")
// 		.data(aa).enter()
// 		.append("circle")
// 		.attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
// 		.attr("cy", function (d) { return projection(d)[1]; })
// 		.attr("r", "6px")
// 		.attr("fill", "Red")
//
// });
