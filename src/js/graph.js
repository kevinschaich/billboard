/**************************
 *       global vars      *
/**************************/

var genres = ["rock", 
              "alternative/indie", 
              "electronic/dance", 
              "soul", 
              "classical/soundtrack", 
              "pop", 
              "hip-hop/rnb", 
              "disco", 
              "swing", 
              "folk", 
              "country", 
              "jazz", 
              "religious", 
              "blues", 
              "reggae"];
var colors = ["#3366cc", 
              "#dc3912", 
              "#ff9900", 
              "#109618", 
              "#990099", 
              "#0099c6", 
              "#dd4477", 
              "#66aa00", 
              "#b82e2e", 
              "#316395", 
              "#994499", 
              "#22aa99", 
              "#aaaa11", 
              "#6633cc", 
              "#e67300"];
var xScaleTrend;
var yScaleTrend;
var xAxisTrend;
var yAxisTrend;
var globalData;
var songs = {};
var sentimentLine;
var difficultyLine;
var repetitionLine;

function graphTrend(data) {  
  globalData = data;
  var padding = 70;
  var height = 400;
  var width = "100%";
  var widthpx = $("#trend").width();
  var innerHeight = height-padding*2;
  var innerWidth = widthpx-padding*2;

  var svg = d3.select('#trend').append("svg")
              .attr("height", height)
              .attr("width", widthpx)
  var innerSvg = svg.append("g")
              .attr("transform", "translate(" + 
                  padding + "," + padding + ")");

  xScaleTrend = d3.scale.ordinal()
          .domain(d3.range(1950, 2016))
          .rangePoints([0, innerWidth], 10);

  yScaleTrend = d3.scale.linear()
          .domain([-0.2,0.4])
          .range([innerHeight,0]);

  var xAxisTrend = d3.svg.axis()
          .scale(xScaleTrend)
          .tickValues(xScaleTrend.domain().filter(function(d,i) { return !(d%5); }))
          .orient("bottom");
  var yAxisTrend = d3.svg.axis().scale(yScaleTrend).orient("left");

  svg.append("text")
    .attr("x", widthpx/2)
    .attr("y", height - padding/4)
    .style("text-anchor", "middle")
    .text("YEARS");

  svg.append("text")
    .attr("x", padding/2.5)
    .attr("y", height/2)
    .style("text-anchor", "middle")
    .attr("transform", "rotate(-90,"+padding/2.5+","+height/2+")")
    .text("SENTIMENT")
    .attr("id", "yLabel");

  innerSvg.append("g")
    .attr("transform", "translate(0," + innerHeight +")")
    .call(xAxisTrend);

  innerSvg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(0,0)")
    .call(yAxisTrend);

  // for each yvar, we must have n lines where n is the number of genres

  sentimentLine = d3.svg.line()
    .x(function (d) { return xScaleTrend(d.year); })
    .y(function (d) { return yScaleTrend(d.pos - d.neg); })
    .interpolate("basis");
  difficultyLine = d3.svg.line()
    .x(function (d) { return xScaleTrend(d.year); })
    .y(function (d) { return yScaleTrend(d.fl); })
    .interpolate("basis");
  repetitionLine = d3.svg.line()
    .x(function (d) { return xScaleTrend(d.year); })
    .y(function (d) { return yScaleTrend(d.rep); })
    .interpolate("basis");

  // var genres = ["alternative/indie","blues"];

  // songs = {};
  genres.forEach(function(genre, i) {
    var songsOfGenre = filter(data, 1950, 2015, [genre]);
    songs[genre] = {};
    songs[genre]['info'] = averageSentiAllYears(songsOfGenre);
    songs[genre]['color'] = colors[i];
  })
  console.log(songs);

  genres.forEach(function(genre) {
    var genreID = genre;
    if (genre.includes('/')) {
      genreID = genre.substr(0, genre.indexOf('/'))
    }
    //append path to the arrays for each type of YVAR
    innerSvg.append("path")
      .attr("class", "trendline")
      .attr("id", "sentiment_"+genreID)
      .attr("d", sentimentLine(songs[genre]['info']))
      .attr("fill", "none")
      .attr("stroke", songs[genre]['color'])
      .attr("stroke-width", "3px");

    innerSvg.append("path")
      .attr("class", "trendline")
      .attr("id", "difficulty_"+genreID)
      .attr("d", difficultyLine(songs[genre]['info']))
      .attr("fill", "none")
      .attr("stroke", songs[genre]['color'])
      .attr("stroke-width", "3px");

    innerSvg.append("path")
      .attr("class", "trendline")
      .attr("id", "repetition_"+genreID)
      .attr("d", repetitionLine(songs[genre]['info']))
      .attr("fill", "none")
      .attr("stroke", songs[genre]['color'])
      .attr("stroke-width", "3px");
  });

  //initialize to hide everything except sentiment
  genres.forEach(function(genre) {
    var genreID = genre;
    if (genre.includes('/')) {
      genreID = genre.substr(0, genre.indexOf('/'))
    }

    d3.select('#difficulty_'+genreID).attr("visibility", "hidden");
    d3.select('#repetition_'+genreID).attr("visibility", "hidden");
  });


}

function updateGraph(yVariable) {
  document.getElementById("button").innerHTML = yVariable;
  d3.select("#yLabel").text(yVariable);

  // TODO: update graph with the new yVar
  rescale(yVariable);
  regraph(yVariable);
}

function rescale(yVariable) {
  console.log("rescaling!");

  var min;
  var max;
  if (yVariable == 'Sentiment') {
    min = -0.2;
    max = 0.4;
  }
  else if (yVariable == 'Difficulty') {
    min = 70;
    max = 110;
  }
  else if (yVariable == 'Repetition') {
    min = 0;
    max = 70;
  }

  yScaleTrend.domain([min, max]);
  yAxisTrend = d3.svg.axis().scale(yScaleTrend).orient("left");
  
  var svg = d3.select("#trend").transition();

  svg.select(".yaxis")
    .duration(750)
    .call(yAxisTrend);  

}

function regraph(yVariable) {
  console.log('regraphing!');
  d3.selectAll(".trendline").attr("visibility", "hidden");

  // Make the changes
  var svg = d3.select("#trend").transition();

  var d;
  genres.forEach(function (genre) {

    var genreID = genre;
    if (genre.includes('/')) {
      genreID = genre.substr(0, genre.indexOf('/'))
    }

    var line;
    if (yVariable == 'Sentiment') {
      d3.select('#sentiment_'+genreID).attr("visibility", "visible");
      line = sentimentLine;
    }
    else if (yVariable == 'Difficulty') {
      d3.select('#difficulty_'+genreID).attr("visibility", "visible");
      line = difficultyLine;
    }
    else if (yVariable == 'Repetition') {
      d3.select('#repetition_'+genreID).attr("visibility", "visible");
      line = repetitionLine;
    }

    var id = "#" + yVariable.toLowerCase() + "_" + genreID;
    svg.select(id)
      .duration(750)
      .attr("d", line(songs[genre]['info']));

  });

}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function createDropdown() {
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
}

function graphScatter(data) {
  var padding = 70;
  var height = 400;
  var width = "100%";
  var widthpx = $("#scatter").width();
  var innerHeight = height-padding*2;
  var innerWidth = widthpx-padding*2;

  var svg = d3.select('#scatter').append("svg")
      .attr("height", height)
      .attr("width", widthpx);


  var innerSvg = svg.append("g")
      .attr("transform", "translate(" +
          padding + "," + padding + ")");
  //.attr("style","stroke: #000066; fill: #3333ff;");

  //innerSvg.append("circle").attr("cx",0).attr("cy",0).attr("r",100);

  var yScale = d3.scale.ordinal()
      .domain(d3.range(1, 100))
      .rangePoints([0, innerHeight],10);

  var xScale = d3.scale.ordinal()
      .domain(d3.range(1950, 2016))
      .rangePoints([0, innerWidth], 10);

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .tickValues(yScale.domain().filter(function(d) { return (!(d%10)) || d===1 ; }))
      .orient("left");

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .tickValues(xScale.domain().filter(function(d,i) { return !(d%5); }))
      .orient("buttom");

  svg.append("text")
      .attr("x", widthpx/2)
      .attr("y", height - padding/4)
      .style("text-anchor", "middle")
      .text("YEARS");

  svg.append("text")
      .attr("x", padding/2.5)
      .attr("y", height/2)
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-90,"+padding/2.5+","+height/2+")")
      .text("RANK")
      .attr("id", "yLabel");

  innerSvg.append("g")
      .attr("transform", "translate(0," + innerHeight +")")
      .call(xAxis);

  innerSvg.append("g")
      .attr("transform", "translate(0,0)")
      .call(yAxis);

  var testdata = filter(data, 1950 , 2010, ["swing"]);

// //  TODO: make different xAxis by dropdown;
//   console.log(testdata);

  testdata.forEach( function(d) {
    innerSvg.append("circle")
        .attr("class", "dot")
        .attr("cx", xScale(d.year))
        .attr("cy",yScale(d.pos))
        .style("opacity", 0.5)
        .attr("r",3);
  })
}

createDropdown();
// graphTrend();