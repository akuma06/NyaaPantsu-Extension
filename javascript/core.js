var req = chrome.extension.getBackgroundPage().req;
var search = chrome.extension.getBackgroundPage().search;
var maxitems = localStorage.getItem("max_results");

function process_results(request) {
	var root = request.responseXML.getElementsByTagName('rss')[0];
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

    var theme = localStorage.getItem("theme");

	$('#content').html("");
	for (var displayitems = 0; displayitems < requisite; displayitems++) {
		if (localStorage.getItem("new_style") == 'yes') {
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
			var title = titles[0].textContent;
			var link = links[0].textContent;
			var date = dates[0].textContent;

			$('#news' + i).children('.blockheader').children('.blocktitle').text(title);
			$('#news' + i).children('.blockheader').children('.blocklink').html('<a href="' + link + '">' + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve" class="' + theme + 'arrow"><path d="M32,16.016l-5.672-5.664c0,0-3.18,3.18-6.312,6.312V0h-8.023v16.664l-6.32-6.32L0,16.016L16,32	L32,16.016z"/></svg>' + '</a>');
			$('#news' + i).children('.blockcontent').html(desc);
			$('#news' + i).children('.blockfooter').text(date);
			$('#news' + i).fadeIn();
			$('#news' + i).children('.blockheader').fadeIn();
		}
	} catch(e) {
		alert(e.message);
	}

	
    activate_effects();
	if (localStorage.getItem("show_search_loader") == "yes") $('#loader').fadeOut();
};

function process_response() {
	process_results(req);    
}


function process_search() {
	process_results(search);
}

function activate_effects() {
    $('.blocktitle').click(function() {
		if (localStorage.getItem("hide_others") == "yes") {
			$(this).parent().parent().siblings('.block').children('.blockcontent').slideUp();
			$(this).parent().parent().siblings('.block').children('.blockfooter').slideUp();
			$(this).parent().siblings('.blockcontent').slideToggle();
			$(this).parent().siblings('.blockfooter').slideToggle();
		} else {
			$(this).parent().siblings('.blockcontent').slideToggle();
			$(this).parent().siblings('.blockfooter').slideToggle();
		}		
    });
	

	
	
    $('.blocklink').click(() => {
		var oldtabid = 0;
		chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, (tabs) => {
            // and use that tab to fill in out title and url
            var tab = tabs[0];
			oldtabid = tab.id;
		});
		
        chrome.tabs.create({url: $(this).children('a').attr('href')}, (tab) => {
			if (localStorage.getItem("auto_close_tab") == "yes") {
				chrome.extension.getBackgroundPage().clear_tab(tab.id, 1000);
				chrome.tabs.update(oldtabid, { selected: true });
			}
		});
    });
}


$(document).ready(() => {
    var theme = localStorage.getItem("theme");

    if (localStorage.getItem("show_search_loader") == "no") $('#loader').remove();
	
	
	if (localStorage.getItem("search_terms") === null) localStorage.setItem("search_terms", "");
	var searchterms = localStorage.getItem("search_terms");
	searchterms = searchterms.split(',');
	searchterms.sort();
		$("#searchbox").autocomplete({
			source: searchterms
		});
    $('#searchbutton').click(() => {
			if (localStorage.getItem("search_terms") === undefined || localStorage.getItem("search_terms") === "") {
				localStorage.setItem("search_terms", $('#searchbox').val());
			} else if ($.inArray($('#searchbox').val(), searchterms) == -1){
				localStorage.setItem("search_terms", localStorage.getItem("search_terms") + ',' + $('#searchbox').val());
			}
		
		//searchterms = localStorage["search_terms"];
		if (localStorage.getItem("search_results") == "inside") {
			if (localStorage.getItem("show_search_loader") == "yes") $('#loader').fadeIn();
			search.open("GET", "https://nyaa.pantsu.cat/feed?c=" + localStorage.getItem("default_genre") + "&q=" + $('#searchbox').val(), true);
			$('#searchbox').val("");
			$("#searchbox").autocomplete({
				source: searchterms
			});
			search.send(null);
		} else {
			chrome.tabs.create({url: "https://nyaa.pantsu.cat/search?c=" + localStorage.getItem("default_genre") + "&s=0&q=" + $('#searchbox').val()});
		}
    });

    $('#searchbox').keypress((event) => {
        if (event.keyCode == '13') {
			if (localStorage.getItem("search_terms") === undefined || localStorage.getItem("search_terms") === "") {
				localStorage.setItem("search_terms", $('#searchbox').val());
			} else if ($.inArray($('#searchbox').val(), searchterms) == -1){
				localStorage.setItem("search_terms", localStorage.getItem("search_terms") + ',' + $('#searchbox').val());
			}
			
			//searchterms = localStorage["search_terms"];
			if (localStorage.getItem("search_results") == "inside") {
				if (localStorage.getItem("show_search_loader") == "yes") $('#loader').fadeIn();
				search.open("GET", "https://nyaa.pantsu.cat/feed?c=" + localStorage.getItem("default_genre") + "&q=" + $('#searchbox').val(), true);
				$('#searchbox').val("");
				$("#searchbox").autocomplete({
					source: searchterms
				});
				search.send(null);
				
			} else {
				chrome.tabs.create({url: "https://nyaa.pantsu.cat/search?c=" + localStorage.getItem("default_genre") + "&s=0&q=" + $('#searchbox').val()});
			}
			
        }
    });

    $('#helplink').click(() => {
        chrome.tabs.create({
            url: "https://pantsu.cat/faq"
        });
    });

    $('#optionslink').click(() => {
		chrome.runtime.openOptionsPage();
    });

    $('#homelink').click(() => {
        chrome.tabs.create({
            url: "https://nyaa.pantsu.cat/"
        });
    });

    $('#dropdown').hover(function() {
        $(this).stop().animate({
            'top': '0px'
        }, 500);
        $(this).children('#dropdownarrow').stop().fadeTo(500, 0.0);
    }, function() {
        $(this).stop().animate({
            'top': '-26px'
        }, 500);
        $(this).children('#dropdownarrow').stop().fadeTo(500, 1.0);
    });
	
	
	
	
	search.onload = process_search;
	process_response();
	
	$('#content').addClass(theme + "bg");

	
	$('#refresh').click(() => {
		process_response();
	});
});