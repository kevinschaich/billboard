var agg_genres = ["all-genres", "rock", "alternative/indie", "electronic/dance", "soul", "classical/soundtrack", "pop", "hip-hop/rnb", "disco", "swing", "folk", "country", "jazz", "religious", "blues", "reggae"];
var genres = d3.select(".genres");
genres.selectAll("button")
.data(agg_genres)
.enter()
.append("button")
.attr("class", "ui-btn ui-btn-inline ui-btn-active")
.attr("id", function(d){return d;})
.text(function(d){return d;});

$("#filter-toggle").click(function() {
    if ($("#filter-controls").is(":visible")) {
        $(this).html("Expand Filters");
        $("#wrap").css("margin", "0px 0px 100px 0px")
        var scroll = $(window).scrollTop();
        $(window).scrollTop(scroll - 300);
    }
    else {
        $(this).html("Collapse Filters");
        $("#wrap").css("margin", "0px 0px 400px 0px")
        var scroll = $(window).scrollTop();
        $(window).scrollTop(scroll + 300);
    }
    $("#filter-controls").fadeToggle();
    updateGraph(data);
});

// Handle year slider events
$( "#year-slider" ).on( "slidestop", function( event, ui ) {
    animStart();
    console.log("changed");
    updateGraph(data);
} );

// Handle genre filter events
$(".genres  button.ui-btn.ui-btn-inline").click(function() {
    animStart();
    if ($(this).attr('id') == 'all-genres') {
        if ($(this).hasClass("ui-btn-active")) {
            $(".genres  button.ui-btn.ui-btn-inline").removeClass("ui-btn-active");
        }
        else {
            $(".genres  button.ui-btn.ui-btn-inline").addClass("ui-btn-active");
        }
    }
    else {
        if ($(this).hasClass("ui-btn-active")) {
            $(this).removeClass("ui-btn-active");
            $("#all-genres").removeClass("ui-btn-active");
        }
        else {
            $(this).addClass("ui-btn-active");
            var length = getActiveGenres().length;
            if (length == 15) {
                $("#all-genres").addClass("ui-btn-active");
            }
        }
    }
    updateGraph(data);
});

// Filter data according to year & genre
function filter(data, yearMin, yearMax, genres) {
    var years =  _.filter(data, function(item) {
        return item['year'] >= yearMin && item['year'] <= yearMax;
    });

    var allsongs = _.flatten(_.pluck(years, "songs"));
    if (typeof genres === 'undefined') {
        return allsongs;
    }
    else {
        var songs = _.filter(allsongs,function(song) {
            return _.intersection(song['tags'], genres).length > 0;
        });
        return songs;
    }
}

// Load data & visualize it
d3.json("data.json", function(error, json) {
    if (error) return console.warn(error);
    data = json;
    // graphTrend(json);
    // graphScatter(json);
    graphInit(json);
    // document.getElementById("stats").innerText += JSON.stringify(curAvgParam("num_dupes"));
});

// Getter Functions
function getSliderMin() {
    return d3.select("#year-min")[0][0].value;
}
function getSliderMax() {
    return d3.select("#year-max")[0][0].value;
}
function getActiveGenres() {
    var activeGenres = [];
    $(".genres .ui-btn-active").each(function() {
        activeGenres.push($(this).attr('id'));
    });
    if (! activeGenres) {
        return [];
    }
    else if (_.contains(activeGenres, "all-genres")) {
        return undefined;
    }
    else {
        return activeGenres;
    }
}
