// initialize page variables
var currentPage = 'page1';

var swipeOrder = {
    'page1' : {'prev' : 20, 'next' : 2,  'story' : 'none'},
    'page2' : {'prev' : 1,  'next' : 3,  'story' : 0},
    'page3' : {'prev' : 2,  'next' : 4,	 'story' : 0},
    'page4' : {'prev' : 3,  'next' : 5,	 'story' : 0},
    'page5' : {'prev' : 4,  'next' : 6,	 'story' : 0},
    'page6' : {'prev' : 5,  'next' : 7,	 'story' : 1},
    'page7' : {'prev' : 6,  'next' : 8,	 'story' : 1},
    'page8' : {'prev' : 7,  'next' : 9,	 'story' : 1},
    'page9' : {'prev' : 8,  'next' : 10, 'story' : 2},
    'page10': {'prev' : 9,  'next' : 11, 'story' : 2},
    'page11': {'prev' : 10, 'next' : 12, 'story' : 2},
    'page12': {'prev' : 11, 'next' : 13, 'story' : 3},
    'page13': {'prev' : 12, 'next' : 14,  'story' : 3},
    'page14': {'prev' : 13, 'next' : 15,  'story' : 4},
    'page15': {'prev' : 14, 'next' : 16,  'story' : 4},
    'page16': {'prev' : 15, 'next' : 17,  'story' : 5},
    'page17': {'prev' : 16, 'next' : 18,  'story' : 5},
    'page18': {'prev' : 17, 'next' : 19,  'story' : 5},
    'page19': {'prev' : 18, 'next' : 20,  'story' : 6},
    'page20': {'prev' : 19, 'next' : 1,  'story' : 6}
};

//This array of objects contains links for the top dropdown navigation.
var topNav = [
    {'navlinks':[{'link-text': 'Story 1 Page1', 'href': '#page2'}, {'link-text': 'Story 1 Page 2', 'href': '#page3'}, {'link-text': 'Story 1 Page 3', 'href': '#page4'}, {'link-text': 'Story 1 Page 4', 'href': '#page5'}]},
    {'navlinks':[{'link-text': 'Story 2 Page1', 'href': '#page6'}, {'link-text': 'Story 2 Page 2', 'href': '#page7'}, {'link-text': 'Story 2 Page 3', 'href': '#page8'}]},
    {'navlinks':[{'link-text': 'Story 3 Page 1', 'href': '#page9'}, {'link-text': 'Story 3 Page 2', 'href' : '#page10'}, {'link-text' : 'Story 3 Page 3', 'href' : '#page11'}]},
    {'navlinks':[{'link-text': 'Story 4 Page 1', 'href': '#page12'}, {'link-text': 'Story 4 Page 2', 'href' : '#page13'}]},
    {'navlinks':[{'link-text': 'Story 5 Page 1', 'href': '#page14'}, {'link-text': 'Story 5 Page 2', 'href' : '#page15'}]},
    {'navlinks':[{'link-text': 'Story 6 Page 1', 'href': '#page16'}, {'link-text': 'Story 6 Page 2', 'href' : '#page17'}, {'link-text': 'Story 6 Page 3', 'href' : '#page18'}]},
    {'navlinks':[{'link-text': 'Story 7 Page 1', 'href': '#page19'}, {'link-text': 'Story 7 Page 2', 'href': '#page20'}]}
];

var buildNav = function(story, dest){

    var source = $("#nav-template").html();
    var template = Handlebars.compile(source);

    data = topNav[story];

    $('#nav-links-container').html(template(data));

    //add active class to current story link
    $("#main-story-links-container ul li").removeClass('active');
    $("#main-story-links-container ul li").eq(story).addClass('active');

    $("#nav-links-container ul li a").removeClass('active');
    $("#nav-links-container ul li a[href^='#" + dest + "']").addClass('active');

};

(function($) {
	var methods = {
	 	init : function(options) {
		 	var settings = {
		 		callback: function() {}
		 	};

		 	if ( options ) {
		 		$.extend( settings, options );
		 	}

			$(":jqmData(role='page')").each(function() {

				$(this).bind("swipeleft", function() {

					//Set the nextPage variable
					var nextPage = swipeOrder[currentPage]['next'];
                    var story = swipeOrder['page' + nextPage]['story'];
                    var dest = 'page' + nextPage;

                    //Slide to next page
					$.mobile.changePage("#page"+nextPage, { transition: "slide", reverse: false });

                    //generate top nav links based on the story
                    buildNav(story, dest);

				});

				$(this).bind("swiperight", function() {

					//Set the prevPage and story variable
					var prevPage = swipeOrder[currentPage]['prev'];
                    var story = swipeOrder['page' + prevPage]['story'];
                    var dest = 'page' + prevPage;

					//Slide to previous page
					$.mobile.changePage("#page"+prevPage, { transition: "slide", reverse: true });

                    //generate top nav links based on the story
                    buildNav(story, dest);

				});
			});
		}
	}

	$.fn.initApp = function(method) {
		if ( methods[method] ) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}
		else {
			$.error( 'Method ' + method + ' does not exist' );
		}
	}

})(jQuery);

$(document).ready(function(){

    $().initApp();

    //update currentPage variable when page changes
    $(this).bind("pagechange", function(){
    	currentPage = $.mobile.activePage[0].id;
    	currentGroup = swipeOrder[currentPage]['group'];
    });

    //top nav dropdown animation
    $('#dropdown-button').on('click', function(){
        var target = $(this).parent().parent();
        var story = swipeOrder[currentPage]['story'];
        //rebuild the nav so it's reset to the current page
        if(target.hasClass('show')){
            buildNav(story, currentPage);
        }
        target.toggleClass('show');
    });

    //isi animation
    $('#isi-button').on('click', function(){
        var target = $(this).parent().parent();
        target.toggleClass('show');
    });

    $("#main-story-links-container a").on('click', function(e){
        e.preventDefault();
        var storyId = $(this).data('story');
        buildNav(storyId);
    });

    $('#nav-links-container').on('click', 'a', function(e){
        e.preventDefault();
        $('#nav-dropdown').removeClass('show');
        $("#nav-links-container ul li a").removeClass('active');
        $(this).addClass('active');
        var dest = $(this).attr('href');
        var to = dest.slice(5);
        var from = currentPage.slice(4);

        if(parseInt(from) < parseInt(to)){
            $.mobile.changePage(dest, { transition: "slide", reverse: false });
        }else{
            $.mobile.changePage(dest, { transition: "slide", reverse: true });
        }

    });

    //timer function
    var sec = 0;
    function pad ( val ) { return val > 9 ? val : "0" + val; }
    setInterval( function(){
        document.getElementById("seconds").innerHTML=pad(++sec%60);
        document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
    }, 1000);

});




