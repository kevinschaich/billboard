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
var scatter_padding;
var scatter_margin = 60;
var scatter_xTickFrequency;
var scatter_yNumTicks;
var scatter_height = window.innerHeight - 2 * scatter_margin;
var scatter_width = window.innerWidth - 2 * scatter_margin;
var dataByGenre = {}





//{
// pop: [ddff ]
// }
function scatterInit(data) {
    scatter_graph = d3.select("#scatter").append("svg");


    // Scales
    scatter_xScale = d3.scale.ordinal();
    scatter_yScale = d3.scale.linear();

    // Axes
    scatter_xAxis = d3.svg.axis().orient("bottom");
    scatter_yAxis = d3.svg.axis().orient("left").ticks(20);

    scatter_xAxisLine = scatter_graph.append("g");
    scatter_yAxisLine = scatter_graph.append("g");

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
        .attr("transform", "translate(" + (scatter_width - scatter_margin * 3) + "," + scatter_margin + ")");

agg_genres.forEach(
    function (g, i) {
        var innerList =
            _.filter( (_.flatten (data)), function (d) {
                {
                    return d.tags[0] === g; 
                }

            })

        dataByGenre[g] = (innerList);
    }


    )

    function plotAllDot() {
        data.forEach(d, function () {

                scatter_graph.append("circle").attr("cx", scatter_xScale(d.year))
                    .attr("cy", scatter_yScale(d.pos))
                    .attr("r", 10)
                    .style("opacity", 0.3)
            }
        )
    };
    updateScatter(data);
}

// { pop :[] , jazz : [] } 

function updateScatter(data) {
    // console.log(curParam);

    scatter_padding = 120;
    scatter_margin = 60;
    scatter_xTickFrequency = 5;
    scatter_yNumTicks = 20;

    if (window.innerWidth < 768) {
        scatter_margin = 5;
        scatter_xTickFrequency = 10;
    }
    if (window.innerHeight < 700) {
        scatter_yNumTicks = 5;
    }
    scatter_height = window.innerHeight - 2 * scatter_margin;
    scatter_width = window.innerWidth - 2 * scatter_margin;
    if (window.innerHeight < 550) {
        scatter_height = 550;
    }
    scatter_graph.attr("width", scatter_width)
        .attr("height", scatter_height);

    var allData = data;



    function plotDotsByGenre(glist , minYear,maxYear) {


        if (typeof(glist) !=undefined) {

            d3.selectAll("circle").remove();

        glist.forEach(g, i, function (g) {

            var rawfilterByGenre = dataByGenre[g];

            var filterByYeardata = _.filter(rawfilterByGenre, function (d){
                return d.year >= minYear && d.year <= maxYear;
            }

            )

                filterByYeardata[i].forEach(
                    dot, function (dot) {
                        scatter_graph.append("circle").attr("cx", scatter_xScale(dot.year))
                            .attr("cy", scatter_yScale(dot.pos))
                            .attr("r", 10)
                            .style("color", colors[i])
                            .style("opacity", 0.3)
                    }
                )

            }
        )
    }

    else scatterInit(data);


    }


    scatter_graph.select(".scatter_legend")
        .attr("transform", "translate(" + (scatter_width - 180) + "," + 60 + ")");

    plotDotsByGenre(getActiveGenres(),getSliderMin(), getSliderMax() );


    animStop();
}
