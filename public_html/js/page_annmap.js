/**
 * Part of the Inforex project
 * Copyright (C) 2013 Michał Marcińczuk, Jan Kocoń, Marcin Ptak
 * Wrocław University of Technology
 */

function subsetRow(name,subset){
	var subsetRow = '<tr class="subsetGroup expandable" name="'+name+'">';
	subsetRow += '<td class="empty"></td>';
	subsetRow += '<td colspan="3">'+subset['name']+'</td>';
	subsetRow += '<td style="text-align:right">'+subset["unique"]+'</td>';
	subsetRow += '<td style="text-align:right">'+subset["count"]+'</td>';
	subsetRow += '</tr>';
	return subsetRow;
}

function typesRow(name,type){
	var typesRow = '<tr class="annotation_type">';
	typesRow += '<td colspan="2" class="empty"></td>';
	typesRow += '<td>';
	
	if(type['count'] > 0)
		typesRow += '<a href="." class="toggle_simple" label="'+type['name']+'"><b>'+type['name']+'</b></a>';
	else
		typesRow += '<span style="color: grey">'+type['name']+'</span>';
	     
	typesRow += '</td>';
    typesRow += '<td style="text-align:right">'+type['docs']+'</td>';
	typesRow += '<td style="text-align:right">'+type['unique']+'</td>';
	typesRow += '<td style="text-align:right">'+type['count']+'</td>';
	typesRow += '</tr>';
	return typesRow;
}

function tagsElement(name, tag){
	var element = '<li class="annotation_item">';
	element += '<span style="float: right;">'+tag['count']+'</span>';
	element += '<span style="margin-right: 50px">'+tag['text']+'</span>';
	element += '<div class="annotationItemLinks"></div>';
	element += '</li>';
	
	return element;
}

function loadAnnotationTags(corpus_id, annotation_type, status, subcorpus, currentRow){
	$.ajax({
		type: 	'POST',
		url: 	"index.php",
		data:	{ 	
			ajax: "annmap_load_tags",
			corpus_id: corpus_id,
			annotation_type: annotation_type,
			status: status,
			subcorpus: subcorpus
		},						
		success: function(data){
			if (data['success']){
				var row = '<tr class="annotation_type_'+annotation_type+' annotation_type_names expandable">';
				row +=	'<td colspan="2" class="empty2"></td>';
				row +=	'<td colspan="4">'; 
				row +=  '<ol>';
								
				$.each(data['tags'], function(name, tag) {
					row += tagsElement(name, tag);
				});
				
				row +=  '</ol>';
				row +=  '</td>';
				row +=	'</tr>';
				
				currentRow.nextUntil(".subsetGroup,.setGroup,.annotation_type").remove();
				currentRow.after(row);
			}else{
				alert("[PHP]: coś poszło nie tak");
			}
		},
		error: function(request, textStatus, errorThrown){						
					dialog_error("<b>HTML result:</b><br/>" + request.responseText);		
				},
		complete: function(){
					currentRow.children().not('.empty').first().removeClass("loading");
				},
		dataType:"json"						
	});
}



function loadAnnotationTypes(corpus_id, set_id, subset_id, status, subcorpus, currentRow){
	$.ajax({
		type: 	'POST',
		url: 	"index.php",
		data:	{ 	
			ajax: "annmap_load_type",
			corpus_id: corpus_id,
			status: status,
			set_id: set_id,
			subset_id: subset_id,
			subcorpus: subcorpus
		},						
		success: function(data){
			if (data['success']){
				var rows = "";
				$.each(data['types'], function(name, subset) {
					rows += typesRow(name, subset);
				});
				
				currentRow.nextUntil(".subsetGroup,.setGroup").remove();
				currentRow.after(rows);
			}else{
				alert("[PHP]: coś poszło nie tak");
			}
		},
		error: function(request, textStatus, errorThrown){						
					dialog_error("<b>HTML result:</b><br/>" + request.responseText);		
				},
		complete: function(){
					currentRow.children().not('.empty').first().removeClass("loading");
				},
		dataType:"json"						
	});
}

function loadAnnotationSubset(corpus_id, set_id, status, subcorpus, currentRow){
	$.ajax({
		type: 	'POST',
		url: 	"index.php",
		data:	 { 	
			ajax: "annmap_load_subset",
			corpus_id: corpus_id,
			status: status,
			set_id: set_id,
			subcorpus: subcorpus
		},						
		success: function(data){
			if (data['success']){
				var rows = "";
				$.each(data['subsets'], function(name, subset) {
					rows += subsetRow(name, subset);
				});
				currentRow.nextUntil(".setGroup").remove();
				currentRow.after(rows);
			}else{
				alert("[PHP]: coś poszło nie tak");
			}
		},
		error: function(request, textStatus, errorThrown){						
					dialog_error("<b>HTML result:</b><br/>" + request.responseText);		
				},
		complete: function(){
					currentRow.children().not('.empty').first().removeClass("loading");
				},
		dataType:"json"						
	});
	
}

$(function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
	
    $("a.toggle_simple").live("click", function(){
    	if ($(this).hasClass("showItem")){
			if(!$(this).parent().hasClass("loading")){
				$(this).removeClass("showItem");
				$(this).parent().parent().nextUntil(".subsetGroup,.setGroup,.annotation_type").remove();
			}
		}
		else{ 
			var url = $.url(window.location.href);
			var corpus_id = url.param('corpus');
			var subcorpus = url.param('subcorpus');
			var status = url.param('status');
			var annotation_type = $(this).attr("label");
			$(this).parent().addClass("loading");
			loadAnnotationTags(corpus_id, annotation_type, status, subcorpus, $(this).parent().parent())
			$(this).addClass("showItem");
		}
    });
    
	$("tr.subsetGroup").live("click", function(){
		var firstNonEmpty = $(this).children().not('.empty').first();
		if ($(this).hasClass("showItem")){
			if(!firstNonEmpty.hasClass("loading")){
				$(this).removeClass("showItem");
				$(this).nextUntil(".subsetGroup,.setGroup").remove();
			}
		}
		else{ 
			var url = $.url(window.location.href);
			var corpus_id = url.param('corpus');
			var subcorpus = url.param('subcorpus');
			var status = url.param('status');
			var set_id = parseInt($(this).prevAll(".setGroup").first().attr("name"));
			var subset_id = parseInt($(this).attr('name')); 
			firstNonEmpty.addClass("loading");
			loadAnnotationTypes(corpus_id, set_id, subset_id, status, subcorpus, $(this));
			$(this).addClass("showItem");//.nextUntil(".subsetGroup, .setGroup").filter(".annotation_type").show();
		}
	});
	
	$("tr.setGroup").click(function(){
		var firstNonEmpty = $(this).children().not('.empty').first();
		if ($(this).hasClass("showItem")){
			if(!firstNonEmpty.hasClass("loading")){
				$(this).removeClass("showItem").nextUntil(".setGroup").remove();
			}
		}
		else{
			var url = $.url(window.location.href);
			var corpus_id = url.param('corpus');
			var subcorpus = url.param('subcorpus');
			var status = url.param('status');
			var set_id = parseInt($(this).attr('name'));
			firstNonEmpty.addClass("loading");
			loadAnnotationSubset(corpus_id, set_id, status, subcorpus, $(this));
			$(this).addClass("showItem");//.nextUntil(".setGroup").filter(".subsetGroup").show();
		}
	});	
	
	$("li.annotation_item").live("click",function(){		
		var $links = $(this).children(".annotationItemLinks");
		if ($links.hasClass("showItem")){
			$links.removeClass("showItem").empty();			
		}
		else{
			corpusId = vars['corpus'];
			annotationText = $(this).children("span:last").text();
			annotationType = $(this).parents("tr").prev().find("a.toggle_simple").text();
			//link: localhost/inforex/index.php?page=report&corpus=CORPUS_ID%id=REPORT_ID
			$links.addClass("showItem");
			$.post("index.php", 
					{
						ajax : "annmap_get_report_links",
						id : corpusId,
						type : annotationType,
						text : annotationText
					}, 
					function(data) {				
						if ($links.hasClass("showItem")){
							$links.empty();
							str = "<ul>";
							$.each(data, function(index, value){
								str+='<li><a href="index.php?page=report&corpus='+corpusId+'&id='+value.id+'" target="_blank">'+value.title+'</li>';
							});
							str += "<ul>";
							$links.append(str);				
						}
					}, "json");			
		}
	});
});