var agg_genres = ["all-genres", "rock", "alternative/indie", "electronic/dance", "soul", "classical/soundtrack", "pop", "hip-hop/rnb", "disco", "swing", "folk", "country", "jazz", "religious", "blues", "reggae"];

var genres = d3.select(".genres");
genres.selectAll("button")
.data(agg_genres)
.enter()
.append("button")
.attr("class", "ui-btn ui-btn-inline ui-btn-active")
.attr("id", function(d){return d;})
.text(function(d){return d;});

var metric_list = [
{"metric": "num_lines", "title": "# of Lines", "description": "Shows the number of lines for the average song in the selected year/genre range."},
{"metric": "sentiment", "title": "Sentiment", "description": "Shows how happy (1.0) or sad (-1.0) the average song is in the selected year/genre range."},
{"metric": "f_k_grade", "title": "Flesch-Kincaid Grade", "description": "Shows average grade level (6.0 = 6th grade) required to read the average song in the selected year/genre range. Based on Flesch-Kincaid Readability Index."},
{"metric": "num_syllables", "title": "# of Syllables", "description": "Shows the number of syllables for the average song in the selected year/genre range."},
{"metric": "difficult_words", "title": "# Difficult Words", "description": "Shows the number of complex (difficult) words for an average song in the selected year/genre range. Based on Dale-Chall Readability index."},
{"metric": "fog_index", "title": "Fog Index", "description": "Shows the grade level (6.0 = 6th grade) required to read an average song in the selected year/genre range. Based on Gunning-Fog Readability index"},
{"metric": "num_dupes", "title": "# Duplicate Lines", "description": "Shows how repetitive an average song is in the selected year/genre range."},
{"metric": "flesch_index", "title": "Flesch Index", "description": "Shows how easy to read (100 = pre-K, 0 = impossible) an average song is in the selected year/genre range. Based on Flesch Readability Index."},
{"metric": "num_words", "title": "# Words", "description": "Shows the number of words for an average song in the selected year/genre range."},
]

// <a onclick='animStart(); curParam = "sentiment"; updateGraph(data);'>Sentiment</a>


var metrics = d3.select("div#param-select");
metrics.selectAll("a")
.data(metric_list)
.enter()
.append("a")
.attr("id", function(d){return d['metric'];})
.attr("title", function(d){return d['description'];})
.attr("onclick", function(d){
    return 'animStart(); curParam = "' + d['metric'] + '"; curTitle = "' + d['title'] + '"; updateGraph(data); $("#button").html("' + d['title'] + ' &#9662;"); $("#param-descrip").html("' + d['description'] + '");';
})
.text(function(d){return d['title'];});



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
    scatterInit(json);
    graphInit(json);
    // document.getElementById("stats").innerText += JSON.stringify(curAvgParam("num_dupes"));
});
