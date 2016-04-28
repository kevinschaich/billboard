// return the average of a list's sentiment value
function getAverage(obj, senti) {

    // get all sentiment positive/neu/neg score of listed songss
    function getSentPos(obj) {
        return _.map(obj, function (any) {
            return any.sentiment.pos;
        })
    };

    function getSentNeu(obj) {
        return _.map(obj, function (any) {
            return any.sentiment.neu;
        })
    };

    function getSentNeg(obj) {
        return _.map(obj, function (any) {
            return any.sentiment.neg;
        })
    };

    function avgSentPos(obj) {
        var poslst = sumList(getSentPos(obj));
        return poslst / obj.length;
    };

    function avgSentNeu(obj) {
        var poslst = sumList(getSentNeu(obj));
        return poslst / obj.length;
    };

    function avgSentNeg(obj) {
        var poslst = sumList(getSentNeg(obj));
        return poslst / obj.length;
    };

    if (senti === "pos") {
        return avgSentPos(obj);
    }
    else if (senti === "neu") {
        return avgSentNeu(obj);
    }
    else if (senti === "neg") {
        return avgSentNeg(obj);
    }
    else
        console.warn(error);

}
//return an average value of the array
function average (arr) {
    return _.reduce(arr, function (memo, num){
        return memo + num ;
    }, 0)/arr.length;
}



function averageSentiAllYears (songsOfGenre) {

    function averageValues(songs) {

        var year = songs[0].year;
        var getAllPos = _.map(songs, function (s) {
            return s.sentiment.pos
        });
        var getAllNeg = _.map(songs, function (s) {
            return s.sentiment.neg
        });
        var getAllFl = _.map(songs, function (s) {
            return s.flesch_index;

        });
        var getAllRep = _.map(songs, function (s) {
            return s.num_dupes;

        });

        return {
            year: year,
            pos: average(getAllPos),
            neg: average(getAllNeg),
            fl: average(getAllFl),
            rep: average(getAllRep),

        }
    }


    var songsByYear = _.groupBy(songsOfGenre , function (y){
        return y.year;
    });
    var result = [];

    Object.keys(songsByYear).forEach( function(key) {
        result.push(averageValues(songsByYear[key] ) );

    });
    return result;

}