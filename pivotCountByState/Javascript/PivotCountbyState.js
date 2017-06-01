var income_domain = []
var colorRange = 6

//var income_domain = [1, 30, 100, 500, 21000, 120000]

function renderChart(){




var pivotcountData = d3.map();
var pivotcountDataArray= [];

d3.queue()
  .defer(d3.json, "USbyState/USMap.topojson")
  .defer(d3.csv, "Data/pivotcountofbillState.csv", function(d) {
    if(isNaN(d.count)){
      pivotcountData.set(d.state, 0);
      pivotcountDataArray.push(0)
    }
    else{
      pivotcountData.set(d.state, +d.count)//sets the key as the id plus converts string to int
      pivotcountDataArray.push(+d.count)
    }
  })
  .await(ready)


function ready(error, data){
  if(error) throw error;



  var max = d3.max(pivotcountDataArray, function(d) { return d;});
  var min = d3.min(pivotcountDataArray, function(d) { return d;});



  income_domain = range(max, min, colorRange);
  var legendText = income_domain.map(string);


  var scaletype = "linear"
  var income_color = {}
  var quantile = {}

  if(scaletype == "linear")
  {
    income_color = d3.scaleLinear() //
      .domain(income_domain)
      .range(["rgb(158,202,225)","rgb(107,174,214)","rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)"]);
  }
  else
  {
    income_color = d3.scaleLog() //
        .base(Math.E)
        .domain(income_domain)
        .range(["rgb(158,202,225)","rgb(107,174,214)","rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)"]);
  }

  //USMap
  var usMap = topojson.feature(data, {
    type: "GeometryCollection",
    geometries: data.objects.USMap.geometries
  });

  //identify projection -using geoalbersUSA
  var projection = d3.geoAlbersUsa()
    .fitExtent([[0,0],[700,500]], usMap)

  var geoPath = d3.geoPath().projection(projection)

  d3.select("svg.pivotCount").selectAll("path")
    .data(usMap.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .style("stroke", "#fff")
    .style("stroke-width", "2")
    .attr("fill", function(d){
      var value = pivotcountData.get(d.properties.STUSPS);
      return (value != 0 ? income_color(value) : "red");
    })
    .on("mouseover", function(d) {
    	div.transition()
      	   .duration(200)
           .style("opacity", .9);
           div.text(d.place)
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
	})
    .on("mouseout", function(d) {
        div.transition()
           .duration(500)
           .style("opacity", 0);
    });


var legend = d3.select("svg.legend")
  .attr("width", 200)
  .attr("height", 200)
  .selectAll("d")
  .data(income_color.domain().slice().reverse())
  .enter()
  .append("g")
  .attr("transform", function(d, i) { return "translate(0," +i * 15 + ")"; });

  legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", income_color);

  legend.append("text")
    .data(legendText)
    .attr("x",24)
    .attr("y",9)
    .attr("dy",".30em")
    .text(function(d){return d;});

  }
}

renderChart()
