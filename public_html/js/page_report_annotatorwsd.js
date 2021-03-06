/**
 * Part of the Inforex project
 * Copyright (C) 2013 Michał Marcińczuk, Jan Kocoń, Marcin Ptak
 * Wrocław University of Technology
 */

// Globalne zmienne
var current_annotation_id = null;
var wsd_loading = false;
var selected_annotation_set = $.cookie('annotatorwsd_annotation_set');
// annotationModeFieldName -- passed from template
// ----------------

$(function(){
	setupAnnotationMode(annotationModeFieldName);

	$("#annotation_set_select").change(function(){
        $.cookie('annotatorwsd_annotation_set', $(this).val());
        location.reload();
	});

	$("#content span.ann").click(function(){
		if ( !wsd_loading ){
			$("#content span.selected").removeClass("selected");
			var id = $(this).attr("id").substr(2);
			$(this).addClass("selected");
			wsd_load_panel(id);
		}
	});

	$("#wsd_senses").on("click", "a", function(){
		console.log("Click");
		$("#content span.selected").removeClass("selected");
		$("#wsd_senses").html("<img src='gfx/ajax.gif'/> zapisuje ...");
		var value = $(this).text();		
		var annotation_id = current_annotation_id;
		current_annotation_id = null;
		
		var params = {
			annotation_id: annotation_id,
			value: value
		};
		
		var success = function(data){
			$("#wsd_senses").html("Zapisano");
		    wsd_loading = false;
		};
		
		var error = function(){
			$("#wsd_senses").html("Nie zapisano");
			wsd_loading = false;
		};
		
		doAjax("report_update_annotation_wsd", params, success, error);
	});
	
	wsd_mark_selected_words();
	wsd_edit_default();
	wsd_init_page_reload_after_working_mode_select();
    // wsd_setupWordFiltering();
	wsd_setupWordHiding();
});


/**
 * Wczytuje panel do wyboru sensu jednostki. 
 * annotation_id -- identyfikator jednostki
 */
function wsd_load_panel(annotation_id){
	
	wsd_loading = true;
	current_annotation_id = annotation_id;
	$("#wsd_senses").html("<img src='gfx/ajax.gif'/> wczytuje dane ...");
	
	var params = {
		annotation_id: annotation_id	
	};
	
	var success = function(data){
		var html = "";
		for (a in data.values){
			v = data.values[a];
			if ( v.value == data.value )
				html += "<li><a href='#' style='color: navy' class='hightlighted'>" + v.value + "</a><br/>";
			else
				html += "<li><a href='#' style='color: navy'>" + v.value + "</a><br/>";
			html += "<small>" + v.description + "</small></li>";
		}
		$("#wsd_senses").html("<ul>"+html+"</ul>");
		    wsd_loading = false;
	};
	
	var error = function(){
		wsd_loading = false;
	};
	
	doAjax("report_get_annotation_wsd", params, success, error);		
}

/**
 * Zaznacz wybrane słowa.
 * Podświetlone zostają wszystkie słowa, których klasa jest równa wartości ukrytego pola "wsd_word".
 */
function wsd_mark_selected_words(){
	var wsd_selected = $("input[name=wsd_word]").attr("value");
	if (wsd_selected)
		$(".annotation_set_"+selected_annotation_set + "." +wsd_selected).addClass("marked");
	console.log((".annotation_set_"+selected_annotation_set + "." +wsd_selected));
}

/**
 * Ustawia edycję wskazanego słowa.
 */
function wsd_edit_default(){
	var wsd_selected = $("input[name=wsd_edit]").attr("value");
	$("#an"+wsd_selected).click();		
}

/**
 * Reloads page after selecting different working mode
 */
function wsd_init_page_reload_after_working_mode_select(){
	var currentWorkingMode = getNewAnnotationStage(annotationModeFieldName);

    onChangeAnnotationMode(function(newWorkingMode){
    	if(currentWorkingMode !== newWorkingMode){
            $("body").LoadingOverlay("show");
    		setTimeout(function(){ 	// set timeout to let js finish execution of prev started actions
                console.log('page reloading');
                location.reload();
			}, 500)
		}
	}, annotationModeFieldName);
}

/**
 * Sets up option for hiding words without occurrences
 */
function wsd_setupWordHiding(){
    var $checkbox = $('[name="ignore_duplicates"]');
    var $wordsWithoutOccurence = $('.wsd_word_without_occurrence');

    $checkbox.on('click', function(){
    	wsd_toggleWordsWithoutOccurrences($wordsWithoutOccurence, !$checkbox[0].checked);
	});

}

function wsd_toggleWordsWithoutOccurrences($wordsWithoutOccurence, showWordsWithoutOccurrences){
	if (showWordsWithoutOccurrences)
    	$wordsWithoutOccurence.show();
	else
    	$wordsWithoutOccurence.hide();
}

/**
 * Sets up filtering by word ('filter words...' field)
 * function not performing well enough
 */
function wsd_setupWordFiltering(){
	var $listElements = $("#list_of_words li");
	var $filterInput = $('[name="wsd_filter_words"]');

	var currentValue = $filterInput.value;
    $filterInput.on('keyup', function(event){

		if (this.value !== currentValue){
			currentValue = this.value;
			if (currentValue.length > 2){
				var searchedInput = this.value.toLowerCase();
				$listElements.each(function(){
					var it = $(this);
					it.toggle(it.text().toLowerCase().indexOf(searchedInput) > -1);
				})
            }
        }
	})

}