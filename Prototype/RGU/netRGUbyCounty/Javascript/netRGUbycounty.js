//Dynamic text for Captions


Header = "<b>Shentel: Net RGU by county</b>"
Header2 = "April 2017"
source = "<i><b>Source:</b> Shentel </i>"
legendHeader = "<b>Net RGUs </b>"
Description1 = "Map Type: SVG"
Description2 = "Map Feature: Summarized by Area"

PopUpText_Description = "Net RGUs: "


document.getElementById("Header").innerHTML = Header;
document.getElementById("Header2").innerHTML = Header2;
document.getElementById("Source").innerHTML = source;
document.getElementById("legendHeader").innerHTML = legendHeader;
document.getElementById("Description1").innerHTML = Description1;
document.getElementById("Description2").innerHTML = Description2;
//-----------------------------------------------------------------

console.log('hello')
var income_domainPOS = []
var income_domainNEG = []
var colorRange = 3
var pivotcountData = d3.map();
var pivotcountDataArray= [];
var scaletype = "linear"
var colorScheme = "Greens"

function renderChart(){
  console.log('render')

d3.queue() //used to ensure that all data is loaded into the program before execution
  .defer(d3.json, "4StateMap/fourstates.topojson")
  .defer(d3.csv, "Data/netRGUbyCounty.csv", function(d) {
    if(isNaN(d.netRGUs)){
      pivotcountData.set(d.state + '-' + d.county, 0);//stateFP
      pivotcountDataArray.push(0)
    }
    else{
      pivotcountData.set(d.state + '-' + d.county, +d.netRGUs)//sets the key as the id plus converts string to int
      pivotcountDataArray.push(+d.netRGUs)
    }
  })
  .await(ready);
}


function ready(error, data){//ready function starts the program once all data is loaded
  if(error) throw error;


  //max-min are obtained for helper.js range function
  //Used to create a the domain array for variance in data
  var max = d3.max(pivotcountDataArray, function(d) { return d;});
  var min = d3.min(pivotcountDataArray, function(d) { return d;});


  //returns an array of integers
  income_domainPOS = range(max, 0, colorRange);
  income_domainNEG = rangeNEG(0, min, colorRange);

  //converts the array of integers to string, and reverses for legend purposes
  legendTextPOS = income_domainPOS.map(String).reverse()
  legendTextNEG = income_domainNEG.map(String).reverse()


   //want to give multiple options for types of graphs
  var income_color = {}


  console.log(scaletype)
  console.log(colorScheme)

  if(scaletype == "linear")
  {
    income_colorPOS = d3.scaleLinear() //scaleLinear for D3.V4
      .domain(income_domainPOS)
      .range(colorbrewer["Greens"][colorRange]);

    income_colorNEG = d3.scaleLinear() //scaleLinear for D3.V4
      .domain(income_domainNEG)
      .range(colorbrewer["Reds"][colorRange]);
  }
  else
  {
    income_colorPOS = d3.scaleLinear() //scaleLinear for D3.V4
      .domain(income_domainPOS)
      .range(colorbrewer["Greens"][colorRange]);

    income_colorNEG = d3.scaleLinear() //scaleLinear for D3.V4
      .domain(income_domainNEG)
      .range(colorbrewer["Reds"][colorRange]);
  }

  //USMap
  var usMap = topojson.feature(data, {
    type: "GeometryCollection",
    geometries: data.objects.fourstates.geometries//grabbing the points to create the polygon points so it can trace the Map
  });

  //identify projection -using geoalbersUSA
  var projection = d3.geoAlbersUsa() //geoAlbersUsa is the basic map projection, there are many more. This is the best for plane US view.
    .fitExtent([[0,0],[700,500]], usMap) //FitExtent used to fit the "Tile" for the viewer

  var geoPath = d3.geoPath().projection(projection) //initialize the path


  // Define the div for the tooltip
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



  d3.select("svg.pivotCount").selectAll("path") //assign the projected map to the svg in HTML
    .data(usMap.features)//.data is given from the argument from the ready function, includes features on the map
    .enter()
    .append("path")
    .attr("d", geoPath)
    .style("stroke", "#808080") //These two lines are used to create the outline of regions on the map whether its states or counties... etc
    .style("stroke-width", "2")
    .attr("fill", function(d){
      var value = pivotcountData.get(d.properties.STATEFP + '-' + d.properties.NAME); //d.properties.<KEY> -> this is what you want match the topojson to the CSV
      if (value != undefined)
      {
        if(value < 0){
          return (income_colorNEG(value));
        }
        else{
          return(income_colorPOS(value));
        }
      }
      else
      {
        return "lightgrey"
      }
    })
    .on("mouseover", function(d) {
      var value = pivotcountData.get(d.properties.STATEFP + '-' + d.properties.NAME);
      var state = pivotcountData.get(d.netRGUs)
    	div.transition()
      	   .duration(200)
           .style("opacity", .9)
           var text = "county: "+ d.properties.NAME +"<br/>" + PopUpText_Description + value;
           div.html(text)
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
	})
    .on("mouseout", function(d) {
        div.transition()
           .duration(500)
           .style("opacity", 0);
    });

//Creating a legend  --------------------------------------------------------------------
var legend = d3.select("svg.legend")
  .attr("width", 200)
  .attr("height", 200)
  .selectAll("d")
  .data(income_colorPOS.domain().slice().reverse())
  .enter()
  .append("g")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", income_colorPOS);

  legend.append("text")
    .data(legendTextPOS)
    .attr("x",24)
    .attr("y",9)
    .attr("dy",".30em")
    .text(function(d){return d;});

var legend2 = d3.select("svg.legend2")
  .attr("width", 200)
  .attr("height", 200)
  .selectAll("d")
  .data(income_colorNEG.domain().slice().reverse())
  .enter()
  .append("g")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend2.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", income_colorNEG);

  legend2.append("text")
    .data(legendTextNEG)
    .attr("x",24)
    .attr("y",9)
    .attr("dy",".30em")
    .text(function(d){return d;});
}

// document.getElementById("Linear").addEventListener('click', function(){
//   scaletype = "linear"
//   d3.select("svg").selectAll("*").remove();
//   renderChart()
// })
//
// document.getElementById("Logarithmic").addEventListener('click', function(){
//   scaletype = "Logarithmic"
//   d3.select("svg").selectAll("*").remove();
//   renderChart()
// })

document.getElementById("colorRange3").addEventListener('click', function (){
  colorRange = "3"
  d3.select("svg").selectAll("*").remove();
  d3.select("svg.legend").selectAll("*").remove();
  d3.select("svg.legend2").selectAll("*").remove();
  renderChart()
})

document.getElementById("colorRange6").addEventListener('click', function(){
  colorRange = "6"
  d3.select("svg").selectAll("*").remove();
  d3.select("svg.legend").selectAll("*").remove();
  d3.select("svg.legend2").selectAll("*").remove();
  renderChart()
})

document.getElementById("colorRange9").addEventListener('click', function(){
  colorRange = "9"
  d3.select("svg").selectAll("*").remove();
  d3.select("svg.legend").selectAll("*").remove();
  d3.select("svg.legend2").selectAll("*").remove();
  renderChart()
})

function getColor(selectObject){
    colorScheme = selectObject.value;
    d3.select("svg").selectAll("*").remove();
    d3.select("svg.legend").selectAll("*").remove();
    d3.select("svg.legend2").selectAll("*").remove();
    renderChart()
}

// var getColor = document.getElementById("selectOpt", function(){
//   var colorScheme = getColor.options[getColor.selectedIndex].value;
//   d3.select("svg").selectAll("*").remove();
//   d3.select("svg.legend").selectAll("*").remove();
//   renderChart()
// });
//
//
// var e


renderChart()
