var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300"];
var agg_genres = ["rock", "alternative/indie", "electronic/dance", "soul", "classical/soundtrack", "pop", "hip-hop/rnb", "disco", "swing", "folk", "country", "jazz", "religious", "blues", "reggae"];

var graph;
var curParam = "sentiment";
var curTitle = "Sentiment";
var title;
var xTitle;
var yTitle;
var xScale;
var yScale;
var xAxis;
var yAxis;
var xAxisLine;
var yAxisLine;
var line = {};
var drawnPath = {};
var agg_data;
var padding;
var margin = 60;
var xTickFrequency;
var yNumTicks;
var height = window.innerHeight - 2 * margin;
var width = window.innerWidth - 2 * margin;

function graphInit(data) {
  graph = d3.select("#graph2").append("svg");

  // Scales
  xScale = d3.scale.ordinal();
  yScale = d3.scale.linear();

  // Axes
  xAxis = d3.svg.axis().orient("bottom");
  yAxis = d3.svg.axis().orient("left").ticks(20);

  xAxisLine = graph.append("g");

  yAxisLine = graph.append("g");

  // Labels
  // title = graph.append("text")
  // .attr("class", "axis")
  // .attr("text-anchor", "middle")
  // .attr("alignment-baseline", "central")
  // .text("Year");

  yTitle = graph.append("text")
  .attr("class", "axis")
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "central")
  .text(curTitle);

  xTitle = graph.append("text")
  .attr("class", "axis")
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "central")
  .text("Year");

  /******************************
   *          LEGEND            *
  /******************************/
  var legend = graph.append("g")
    .attr("class", "legend")
    .attr("transform", "translate("+(width-margin*3)+","  + margin+ ")");

  // agg_genres.forEach(function(genre, i) {
  //   var y = i*18
  //   legend.append("rect")
  //     .attr("x",0)
  //     .attr("y",y)
  //     .attr("width", 15)
  //     .attr("height", 15)
  //     .style("fill", colors[i]);

  //   legend.append("text")
  //     .attr("x",20)
  //     .attr("y",y+13)
  //     .text(genre)
  //     .attr("fill", "black");
  // });

  updateGraph(data);
}

function updateGraph (data) {
  console.log(curParam);

  padding = 120;
  margin = 60;
  xTickFrequency = 5;
  yNumTicks = 20;

  if( window.innerWidth < 768 ) {
    margin = 5;
    xTickFrequency = 10;
  }
  if (window.innerHeight < 700) {
    yNumTicks = 5;
  }
  height = window.innerHeight - 2 * margin;
  width = window.innerWidth - 2 * margin;
  graph.attr("width",width)
  .attr("height",height);

  agg_data = aggParamStats(curParam);

  var averages = _.chain(agg_data)
  .pluck("years")
  .flatten()
  .pluck("avg")
  .values();

  // document.getElementById("stats").innerText += JSON.stringify(, null, 2);

  xScale.domain(_.range(parseInt(getSliderMin()), parseInt(getSliderMax()) + 1))
  .rangePoints([padding, width - padding*2]);
  yScale.domain([averages.min(), averages.max()]).range([height - padding, padding / 2]);

  // Axes
  xAxis.scale(xScale)
  .tickValues(xScale.domain().filter(function(d,i) { return !(d % xTickFrequency); }));
  yAxis.scale(yScale).ticks(yNumTicks);

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

  // title
  // .attr("x", width / 2)
  // .attr("y", padding / 4);

  yTitle
  .text(curTitle)
  .attr("x", padding / 5)
  .attr("y", height / 2)
  .attr("transform", "rotate(-" + 90 +
        "," + padding / 5 + "," + height / 2 + ")");

  xTitle
  .attr("x", (width-padding*2)/2+padding/2)
  .attr("y", height - (padding / 4));

  var legend = d3.select(".legend");
  legend.selectAll("rect").remove();
  legend.selectAll("text").remove();

  graph.selectAll("path.line").remove();

  //filter agg_data to get rid of data points 
  //where that genre didn't exist in that year
  var filteredAggData = agg_data;

  filteredAggData.forEach(function(genreObj, i) {
    genreObj.years = _.filter(genreObj.years, function(year) { 
      return year.max != -Infinity && year.min != Infinity });
  })

  _.each(filteredAggData, function(c, i) {

    //update legend according to active genres
    var y = i*18
    legend.append("rect")
      .attr("x",0)
      .attr("y",y)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", colors[i]);

    legend.append("text")
      .attr("x",20)
      .attr("y",y+13)
      .text(c['genre'])
      .attr("fill", "black");

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

    //genre->color

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

  graph.select(".legend")
    .attr("transform", "translate("+(width-margin*3)+","  + margin+ ")");


  animStop();
}
