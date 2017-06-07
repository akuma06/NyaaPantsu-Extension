$(() => {
	$( "#tabs" ).tabs();
	restore_options();
	$.getJSON("manifest.json", (json) => {
		$('#version').html("<strong>Version:</strong> " + json.version);
	});
	$("#dateAuj").html(new Date().getFullYear());
	$("#saveButton").click((e) => {
	e.preventDefault();
	save_options();
	});
	$("#closeButton").click((e) => {
	e.preventDefault();
	window.close();
	});
	$("#clearButton").click((e) => {
	e.preventDefault();
	clear_options();
	});
});

function save_options() {

  localStorage.setItem("default_genre", $('#genre').val());
  localStorage.setItem("max_results", $('#maxresults').val());
  localStorage.setItem("theme", $('#theme').val());
  localStorage.setItem("search_results", $('#searchresults').val());
  localStorage.setItem("new_style", $('#newstyle').val());
  localStorage.setItem("refresh_interval", $('#refreshinterval').val());
  localStorage.setItem("hide_others", $('#hideothers').val());
  localStorage.setItem("show_countdown", $('#showcountdown').val());
  localStorage.setItem("show_search_loader", $('#show_search_loader').val());
  localStorage.setItem("auto_close_tab", $('#auto_close_tab').val());
  
  chrome.extension.getBackgroundPage().update();
  $('#status').hide();
  $('#status').html("Options Saved.");
  $('#status').fadeIn();
  window.setTimeout(() => {
    $('#status').fadeOut();
  }, 1500);
}

function restore_options() {
  $('#genre').val(localStorage.getItem("default_genre"));
  $('#maxresults').val(localStorage.getItem("max_results"));
  $('#theme').val(localStorage.getItem("theme"));
  $('#searchresults').val(localStorage.getItem("search_results"));
  $('#refreshinterval').val(localStorage.getItem("refresh_interval"));
  $('#newstyle').val(localStorage.getItem("new_style"));
  $('#hideothers').val(localStorage.getItem("hide_others"));
  $('#showcountdown').val(localStorage.getItem("show_countdown"));
  $('#show_search_loader').val(localStorage.getItem("show_search_loader"));
  $('#auto_close_tab').val(localStorage.getItem("auto_close_tab"));
}


function clear_options() {
	localStorage.clear();
	localStorage.setItem("max_results", "10");
	localStorage.setItem("default_genre", "1_37");
	localStorage.setItem("theme", "grey");
	localStorage.setItem("search_results", "inside");
	localStorage.setItem("refresh_interval", "15");
	localStorage.setItem("new_style", "yes");
	localStorage.setItem("hide_others", "yes");
	localStorage.setItem("show_countdown", "yes");
	localStorage.setItem("show_search_loader", "yes");
	localStorage.setItem("auto_close_tab", "no");

	$('#status').hide();
	$('#status').html("Options Cleared.");
	$('#status').fadeIn();
	window.setTimeout(() => {
    $('#status').fadeOut();
  }, 1500);
}

document.addEventListener("DOMContentLoaded", function() {
	var elTotrad = document.querySelectorAll("[data-translate='true']");
	var l = elTotrad.length;
	for (var i=0; i < l; i++) {
		var element = elTotrad[i];
		var translation_string = element.textContent.replace(/^__MSG_([a-z_]+)__$/i, "$1");
		if (translation_string === "") console.error("Couldn't parse translation string for element #"+i);
		var message_translated = "";
		if (element.dataset.translateArg !== undefined) {
			message_translated = chrome.i18n.getMessage(translation_string, element.dataset.translateArg.split(","));
		} else {
			message_translated = chrome.i18n.getMessage(translation_string);
		}
		element.textContent = message_translated;
	}
});