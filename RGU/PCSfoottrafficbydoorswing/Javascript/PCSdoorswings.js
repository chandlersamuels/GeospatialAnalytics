//Dynamic text for Captions


Header = "<b>PCS: Foot Traffic based on door swings</b>"
Header2 = "Shentel: Main four states"
source = "<i><b>Source:</b> Shentel</i>"
legendHeader = "<b></b>"
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


var locations = [];
var colorScheme = "Red"

function renderChart(){

  console.log("here")

d3.queue() //used to ensure that all data is loaded into the program before execution
  .defer(d3.json, "4StateMap/fourstates.topojson")
  .defer(d3.csv, "Data/Swing_count_PCS_may_2017.csv", function(d) {
    if(d.Longitude == 0 || d.Latitude == 0){
      console.log("invalid Lat/long at house id: "+ d.houseID)

    }else{
      locations.push([+d.Longitude, +d.Latitude, +d.DoorSwings])
    }
      //sets the key as the id plus converts string to int
  })
  .await(ready);
}

function ready(error, data){//ready function starts the program once all data is loaded
  if(error) throw error;
  console.log(colorScheme)


  //USMap
  var maryland = topojson.feature(data, {
    type: "GeometryCollection",
    geometries: data.objects.fourstates.geometries //grabbing the points to create the polygon points so it can trace the Map
  });

  //identify projection -using geoalbersUSA
  var projection = d3.geoAlbersUsa() //geoAlbersUsa is the basic map projection, there are many more. This is the best for plane US view.
    .fitExtent([[20,20],[700,500]], maryland) //FitExtent used to fit the "Tile" for the viewer

  var geoPath = d3.geoPath().projection(projection) //initialize the path
 //initialize the path

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


    var radius = d3.scaleSqrt()
      .domain([1000, 5000])
      .range([0,11])

      console.log("here")


  d3.select("svg.pivotCount").selectAll("circle")
		.data(locations)
    .enter()
		.append("circle")
		.attr("cx", function (d) { console.log(projection(d)[0]); return projection(d)[0]})
		.attr("cy", function (d) { return projection(d)[1];})
		.attr("r", function (d) {console.log(Math.round(d[2]/1000)); return Math.round(d[2]/1000)}   )
		.attr("fill", colorScheme);

}


function getColor(selectObject){
    colorScheme = selectObject.value;
    d3.select("svg").selectAll("*").remove();
    d3.select("svg.legend").selectAll("*").remove();
    renderChart()
}


renderChart()
