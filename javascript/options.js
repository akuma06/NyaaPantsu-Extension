$(function() {
	$( "#tabs" ).tabs();
	restore_options();
	$.getJSON("manifest.json", function(json) {
		$('#version').html("<strong>Version:</strong> " + json.version);
	});
	$("#dateAuj").html(new Date().getFullYear());
	$("#saveButton").click(function (e) {
	e.preventDefault();
	save_options();
	});
	$("#closeButton").click(function (e) {
	e.preventDefault();
	window.close();
	});
	$("#clearButton").click(function (e) {
	e.preventDefault();
	clear_options();
	});
});

function save_options() {

  localStorage["default_genre"] = $('#genre').val();
  localStorage["max_results"] = $('#maxresults').val();
  localStorage["theme"] = $('#theme').val();
  localStorage["search_results"] = $('#searchresults').val();
  localStorage["new_style"] = $('#newstyle').val();
  localStorage["refresh_interval"] = $('#refreshinterval').val();
  localStorage["hide_others"] = $('#hideothers').val();
  localStorage["show_countdown"] = $('#showcountdown').val();
  localStorage["show_search_loader"] = $('#show_search_loader').val();
  localStorage["auto_close_tab"] = $('#auto_close_tab').val();
  
  chrome.extension.getBackgroundPage().update();
  $('#status').hide();
  $('#status').html("Options Saved.");
  $('#status').fadeIn();
  window.setTimeout(function() {
    $('#status').fadeOut();
  }, 1500);
}

function restore_options() {
  $('#genre').val(localStorage["default_genre"]);
  $('#maxresults').val(localStorage["max_results"]);
  $('#theme').val(localStorage["theme"]);
  $('#searchresults').val(localStorage["search_results"]);
  $('#refreshinterval').val(localStorage["refresh_interval"]);
  $('#newstyle').val(localStorage["new_style"]);
  $('#hideothers').val(localStorage["hide_others"]);
  $('#showcountdown').val(localStorage["show_countdown"]);
  $('#show_search_loader').val(localStorage["show_search_loader"]);
  $('#auto_close_tab').val(localStorage["auto_close_tab"]);
}


function clear_options() {
	localStorage.clear();
	localStorage["max_results"] = "10";
	localStorage["default_genre"] = "1_37";
	localStorage["theme"] = "grey";
	localStorage["search_results"] = "inside";
	localStorage["refresh_interval"] = "15";
	localStorage["new_style"] = "yes";
	localStorage["hide_others"] = "yes";
	localStorage["show_countdown"] = "yes";
	localStorage["show_search_loader"] = "yes";
	localStorage["auto_close_tab"] = "no";

	$('#status').hide();
	$('#status').html("Options Cleared.");
	$('#status').fadeIn();
	window.setTimeout(function() {
    $('#status').fadeOut();
  }, 1500);
}