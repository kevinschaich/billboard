var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300"];

var graph;
var xScale;
var yScale;
var xAxis;
var yAxis;
var xAxisLine;
var yAxisLine;
var line = {};
var drawnPath = {};
var agg_data;
var padding = 120;
var margin = 60;
var height = window.innerHeight - 2 * margin;
var width = window.innerWidth - 2 * margin;

function graphInit(data) {
  graph = d3.select("#graph2").append("svg")
  .attr("width", width)
  .attr("height",height);

  // Scales
  xScale = d3.scale.ordinal();
  yScale = d3.scale.linear();

  // Axes
  xAxis = d3.svg.axis().orient("bottom");
  yAxis = d3.svg.axis().orient("left").ticks(20);

  xAxisLine = graph.append("g");

  yAxisLine = graph.append("g");

  // Labels
  graph.append("text")
  .attr("class", "axis")
  .attr("x", width / 2)
  .attr("y", padding / 2)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "central")
  .text("Year");

  graph.append("text")
  .attr("class", "axis")
  .attr("x", padding / 5)
  .attr("y", height / 2)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "central")
  .attr("transform", "rotate(-" + 90 +
        "," + padding / 5 + "," + height / 2 + ")")
  .text("Number of Duplicates");

  graph.append("text")
  .attr("class", "axis")
  .attr("x", width / 2)
  .attr("y", height - (padding / 4))
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "central")
  .text("Year");

  // document.getElementById("stats").innerText += JSON.stringify(year, null, 2);
  agg_data = aggParamStats("sentiment");

  updateGraph(data);
}

function updateGraph (data) {
  agg_data = aggParamStats("sentiment");
  var averages = _.chain(agg_data)
  .pluck("years")
  .flatten()
  .pluck("avg")
  .values();

  // document.getElementById("stats").innerText += JSON.stringify(, null, 2);

  xScale.domain(_.range(parseInt(getSliderMin()), parseInt(getSliderMax()) + 1))
  .rangePoints([padding, width - padding]);
  yScale.domain([averages.min(), averages.max()]).range([height - padding, padding]);

  // Axes
  xAxis.scale(xScale)
  .tickValues(xScale.domain().filter(function(d,i) { return !(d%5); }));
  yAxis.scale(yScale).ticks(20);

  xAxisLine
  .attr("transform", "translate(0," + (height - padding / 1.5) + ")")
  .attr("class", "axis")
  .transition()
  .duration(300)
  .call(xAxis);

  yAxisLine
  .attr("transform", "translate(" + padding / 1.5 + ",0)")
  .attr("class", "axis")
  .transition()
  .duration(300)
  .call(yAxis);

  graph.selectAll("path.line").remove();
  _.each(agg_data, function(c, i) {

    // Create path of datapoint
    line[c['genre']] = d3.svg.line().interpolate("basis")
    .x(function (d) { return xScale(d['year']); })
    .y(function (d) {
      var y = d['avg'];
      if (y == 0) {
        return yScale(0);
      }
      else {
        return yScale(d['avg']);
      }
    });

    // Draw path of datapoint
    drawnPath[c['genre']] = graph.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", colors[i])
    .attr("stroke-width", "2px")
    .transition()
    .duration(300)
    .attr("d", line[c['genre']](c['years']));


  });

  animStop();
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function changeParam() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}