function graphTrend(data) {  
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

  var xScale = d3.scale.ordinal()
          .domain(d3.range(1950, 2016))
          .rangePoints([0, innerWidth], 10);

  var yScale = d3.scale.linear()
          .domain([0,1])
          .range([innerHeight,0]);

  var xAxis = d3.svg.axis()
          .scale(xScale)
          .tickValues(xScale.domain().filter(function(d,i) { return !(d%5); }))
          .orient("bottom");
  var yAxis = d3.svg.axis().scale(yScale).orient("left");

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
    .call(xAxis);

  innerSvg.append("g")
    .attr("transform", "translate(0,0)")
    .call(yAxis);

  // for each yvar, we must have n lines where n is the number of genres

  var sentimentLine = d3.svg.line()
    .x(function (d) { return xScale(d.year); })
    .y(function (d) { return yScale(d.pos); })
    .interpolate("basis");
  var difficultyLine = d3.svg.line()
    .x(function (d) { return xScale(d.year); })
    .y(function (d) { return yScale(d.fl); })
    .interpolate("basis");
  var repetitionLine = d3.svg.line()
    .x(function (d) { return xScale(d.year); })
    .y(function (d) { return yScale(d.rep); })
    .interpolate("basis");

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

  songs = {};
  genres.forEach(function(genre) {
    var songsOfGenre = filter(data, 1950, 2015, [genre]);
    songs[genre] = averageSentiAllYears(songsOfGenre);
  })
  console.log(songs);

  genres.forEach(function(genre) {
    //append path to the arrays for each type of YVAR
    innerSvg.append("path")
      .attr("id", "sentiment_"+genre)
      .attr("d", sentimentLine(songs[genre]))
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", "3px");

    innerSvg.append("path")
      .attr("id", "difficulty_"+genre)
      .attr("d", difficultyLine(songs[genre]))
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", "3px");

    innerSvg.append("path")
      .attr("id", "repetition_"+genre)
      .attr("d", repetitionLine(songs[genre]))
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", "3px");
  });

  // //initialize to hide everything except sentiment
  // genres.forEach(function(genre) {
  //   d3.select('#difficulty_'+genre).attr("visibility", "hidden");
  //   d3.select('#repetition_'+genre).attr("visibility", "hidden");
  // });


}

function updateGraph(yVar) {
  document.getElementById("button").innerHTML = yVar;
  d3.select("#yLabel").text(yVar);
  // TODO: update graph with the new yVar


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

createDropdown();
// graphTrend();