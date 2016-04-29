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

var temp;

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
  if (window.innerHeight < 600) {
    height = 600;
  }
  graph.attr("width",width)
  .attr("height",height);

  agg_data = aggParamStats(curParam);

  //filter agg_data to get rid of data points
  //where that genre didn't exist in that year
  var filteredAggData = agg_data;

  filteredAggData.forEach(function(genreObj, i) {
    genreObj.years = _.filter(genreObj.years, function(year) {
      return year.max != -Infinity && year.min != Infinity });
  })

  var averages = _.chain(filteredAggData)
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
    line[c['genre']] = d3.svg.line()
    .interpolate("basis")
    .x(function (d) { return xScale(d['year']); })
    .y(function (d) {
      var y = d['avg'];
      if (y == 0) {
        return yScale(0);
      }
      else {
        return yScale(d['avg']);
      }
    })
    .defined(function(d) { return d ['avg'] != 0; });

    //genre->color

    // Draw path of datapoint
    drawnPath[c['genre']] = graph.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", colors[i])
    .attr("stroke-width", "2px")
    .attr("opacity", "0.7")
    .transition()
    .duration(300)
    .attr("d", line[c['genre']](c['years']));


  });

  graph.on("mousemove", function() {
    graph.selectAll("circle.mousedot").remove();
    graph.selectAll("line.mouseline").remove();
    graph.selectAll("rect.mouseback").remove();
    graph.selectAll("text.mousetext").remove();

    var ypos = yScale.invert(d3.mouse(this)[1]);
    var xmouse = d3.mouse(this)[0];

    var xRange = xScale.range();
    var xDomain = xScale.domain();
    var closest = xRange[0];
    var minDist = Infinity;
    _.each(xRange, function(n, i) {
      var diff = Math.abs(n - xmouse);
      if (diff < minDist) {
        minDist = diff;
        closest = xDomain[i];
      }
    });

    var xpos = closest;
    var raw_xpos = d3.mouse(this)[0];
    var xDomain = xScale.domain();
    var xmin = xScale(xDomain[0]);
    var xmax = xScale(xDomain[xDomain.length-1]);

    var ymin = yScale.domain()[0];
    var ymax = yScale.domain()[yScale.domain().length-1];
    if (ypos >= ymin && ypos <= ymax &&
        raw_xpos >= xmin && raw_xpos <= xmax)
    {
      graph.append("circle")
      .attr("cx", xScale(xpos))
      .attr("cy", yScale(ypos))
      .attr("r", 2)
      .attr("class", "mousedot");

      graph.append("line")
      .attr("x1", xScale(xpos))
      .attr("x2", xScale(xpos))
      .attr("y1", yScale(ymin))
      .attr("y2", yScale(ymax))
      .attr("stroke", "black")
      .attr("stroke-width", "2px")
      .style("opacity", 0.25)
      .attr("class", "mouseline");

      var fourdig = d3.format(".2r");

      graph.append("rect")
      .attr("x", xScale(xpos) + 15)
      .attr("y", yScale(ypos) - 35)
      .attr("width", 85)
      .attr("height", 20)
      .attr("fill", "white")
      .attr("class", "mouseback");

      graph.append("text")
      .attr("x", xScale(xpos) + 20)
      .attr("y", yScale(ypos) - 20)
      .text("(" + xpos + ", " + fourdig(ypos) + ")")
      .attr("class", "mousetext");
    }
  });

  graph.select(".legend")
  .attr("transform", "translate("+(width-180)+","  + 60+ ")");


  animStop();
}
