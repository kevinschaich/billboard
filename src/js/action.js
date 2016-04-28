
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

// Handle filter toggle button
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

window.onresize = function(event) {
    console.log("resized");
    updateGraph(data);
};