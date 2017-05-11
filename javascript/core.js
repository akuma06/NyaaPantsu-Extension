var req = chrome.extension.getBackgroundPage().req;
var search = chrome.extension.getBackgroundPage().search;
var maxitems = localStorage["max_results"];


function process_response() {
	$('#noresults').fadeOut();
    var root = req.responseXML.getElementsByTagName('rss')[0];
    var channels = root.getElementsByTagName("channel");
    var items = channels[0].getElementsByTagName("item");

	
	var requisite = 0;
    if (items.length > maxitems) {
        requisite = maxitems;
    } else {
        requisite = items.length;
    }
	
	var genre = localStorage["default_genre"];
    var theme = localStorage["theme"];
    if (genre == "") {};
    var genre_array = genre.split('_');
    var catid = genre_array[0];
    var subcatid = genre_array[1];
	$('#content').html("");
	for (var displayitems = 0; displayitems < requisite; displayitems++) {
		if (localStorage["new_style"] == 'yes') {
			$('#content').html($('#content').html() + '<div id="news' + displayitems + '" class="block"><div class="blockheader ' + theme + '"><div class="blocktitle"></div><div class="blocklink"></div></div><div class="blockcontent ' + theme + 'content newstyle"></div><div class="blockfooter ' + theme + 'footer"></div></div>');
		} else {
			$('#content').html($('#content').html() + '<div id="news' + displayitems + '" class="block"><div class="blockheader ' + theme + '"><div class="blocktitle"></div><div class="blocklink"></div></div><div class="blockcontent ' + theme + 'content"></div><div class="blockfooter ' + theme + 'footer"></div></div>');
		}
    }
	
	
	try {
	    for (var i = 0; i < requisite; i++) {
			var descriptions = items[i].getElementsByTagName("description");
			var titles = items[i].getElementsByTagName("title");
			var links = items[i].getElementsByTagName("link");
			var dates = items[i].getElementsByTagName("pubDate");

			var desc = (descriptions[0].childNodes.length === 0 ? "" : descriptions[0].childNodes[0].nodeValue);
			var title = titles[0].innerHTML;
			var link = links[0].innerHTML;
			var date = dates[0].innerHTML;

			$('#news' + i).children('.blockheader').children('.blocktitle').html(title);
			$('#news' + i).children('.blockheader').children('.blocklink').html('<a href="' + link + '">' + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve" class="' + theme + 'arrow"><path d="M32,16.016l-5.672-5.664c0,0-3.18,3.18-6.312,6.312V0h-8.023v16.664l-6.32-6.32L0,16.016L16,32	L32,16.016z"/></svg>' + '</a>');
			$('#news' + i).children('.blockcontent').html(desc);
			$('#news' + i).children('.blockfooter').html(date);
			$('#news' + i).fadeIn();
			$('#news' + i).children('.blockheader').fadeIn();
		}
	} catch(e) {
		alert(e.message);
	}

	
    activate_effects();
	if (localStorage["show_search_loader"] == "yes") $('#loader').fadeOut();
}


function process_search() {
    var root = search.responseXML.getElementsByTagName('rss')[0];
    var channels = root.getElementsByTagName("channel");
    var items = channels[0].getElementsByTagName("item");

	var requisite = 0;
    if (items.length > maxitems) {
        requisite = maxitems;
    } else {
        requisite = items.length;
    }

	if (items.length <= 0) {
		$('#content').html('<div id="noresults"><p></p></div>');
		$('#noresults').fadeIn();
		return;
	} else {
		$('#noresults').fadeOut();
	}
	
    var genre = localStorage["default_genre"];
    var theme = localStorage["theme"];
    if (genre == "") {};
    var genre_array = genre.split('_');
    var catid = genre_array[0];
    var subcatid = genre_array[1];
	$('#content').html("");

    for (var displayitems = 0; displayitems < requisite; displayitems++) {
		if (localStorage["new_style"] == 'yes') {
			$('#content').html($('#content').html() + '<div id="news' + displayitems + '" class="block"><div class="blockheader ' + theme + '"><div class="blocktitle"></div><div class="blocklink"></div></div><div class="blockcontent ' + theme + 'content newstyle"></div><div class="blockfooter ' + theme + 'footer"></div></div>');
		} else {
			$('#content').html($('#content').html() + '<div id="news' + displayitems + '" class="block"><div class="blockheader ' + theme + '"><div class="blocktitle"></div><div class="blocklink"></div></div><div class="blockcontent ' + theme + 'content"></div><div class="blockfooter ' + theme + 'footer"></div></div>');
		}
    }


	try {
	    for (var i = 0; i < requisite; i++) {
			var descriptions = items[i].getElementsByTagName("description");
			var titles = items[i].getElementsByTagName("title");
			var links = items[i].getElementsByTagName("link");
			var dates = items[i].getElementsByTagName("pubDate");
            
			var desc = (descriptions[0].childNodes.length === 0 ? "" : descriptions[0].childNodes[0].nodeValue);
			var title = titles[0].innerHTML;
			var link = links[0].innerHTML;
			var date = dates[0].innerHTML;

			$('#news' + i).children('.blockheader').children('.blocktitle').html(title);
			$('#news' + i).children('.blockheader').children('.blocklink').html('<a href="' + link + '">' + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve" class="' + theme + 'arrow"><path class="arrowpath" d="M32,16.016l-5.672-5.664c0,0-3.18,3.18-6.312,6.312V0h-8.023v16.664l-6.32-6.32L0,16.016L16,32	L32,16.016z"/></svg>' + '</a>');
			$('#news' + i).children('.blockheader').fadeIn();
			$('#news' + i).children('.blockcontent').html(desc);
			$('#news' + i).children('.blockfooter').html(date);
		}
	} catch(e) {
		alert(e.message);
	}

	activate_effects();
    if (localStorage["show_search_loader"] == "yes") $('#loader').fadeOut();
}

function activate_effects() {
    $('.blocktitle').click(function () {
		if (localStorage["hide_others"] == "yes") {
			$(this).parent().parent().siblings('.block').children('.blockcontent').slideUp();
			$(this).parent().parent().siblings('.block').children('.blockfooter').slideUp();
			$(this).parent().siblings('.blockcontent').slideToggle();
			$(this).parent().siblings('.blockfooter').slideToggle();
		} else {
			$(this).parent().siblings('.blockcontent').slideToggle();
			$(this).parent().siblings('.blockfooter').slideToggle();
		}		
    });
	

	
	
    $('.blocklink').click(function () {
		var oldtabid = 0;
		chrome.tabs.getSelected(null, function(tab){
			oldtabid = tab.id;
		});
		
        chrome.tabs.create({url: $(this).children('a').attr('href')}, function(tab) {
			if (localStorage["auto_close_tab"] == "yes") {
				chrome.extension.getBackgroundPage().clear_tab(tab.id, 1000);
				chrome.tabs.update(oldtabid, { selected: true });
			}
		});
    });
}


function contains(a, obj){
  for(var i = 0; i < a.length; i++) {
    if(a[i] === obj){
      return true;
    }
  }
  return false;
}


$(document).ready(function () {
	var genre = localStorage["default_genre"];
    var theme = localStorage["theme"];
    if (genre == "") {};
    var genre_array = genre.split('_');
    var catid = genre_array[0];
    var subcatid = genre_array[1];
    if (localStorage["show_search_loader"] == "no") $('#loader').remove();
	
	
	if (localStorage["search_terms"] == undefined) localStorage["search_terms"] = "";
	var searchterms = localStorage["search_terms"];
	searchterms = searchterms.split(',');
	searchterms.sort();
		$("#searchbox").autocomplete({
			source: searchterms
		});
	
	
	
	
	search.onload = process_search;
	process_response();
	
	$('#content').addClass(theme + "bg");

    $('#searchbutton').click(function () {
			if (localStorage["search_terms"] == undefined || localStorage["search_terms"] == "") {
				localStorage["search_terms"] = $('#searchbox').val();
			} else if ($.inArray($('#searchbox').val(), searchterms) == -1){
				localStorage["search_terms"] += ',' + $('#searchbox').val();
			}
		
		//searchterms = localStorage["search_terms"];
		if (localStorage["search_results"] == "inside") {
			if (localStorage["show_search_loader"] == "yes") $('#loader').fadeIn();
			search.open("GET", "http://nyaa.pantsu.cat/feed?" + "c=" + catid + "_" + subcatid + "&q=" + $('#searchbox').val(), true);
			$('#searchbox').val("");
			$("#searchbox").autocomplete({
				source: searchterms
			});
			search.send(null);
		} else {
			chrome.tabs.create({url: "http://nyaa.pantsu.cat/search?c=" + localStorage["default_genre"] + "&s=0&q=" + $('#searchbox').val()});
		}
    });

    $('#searchbox').keypress(function (event) {
        if (event.keyCode == '13') {
			if (localStorage["search_terms"] == undefined || localStorage["search_terms"] == "") {
				localStorage["search_terms"] = $('#searchbox').val();
			} else if ($.inArray($('#searchbox').val(), searchterms) == -1){
				localStorage["search_terms"] += ',' + $('#searchbox').val();
			}
			
			//searchterms = localStorage["search_terms"];
			if (localStorage["search_results"] == "inside") {
				if (localStorage["show_search_loader"] == "yes") $('#loader').fadeIn();
				search.open("GET", "http://nyaa.pantsu.cat/feed?" + "c=" + catid + "_" + subcatid + "&q=" + $('#searchbox').val(), true);
				$('#searchbox').val("");
				$("#searchbox").autocomplete({
					source: searchterms
				});
				search.send(null);
				
			} else {
				chrome.tabs.create({url: "http://nyaa.pantsu.cat/search?c=" + localStorage["default_genre"] + "&s=0&q=" + $('#searchbox').val()});
			}
			
        }
    });

    $('#helplink').click(function () {
        chrome.tabs.create({
            url: "https://chrome.google.com/extensions/detail/daolbddjeaipeiglbbpmlhldimjmgenm?hl=en-US"
        });
    });

    $('#optionslink').click(function () {
        chrome.tabs.create({
            url: 'chrome-extension://' + location.hostname + '/options.html'
        });
    })

    $('#homelink').click(function () {
        chrome.tabs.create({
            url: "http://nyaa.pantsu.cat/"
        });
    });

    $('#dropdown').hover(function () {
        $(this).stop().animate({
            'top': '0px'
        }, 500);
        $(this).children('#dropdownarrow').stop().fadeTo(500, 0.0);
    }, function () {
        $(this).stop().animate({
            'top': '-26px'
        }, 500);
        $(this).children('#dropdownarrow').stop().fadeTo(500, 1.0);
    });
	
	$('#refresh').click(function(){
		process_response();
	});
});