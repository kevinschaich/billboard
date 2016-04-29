/**
 * Created by CandiceW on 4/28/16.
 */
var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300"];
var agg_genres = ["rock", "alternative/indie", "electronic/dance", "soul", "classical/soundtrack", "pop", "hip-hop/rnb", "disco", "swing", "folk", "country", "jazz", "religious", "blues", "reggae"];

var scatter_graph;
var scatter_curParam = "Rank";
var scatter_curTitle = "Rank";
var title;
var scatter_xTitle;
var scatter_yTitle;
var scatter_xScale;
var scatter_yScale;
var scatter_xAxis;
var scatter_yAxis;
var scatter_xAxisLine;
var scatter_yAxisLine;
var scatter_line = {};
var scatter_drawnPath = {};
var scatter_agg_data;
var scatter_padding = 120;
var scatter_margin = 60;
var scatter_xTickFrequency;
var scatter_yNumTicks;
var scatter_height = 500;
var scatter_width = window.innerWidth - 2 * scatter_margin;

function scatterInit(data) {
    scatter_graph = d3.select("#scatter").append("svg");

    // Scales
    scatter_xScale = d3.scale.ordinal();
    scatter_yScale = d3.scale.linear()
      .domain([100,0])
      .range([(scatter_height - scatter_padding), (scatter_padding / 2)]);

    // Axes
    scatter_xAxis = d3.svg.axis().orient("bottom");
    scatter_yAxis = d3.svg.axis().orient("left").ticks(20);

    scatter_xAxisLine = scatter_graph.append("g");
    scatter_yAxisLine = scatter_graph.append("g");

        // scatter_yAxisLine
    //     .attr("transform", "translate(" + scatter_padding / 1.5 + ",0)")
    //     .attr("class", "axis")
    //     .transition()
    //     .duration(300)
    //     .call(scatter_yAxis);

    scatter_yTitle = scatter_graph.append("text")
        .attr("id", "rank")
        .attr("class", "axis")
        .attr("text-anchor", "middle")
        .attr("alignment-basescatter_line", "central")
        .text("Rank");

    scatter_xTitle = scatter_graph.append("text")
        .attr("class", "axis")
        .attr("text-anchor", "middle")
        .attr("alignment-basescatter_line", "central")
        .text("Year");

    /******************************
     *          scatter_legend            *
     /******************************/
    var scatter_legend = scatter_graph.append("g")
        .attr("class", "scatter_legend")
        .attr("transform", "translate("+(scatter_width-scatter_margin*3)+","  + scatter_margin+ ")");

    updateScatter(data);
}

function updateScatter (data) {
    // console.log(curParam);
    d3.selectAll("circle.datapoints").remove();

    scatter_padding = 120;
    scatter_margin = 60;
    scatter_xTickFrequency = 5;
    scatter_yNumTicks = 20;

    if( window.innerWidth < 768 ) {
        scatter_margin = 5;
        scatter_xTickFrequency = 10;
    }
    if (window.innerHeight < 700) {
        scatter_yNumTicks = 5;
    }
    // scatter_height = window.innerHeight - 2 * scatter_margin;
    // scatter_height = 
    scatter_width = window.innerWidth - 2 * scatter_margin;
    if (window.innerHeight < 550) {
        scatter_height = 550;
    }
    scatter_graph.attr("width",scatter_width)
        .attr("height",scatter_height);

    scatter_agg_data = aggParamStats(curParam);

    //filter scatter_agg_data to get rid of data points
    //where that genre didn't exist in that year
    var filteredAggData = scatter_agg_data;

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

    scatter_xScale.domain(_.range(parseInt(getSliderMin()), parseInt(getSliderMax()) + 1))
        .rangePoints([scatter_padding, scatter_width - scatter_padding*2]);
    // scatter_yScale.domain([, averages.max()]).range([scatter_height - scatter_padding, scatter_padding / 2]);


    // Axes
    scatter_xAxis.scale(scatter_xScale)
        .tickValues(scatter_xScale.domain().filter(function(d,i) { return !(d % scatter_xTickFrequency); }));
    scatter_yAxis.scale(scatter_yScale).ticks(scatter_yNumTicks);

    scatter_xAxisLine
        .attr("transform", "translate(0," + (scatter_height - scatter_padding / 1.5) + ")")
        .attr("class", "axis")
        .transition()
        .duration(300)
        .call(scatter_xAxis);

    scatter_yAxisLine
        .attr("transform", "translate(" + scatter_padding / 1.5 + ",0)")
        .attr("class", "axis")
        .transition()
        .duration(300)
        .call(scatter_yAxis);

    // title
    // .attr("x", scatter_width / 2)
    // .attr("y", scatter_padding / 4);

    scatter_yTitle
        .text(curTitle)
        .attr("x", scatter_padding / 5)
        .attr("y", scatter_height / 2)
        .attr("transform", "rotate(-" + 90 +
            "," + scatter_padding / 5 + "," + scatter_height / 2 + ")");

    scatter_xTitle
        .attr("x", (scatter_width-scatter_padding*2)/2+scatter_padding/2)
        .attr("y", scatter_height - (scatter_padding / 4));

    var scatter_legend = d3.select(".scatter_legend");
    scatter_legend.selectAll("rect").remove();
    scatter_legend.selectAll("text").remove();

    // plot data
    plotAllDot(data);

    _.each(filteredAggData, function(c, i) {

        //update scatter_legend according to active genres
        var y = i*18
        scatter_legend.append("rect")
            .attr("x",0)
            .attr("y",y)
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", colors[i]);

        scatter_legend.append("text")
            .attr("x",20)
            .attr("y",y+13)
            .text(c['genre'])
            .attr("fill", "black");

        // toggle colors of datapoints for active genres

    });

    // scatter_graph.on("mousemove", function() {
    //     scatter_graph.selectAll("circle.mousedot").remove();
    //     scatter_graph.selectAll("scatter_line.mousescatter_line").remove();
    //     scatter_graph.selectAll("rect.mouseback").remove();
    //     scatter_graph.selectAll("text.mousetext").remove();

    //     var ypos = scatter_yScale.invert(d3.mouse(this)[1]);
    //     var xmouse = d3.mouse(this)[0];

    //     var xRange = scatter_xScale.range();
    //     var xDomain = scatter_xScale.domain();
    //     var closest = xRange[0];
    //     var minDist = Infinity;
    //     _.each(xRange, function(n, i) {
    //         var diff = Math.abs(n - xmouse);
    //         if (diff < minDist) {
    //             minDist = diff;
    //             closest = xDomain[i];
    //         }
    //     });

    //     var xpos = closest;
    //     console.log({"xpos": xpos, "ypos": ypos});

    //     var ymin = scatter_yScale.domain()[0];
    //     var ymax = scatter_yScale.domain()[scatter_yScale.domain().length-1];
    //     if (ypos >= ymin && ypos <= ymax) {
    //         scatter_graph.append("circle")
    //             .attr("cx", scatter_xScale(xpos))
    //             .attr("cy", scatter_yScale(ypos))
    //             .attr("r", 5)
    //             .attr("class", "mousedot");

    //         scatter_graph.append("scatter_line")
    //             .attr("x1", scatter_xScale(xpos))
    //             .attr("x2", scatter_xScale(xpos))
    //             .attr("y1", scatter_yScale(ymin))
    //             .attr("y2", scatter_yScale(ymax))
    //             .attr("stroke", "black")
    //             .attr("stroke-width", "2px")
    //             .attr("class", "mousescatter_line");

    //         var fourdig = d3.format(".2r");

    //         scatter_graph.append("rect")
    //             .attr("x", scatter_xScale(xpos) + 15)
    //             .attr("y", scatter_yScale(ypos) - 35)
    //             .attr("width", 85)
    //             .attr("height", 20)
    //             .attr("fill", "white")
    //             .attr("class", "mouseback");

    //         scatter_graph.append("text")
    //             .attr("x", scatter_xScale(xpos) + 20)
    //             .attr("y", scatter_yScale(ypos) - 20)
    //             .text("(" + xpos + ", " + fourdig(ypos) + ")")
    //             .attr("class", "mousetext");
    //     }
    // });

    scatter_graph.select(".scatter_legend")
        .attr("transform", "translate("+(scatter_width-180)+","  + 60+ ")");


    animStop();
}

function plotAllDot(data) {
  console.log("HELLO");
  var allSongs = _.flatten(_.map(data, function(a){return a.songs}));
  console.log(scatter_xScale);

  allSongs.forEach(function (d) {
    // var songGenre = d.
    scatter_graph.append("circle")
      .attr("class", "datapoints")
      .attr("cx", scatter_xScale(d.year))
      .attr("cy", scatter_yScale(d.pos))
      .attr("r", 2)
      .style("fill", "black")
      .style("opacity", 0.3)
  });
}