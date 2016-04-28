function avg (arr) {
  return _.reduce(arr, function(memo, num) {
    return memo + num;
  }, 0) / (arr.length === 0 ? 1 : arr.length);
}

function avgParam(year, param, genre) {
  if (param == "sentiment") {
    return avg(_.chain(filter(data, year, year, [genre]))
               .pluck("sentiment")
               .map(function(d) { return d['pos'] - d['neg'];})
               .value());
  }
  else {
    return avg(_.chain(filter(data, year, year, [genre]))
               .pluck(param)
               .value());
  }
}

function curAvgParam(param) {

  var agg_genres = ["rock", "alternative/indie", "electronic/dance", "soul", "classical/soundtrack", "pop", "hip-hop/rnb", "disco", "swing", "folk", "country", "jazz", "religious", "blues", "reggae"];

  var genres = getActiveGenres();
  if (typeof genres === 'undefined') {
    genres = agg_genres;
  }

  return _.map(genres, function(genre) {
    return {
      "genre" : genre,
      "years": _.map(_.range(parseInt(getSliderMin()), parseInt(getSliderMax()) + 1),
                     function(year) {
                      // console.log( avgParam(year, param, genre));
                      return {"year" : year, "value": avgParam(year, param, genre)};
                    })
    };
  });
}
