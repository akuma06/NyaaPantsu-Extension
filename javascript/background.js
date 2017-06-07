var req = new XMLHttpRequest();
var search = new XMLHttpRequest();

var maxitems = localStorage.getItem("max_results");
var available = false;
var tUpdater = 0;
req.onload = process_response;
search.onload = process_search;
var tNext = 0;
var iCountdown = 0;

if( localStorage.getItem("default_genre") === null ) {
    localStorage.setItem("default_genre", "_");
}

if( localStorage.getItem("max_results") === null ) {
    localStorage.setItem("max_results", "10");
}

if( localStorage.getItem("theme") === null ) {
    localStorage.setItem("theme", "grey");
}

if( localStorage.getItem("search_results") === null ) {
    localStorage.setItem("search_results", "inside");
}

if( localStorage.getItem("refresh_interval") === null ) {
    localStorage.setItem("refresh_interval", "15");
}

if( localStorage.getItem("new_style") === null ) {
    localStorage.setItem("new_style", "yes");
}

if( localStorage.getItem("hide_others") === null ) {
    localStorage.setItem("hide_others", "yes");
}

if( localStorage.getItem("show_countdown") === null ) {
    localStorage.setItem("show_countdown", "no");
}


if( localStorage.getItem("show_search_loader") === null ) {
    localStorage.setItem("show_search_loader", "yes");
}

if( localStorage.getItem("auto_close_tab") === null ) {
    localStorage.setItem("auto_close_tab", "no");
}

reset_timeout();
update();

function update() {
    var theme = localStorage.getItem("theme");
	
	req.open("GET", "https://nyaa.pantsu.cat/feed" + "?c=" + localStorage.getItem("default_genre"), true);
    req.send(null);
	
	
	iCountdown = parseInt(localStorage.getItem("refresh_interval"));
	clearInterval(tNext);
	tNext = setInterval (countdown, 60000);
	countdown();
	
}

function process_response() {
	available = true;
}

function countdown() {
	if (localStorage.getItem("show_countdown") == "yes") {
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
	tUpdater = setInterval (update, parseInt(localStorage.getItem("refresh_interval")) * 60000);
}

function clear_tab(tabid, delay) {	
	setTimeout(() => {
        chrome.tabs.remove( tabid );
    }, delay);
}