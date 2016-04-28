// /**************************
//  *       global vars      *
//  /**************************/

//  var genres = ["rock",
//  "alternative/indie",
//  "electronic/dance",
//  "soul",
//  "classical/soundtrack",
//  "pop",
//  "hip-hop/rnb",
//  "disco",
//  "swing",
//  "folk",
//  "country",
//  "jazz",
//  "religious",
//  "blues",
//  "reggae"];
//  var colors = ["#3366cc",
//  "#dc3912",
//  "#ff9900",
//  "#109618",
//  "#990099",
//  "#0099c6",
//  "#dd4477",
//  "#66aa00",
//  "#b82e2e",
//  "#316395",
//  "#994499",
//  "#22aa99",
//  "#aaaa11",
//  "#6633cc",
//  "#e67300"];
//  var xScaleTrend;
//  var yScaleTrend;
//  var xAxisTrend;
//  var yAxisTrend;
//  var globalData;
//  var songs = {};
//  var sentimentLine;
//  var readabilityLine;
//  var repetitionLine;
//  var currVar = 'sentiment';

//  function setVisible(activeGenres) {
//   var currVarG = d3.select("#"+currVar+"G");
//   //hide everything first
//   d3.selectAll(".trendline").attr("visibility", "hidden");

//   if (activeGenres == undefined) {
//     currVarG.selectAll(".trendline").attr("visibility", "visible");
//     return;
//   }
//   else if (activeGenres.length == 0) {
//     currVarG.selectAll(".trendline").attr("visibility", "hidden");
//     return;
//   }

//   _.each(activeGenres, function(g) {
//     var genreID = g;
//     if (g.includes('/')) {
//       genreID = g.substr(0, g.indexOf('/'))
//     }
//     d3.select('#'+currVar+"_"+genreID).attr("visibility", "visible");
//   })
// }

// function mouseOver() {
//   console.log("MOUSEOVER!");
// }

// function mousemove() {
//   var coords = d3.mouse(this);

//   // focus.attr("transform", "translate(" + xScaleTrend.invert(coords[0]) + "," + yScaleTrend.invert(coords[1]) + ")");
//   // focus.select("text").text("TEST
//   //   ");
// }

// function graphTrend(data) {
//   globalData = data;
//   var padding = 70;
//   var height = 400;
//   var width = "100%";
//   var widthpx = $("#trend").width();
//   var innerHeight = height-padding*2;
//   var innerWidth = widthpx-padding*3.5;

//   var svg = d3.select('#trend').append("svg")
//   .attr("height", height)
//   .attr("width", widthpx)
//   var innerSvg = svg.append("g")
//   .attr("transform", "translate(" +
//         padding + "," + padding + ")");

//   xScaleTrend = d3.scale.ordinal()
//   .domain(d3.range(1950, 2016))
//   .rangePoints([0, innerWidth], 10);

//   yScaleTrend = d3.scale.linear()
//   .domain([-0.2,0.4])
//   .range([innerHeight,0]);

//   var xAxisTrend = d3.svg.axis()
//   .scale(xScaleTrend)
//   .tickValues(xScaleTrend.domain().filter(function(d,i) { return !(d%5); }))
//   .orient("bottom");
//   var yAxisTrend = d3.svg.axis().scale(yScaleTrend).orient("left");

//   svg.append("text")
//   .attr("x", widthpx/2-70)
//   .attr("y", height - padding/4)
//   .style("text-anchor", "middle")
//   .text("YEARS");

//   svg.append("text")
//   .attr("x", padding/2.5)
//   .attr("y", height/2)
//   .style("text-anchor", "middle")
//   .attr("transform", "rotate(-90,"+padding/2.5+","+height/2+")")
//   .text("SENTIMENT")
//   .attr("id", "yLabel");

//   innerSvg.append("g")
//   .attr("transform", "translate(0," + innerHeight +")")
//   .call(xAxisTrend);

//   innerSvg.append("g")
//   .attr("class", "yaxis")
//   .attr("transform", "translate(0,0)")
//   .call(yAxisTrend);

//   /*******************************
//    *        GRAPH OVERLAY        *
//    /******************************/

//   // var focus = innerSvg.append("g")
//   //     .attr("class", "focus")
//   //     .style("display", "none");

//   // focus.append("circle")
//   //     .attr("r", 4.5);

//   // focus.append("text")
//   //     .attr("x", 9)
//   //     .attr("dy", ".35em");

//   // innerSvg.append("rect")
//   //     .attr("class", "overlay")
//   //     .attr("width", innerWidth)
//   //     .attr("height", innerHeight)
//   //     .on("mouseover", function() { focus.style("display", null); })
//   //     .on("mouseout", function() { focus.style("display", "none"); })
//   //     .on("mousemove", mousemove);

//   /*******************************
//    *         LINE & PATH         *
//    /******************************/

//    sentimentLine = d3.svg.line()
//    .x(function (d) { return xScaleTrend(d.year); })
//    .y(function (d) { return yScaleTrend(d.pos - d.neg); })
//    .interpolate("basis");
//    readabilityLine = d3.svg.line()
//    .x(function (d) { return xScaleTrend(d.year); })
//    .y(function (d) { return yScaleTrend(d.fl); })
//    .interpolate("basis");
//    repetitionLine = d3.svg.line()
//    .x(function (d) { return xScaleTrend(d.year); })
//    .y(function (d) { return yScaleTrend(d.rep); })
//    .interpolate("basis");

//   // var genres = ["alternative/indie","blues"];

//   genres.forEach(function(genre, i) {
//     var songsOfGenre = filter(data, 1950, 2015, [genre]);
//     songs[genre] = {};
//     songs[genre]['info'] = averageSentiAllYears(songsOfGenre);
//     songs[genre]['color'] = colors[i];
//   })
//   console.log(songs);

//   var sentimentG = innerSvg.append("g").attr("id", "sentimentG");
//   var readabilityG = innerSvg.append("g").attr("id", "readabilityG");
//   var repetitionG = innerSvg.append("g").attr("id", "repetitionG");

//   genres.forEach(function(genre) {
//     var genreID = genre;
//     if (genre.includes('/')) {
//       genreID = genre.substr(0, genre.indexOf('/'))
//     }
//     //append path to the arrays for each type of YVAR
//     sentimentG.append("path")
//     .attr("class", "trendline")
//     .attr("id", "sentiment_"+genreID)
//     .attr("d", sentimentLine(songs[genre]['info']))
//     .attr("fill", "none")
//     .attr("stroke", songs[genre]['color'])
//     .attr("stroke-width", "2.5px")
//     .on("mouseover", function() {console.log("MOUSEOVER"); });

//     readabilityG.append("path")
//     .attr("class", "trendline")
//     .attr("id", "readability_"+genreID)
//     .attr("d", readabilityLine(songs[genre]['info']))
//     .attr("fill", "none")
//     .attr("stroke", songs[genre]['color'])
//     .attr("stroke-width", "2.5px");

//     repetitionG.append("path")
//     .attr("class", "trendline")
//     .attr("id", "repetition_"+genreID)
//     .attr("d", repetitionLine(songs[genre]['info']))
//     .attr("fill", "none")
//     .attr("stroke", songs[genre]['color'])
//     .attr("stroke-width", "2.5px");
//   });

//   /******************************
//    *          LEGEND            *
//    /******************************/
//    var legend = svg.append("g")
//    .attr("transform", "translate("+(widthpx-padding*2.3)+"," + padding + ")");

//    genres.forEach(function(genre, i) {
//     var y = i*18
//     legend.append("rect")
//     .attr("x",0)
//     .attr("y",y)
//     .attr("width", 15)
//     .attr("height", 15)
//     .style("fill", songs[genre]['color']);

//     legend.append("text")
//     .attr("x",20)
//     .attr("y",y+13)
//     .text(genre)
//     .attr("fill", "black");
//   })

//   /*************************************
//    *    DEFAULT: SENSTIMENT GRAPH      *
//    /*************************************/

//    genres.forEach(function(genre) {
//     var genreID = genre;
//     if (genre.includes('/')) {
//       genreID = genre.substr(0, genre.indexOf('/'))
//     }

//     d3.select('#readability_'+genreID).attr("visibility", "hidden");
//     d3.select('#repetition_'+genreID).attr("visibility", "hidden");
//   });


//  }

//  function updateGraph(yVariable) {
//   currVar = yVariable;
//   console.log("currVar: " + currVar);

//   document.getElementById("button").innerHTML = "&#9662;  " + yVariable;
//   d3.select("#yLabel").text(yVariable);

//   setVisible(getActiveGenres());
//   rescale(yVariable);
//   regraph(yVariable);
//   animStop();
// }

// function rescale(yVariable) {
//   console.log("rescaling!");

//   var min;
//   var max;
//   if (yVariable == 'sentiment') {
//     min = -0.2;
//     max = 0.4;
//   }
//   else if (yVariable == 'readability') {
//     min = 70;
//     max = 110;
//   }
//   else if (yVariable == 'repetition') {
//     min = 0;
//     max = 70;
//   }

//   yScaleTrend.domain([min, max]);
//   yAxisTrend = d3.svg.axis().scale(yScaleTrend).orient("left");

//   var svg = d3.select("#trend").transition();

//   svg.select(".yaxis")
//   .duration(750)
//   .call(yAxisTrend);

// }

// function regraph(yVariable) {
//   console.log('regraphing!');

//   // Make the changes
//   var svg = d3.select("#trend").transition();

//   var d;
//   genres.forEach(function (genre) {

//     var genreID = genre;
//     if (genre.includes('/')) {
//       genreID = genre.substr(0, genre.indexOf('/'))
//     }

//     var line;
//     if (yVariable == 'sentiment') {
//       line = sentimentLine;
//     }
//     else if (yVariable == 'readability') {
//       line = readabilityLine;
//     }
//     else if (yVariable == 'repetition') {
//       line = repetitionLine;
//     }

//     var id = "#" + yVariable.toLowerCase() + "_" + genreID;
//     svg.select(id)
//     .duration(750)
//     .attr("d", line(songs[genre]['info']));

//   });

// }

// /* When the user clicks on the button,
// toggle between hiding and showing the dropdown content */
// function myFunction() {
//   document.getElementById("myDropdown").classList.toggle("show");
// }

// function createDropdown() {
//   // Close the dropdown if the user clicks outside of it
//   window.onclick = function(event) {
//     if (!event.target.matches('.dropbtn')) {

//       var dropdowns = document.getElementsByClassName("dropdown-content");
//       var i;
//       for (i = 0; i < dropdowns.length; i++) {
//         var openDropdown = dropdowns[i];
//         if (openDropdown.classList.contains('show')) {
//           openDropdown.classList.remove('show');
//         }
//       }
//     }
//   }
// }

// function graphScatter(data) {

//   //  assume we have year
//   var padding = 70;
//   var height = window.innerHeight - (3 * padding);
//   var width = window.innerWidth - (2 * padding);
//   var widthpx = $("#scatter").width();
//   var innerHeight = height-padding*2;
//   var innerWidth = widthpx-padding*3.5;

//   var svg = d3.select('#scatter').append("svg")
//   .attr("height", height)
//   .attr("width", widthpx);


//   var innerSvg = svg.append("g")
//   .attr("transform", "translate(" +
//         padding + "," + padding + ")");
//   //.attr("style","stroke: #000066; fill: #3333ff;");

//   //innerSvg.append("circle").attr("cx",0).attr("cy",0).attr("r",100);

//   var yScale = d3.scale.ordinal()
//   .domain(d3.range(1, 100))
//   .rangePoints([0, innerHeight],10);

//   var xScale = d3.scale.ordinal()
//   .domain(d3.range(1950, 2016))
//   .rangePoints([0, innerWidth], 10);

//   var yAxis = d3.svg.axis()
//   .scale(yScale)
//   .tickValues(yScale.domain().filter(function(d) { return (!(d%10)) || d===1 ; }))
//   .orient("left");

//   var xAxis = d3.svg.axis()
//   .scale(xScale)
//   .tickValues(xScale.domain().filter(function(d,i) { return !(d%5); }))
//   .orient("buttom");

//   svg.append("text")
//   .attr("x", widthpx/2)
//   .attr("y", height - padding/4)
//   .style("text-anchor", "middle")
//   .text("YEARS");

//   svg.append("text")
//   .attr("x", padding/2.5)
//   .attr("y", height/2)
//   .style("text-anchor", "middle")
//   .attr("transform", "rotate(-90,"+padding/2.5+","+height/2+")")
//   .text("RANK")
//   .attr("id", "yLabel");

//   innerSvg.append("g")
//   .attr("transform", "translate(0," + innerHeight +")")
//   .call(xAxis);

//   innerSvg.append("g")
//   .attr("transform", "translate(0,0)")
//   .call(yAxis);

//   /******************************
//    *          LEGEND            *
//    /******************************/
//    var legend = svg.append("g")
//    .attr("transform", "translate("+(widthpx-padding*2.3)+"," + padding + ")");

//    genres.forEach(function(genre, i) {
//     var y = i*18
//     legend.append("rect")
//     .attr("x",0)
//     .attr("y",y)
//     .attr("width", 15)
//     .attr("height", 15)
//     .style("fill", songs[genre]['color']);

//     legend.append("text")
//     .attr("x",20)
//     .attr("y",y+13)
//     .text(genre)
//     .attr("fill", "black");
//   })

//    var testdata = filter(data, 1950 , 2010, ["swing"]);


// // //  TODO: make different xAxis by dropdown;
// //   console.log(testdata);

// testdata.forEach( function(d) {
//   innerSvg.append("circle")
//   .attr("class", "dot")
//   .attr("cx", xScale(d.year))
//   .attr("cy",yScale(d.pos))
//   .style("opacity", 0.3)
//   .attr("r",3);
// })
// }

// createDropdown();
// // graphTrend();