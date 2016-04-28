function avg (arr) {
    return _.reduce(arr, function(memo, num) {
        return memo + num;
    }, 0) / (arr.length === 0 ? 1 : arr.length);
}

function avgParam(year, param, genres) {
    if (param == "sentiment") {
        return avg(_.chain(filter(data, year, year, genres))
                   .pluck("sentiment")
                   .map(function(d) { return d['pos'] - d['neg'];})
                   .value());
    }
    else {
        return avg(_.chain(filter(data, year, year, genres))
                   .pluck(param)
                   .value());
    }
}
