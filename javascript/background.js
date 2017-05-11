var req = new XMLHttpRequest();
var search = new XMLHttpRequest();

var maxitems = localStorage["max_results"];
var available = false;
var tUpdater = 0;
req.onload = process_response;
search.onload = process_search;
var tNext = 0;
var iCountdown = 0;

if( localStorage["default_genre"] == undefined ) {
    localStorage["default_genre"] = "_";
}

if( localStorage["max_results"] == undefined ) {
    localStorage["max_results"] = "10";
}

if( localStorage["theme"] == undefined ) {
    localStorage["theme"] = "grey";
}

if( localStorage["search_results"] == undefined ) {
    localStorage["search_results"] = "inside";
}

if( localStorage["refresh_interval"] == undefined ) {
    localStorage["refresh_interval"] = "15";
}

if( localStorage["new_style"] == undefined ) {
    localStorage["new_style"] = "yes";
}

if( localStorage["hide_others"] == undefined ) {
    localStorage["hide_others"] = "yes";
}

if( localStorage["show_countdown"] == undefined ) {
    localStorage["show_countdown"] = "no";
}


if( localStorage["show_search_loader"] == undefined ) {
    localStorage["show_search_loader"] = "yes";
}

if( localStorage["auto_close_tab"] == undefined ) {
    localStorage["auto_close_tab"] = "no";
}

reset_timeout();
update();

function update() {
    var genre = localStorage["default_genre"];
    var theme = localStorage["theme"];
    if (genre == "") {};
    var genre_array = genre.split('_');
    var catid = genre_array[0];
    var subcatid = genre_array[1];
	
	req.open("GET", "http://nyaa.pantsu.cat/feed" + "?c=" + catid + "_" + subcatid, true);
    req.send(null);
	
	
	iCountdown = parseInt(localStorage["refresh_interval"]);
	clearInterval(tNext);
	tNext = setInterval ("countdown()", 60000);
	countdown();
	
}

function process_response() {
	available = true;
}

function countdown() {
	if (localStorage["show_countdown"] == "yes") {
		chrome.browserAction.setBadgeBackgroundColor({"color": [91, 158, 141, 255]});
		chrome.browserAction.setBadgeText({"text": iCountdown + ''});
	} else {
		chrome.browserAction.setBadgeBackgroundColor({"color": [255, 255, 255, 0]});
		chrome.browserAction.setBadgeText({"text": ''});
	}
	console.log(iCountdown);
	iCountdown--;
}

function process_search() {
	available = true;
}

function reset_timeout() {
	clearInterval(tUpdater);
	tUpdater = setInterval (update, parseInt(localStorage["refresh_interval"]) * 60000);
}

function clear_tab(tabid, delay) {	
	setTimeout("chrome.tabs.remove(" + tabid + ")", delay);
}