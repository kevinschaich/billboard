function avg (arr) {
  return _.reduce(arr, function(memo, num) {
    return memo + num;
  }, 0) / (arr.length === 0 ? 1 : arr.length);
}

function paramStats(year, param, genre) {
  var list;
  if (param == "sentiment") {
    list = _.chain(filter(data, year, year, [genre]))
    .pluck("sentiment")
    .map(function(d) { return d['pos'] - d['neg'];})
    .value();
  }
  else {
    list = _.chain(filter(data, year, year, [genre]))
    .pluck(param)
    .value();
  }
  return {"avg": avg(list), "min": _.min(list), "max": _.max(list)};
}

function aggParamStats(param) {

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
                      // console.log( paramStats(year, param, genre));
                      var stats = paramStats(year, param, genre);
                      return {"year" : year, "avg": stats['avg'], "min": stats['min'], "max": stats['max']};
                    })
    };
  });
}

function curParamStats(param) {
  var agg_genres = ["rock", "alternative/indie", "electronic/dance", "soul", "classical/soundtrack", "pop", "hip-hop/rnb", "disco", "swing", "folk", "country", "jazz", "religious", "blues", "reggae"];

  var genres = getActiveGenres();
  if (typeof genres === 'undefined') {
    genres = agg_genres;
  }

  var list;
  var val_list;
  var list = _.chain(filter(data, parseInt(getSliderMin()), parseInt(getSliderMin()), genres));
  if (param == "sentiment") {
    val_list = list
    .pluck("sentiment")
    .map(function(d) { return d['pos'] - d['neg'];})
    .value();
  }
  else {
    val_list = list
    .pluck(param)
    .value();
  }
  var min = _.min(val_list);
  var max = _.max(val_list)
  return {
    "avg": avg(val_list),
    "min": min,
    "max": max,
    "min_obj": function() {
      if (param == "sentiment") {
        return list.find(function(d) {return d[param]['pos'] - d[param]['neg'] == min}).value()
      }
      else {
        return list.find(function(d) {return d[param] == min}).value()
      }
    }(),
    "max_obj": function() {
      if (param == "sentiment") {
        return list.find(function(d) {return d[param]['pos'] - d[param]['neg'] == max}).value()
      }
      else {
        return list.find(function(d) {return d[param] == max}).value()
      }
    }(),
  };
}
