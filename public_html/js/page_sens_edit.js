/*
Show Ajax status
text: show text in Ajax status element
option: loading, success, error
*/
function ajaxstatus($text,$option){
	$(".ajax_status_text").show();
	$(".ajax_status_text").removeClass("loading").removeClass("success").removeClass("error").addClass($option);
	$(".ajax_status_text").html($text);
	$(".ajax_status_text").delay(1500).hide("slow");
}

function getSens(sens_id,this_sens_name){
	$.ajax({
			type: 	'POST',
			url: 	"index.php",
			data:	{ 	
					ajax: "sens_edit_get_sens",
					sens_id: sens_id
				},
			success:function(data){
					var html = "";
					var data_length = data.length - 1;
					for (a in data){
						html += "<div class='sensItem'><div class='sensItemDescription'><b>" + data[a]['value'] + ":</b> " + data[a]['description'];
						html += "<br><span class='sensItemEdit' id=data[a]['value']>[edytuj opis]</span></div>";
						html += "<div class='sensItemEditForm' id=" + data[a]['value'] + " style='display:none'><div><b>Edycja " + data[a]['value'] + "</b></div>";
													
						html += "<form>";
						html += "<label for='lemat'><b>Lemat:</b></label> <input class='input' type='text' size='50' name='sensNameEdit' value=" + this_sens_name + " /><br />";
  						html += "<label for='opis'><b>Opis:</b></label> <textarea class='input' cols='48' rows='10' name='sensDescriptionEdit'>" + data[a]['description'] + "</textarea><br />"
  							
  						html += "<button type='button' class='saveSens' name='saveSens'>Zapisz</button>";
  						html += "<button type='button' class='discardSens' name='discardSens'>Anuluj</button>";
  						html += "<button type='button' class='deleteSens' id=" + data[a]['value'] + " name='deleteSens'>Usuń</button>";
  						html += "<div class='sens_id' id=" + this_sens_id + "></div><div class='sens_name' id=" + this_sens_name + "></div>";
						html += "</form> ";
							
						html += "</div><br></div>";
						if(a < data_length){
							html += "<hr width='85%'/>";
						}														
					}
					$("#sensDescriptionContainer").show();
					$("#sensDescriptionList").html(html);							
					ajaxstatus("Załadowano słowo: " + this_sens_name, "success");					
				},
			error: function(request, textStatus, errorThrown){
					ajaxstatus("Błąd ładowania słowa: " + this_sens_name, "error");
				},
			dataType:"json"
	});
}	

function createWordDialog(){
	$("body").append(''+
			'<div id="dialog-form-create-word" title="Create new word" style="">'+
			'	<form>'+
			'	<fieldset style="border-width: 0px">'+
			'		<label for="wordname" style="float: left; width: 60px; text-align: right;margin-bottom: 5px; line-height: 1em">Word:</label>'+
			'		<input type="text" name="wordname" id="wordname" class="text ui-widget-content ui-corner-all" style="margin-bottom: 5px; background: #eee" />'+
			'	</fieldset>'+
			'	</form>'+
			'   <span style="color: red; margin-left: 70px" id="create-word-form-error"></span>'+	
			'</div>');

	$("#dialog-form-create-word").dialog({
		autoOpen: true,
		width: 280,
		modal: true,
		buttons: {
			'Create': function() {
				createWord($(this));
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			$("#dialog-form-create-word").remove();
		}
	});	
	
	$("#dialog-form-create-word input[name=wordname]").focus();	
}

function createWord(dialog){

	var wordname = $("#wordname").val();

	$.ajax({
			type: 	'POST',
			url: 	"index.php",
			data:	{ 	
						ajax: "sens_edit_add_word", 
						wordname: wordname
					},						
			success: function(data){
						if (data['success']){
							dialog.dialog('destroy');
							$("#dialog-form-create-word").remove();
							getWords();
							ajaxstatus("Dodano słowo " + wordname, "success");
						}else{
							$("#create-word-form-error").html(data['error']);
						}
					},
			error: function(request, textStatus, errorThrown){	
						dialog_error("<b>HTML result:</b><br/>" + request.responseText);		
					},
			dataType:"json"						
	});
}

function editWordDialog(name){
	$("body").append(''+
			'<div id="dialog-form-edit-word" title="Edit word ' + name + '" style="">'+
			'	<form>'+
			'	<fieldset style="border-width: 0px">'+
			'		<label for="wordname" style="float: left; width: 60px; text-align: right;margin-bottom: 5px; line-height: 1em">Word:</label>'+
			'		<input type="text" name="wordname" id="wordname" value=' + name + ' class="text ui-widget-content ui-corner-all" style="margin-bottom: 5px; background: #eee" />'+
			'	</fieldset>'+
			'	</form>'+
			'   <span style="color: red; margin-left: 70px" id="edit-word-form-error"></span>'+	
			'</div>');
	
	$("#dialog-form-edit-word").dialog({
		autoOpen: true,
		width: 280,
		modal: true,
		buttons: {
			'Edit': function() {
				editWord($(this),name);
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			$("#dialog-form-edit-word").remove();
		}
	});	
	
	$("#dialog-form-edit-word input[name=wordname]").focus();	
}

function editWord(dialog,oldwordname){

	var newwordname = $("#wordname").val();
	
	$.ajax({
			type: 	'POST',
			url: 	"index.php",
			data:	{ 	
						ajax: "sens_edit_update_word", 
						newwordname: newwordname,
						oldwordname: oldwordname
					},						
			success: function(data){
						if (data['success']){
							var sens_num = data['sens_num'];
							dialog.dialog('destroy');
							$("#dialog-form-edit-word").remove();
							getWords();
							getSens(sens_num,newwordname);
							ajaxstatus("Edytowano słowo " + newwordname, "success");		
							$("tr#"+sens_num).addClass("selected");		
							$(".sensEdit").hide();
							$(".sensDelete").hide();			
						}else{
							$("#edit-word-form-error").html(data['error']);
						}
					},
			error: function(request, textStatus, errorThrown){	
						dialog_error("<b>HTML result:</b><br/>" + request.responseText);		
					},
			dataType:"json"						
	});
}

function getWords(){
	$.ajax({
			type: 	'POST',
			url: 	"index.php",
			data:	{ 	
						ajax: "sens_edit_get_words" 
					},						
			success: function(data){
						var html = "";
						var i = 1;
						for (a in data){
							html += "<tr class='sensName' id=" + data[a]['id'] + " >";
							html += "<td>" + i + "</td>";
							html += "<td class='sens_name'>" + data[a]['annotation_type'] + "</td>";
							html += "</tr>";
							i = i + 1;
						}
						$("#sensTableItems").html(html);
					},
			error: function(request, textStatus, errorThrown){	
						dialog_error("<b>HTML result:</b><br/>" + request.responseText);		
					},
			dataType:"json"						
	});
}

function deleteWordDialog(name){
	$("body").append(''+
			'<div id="dialog-form-delete-word" title="Delete word" style="">'+
			'	<div id="wordname" style="float: left; text-align: right;margin-bottom: 5px; line-height: 1em">Delete word '+ name +	'?</div>'+
			'   <br><span style="color: red; margin-left: 70px" id="delete-word-form-error"></span>'+	
			'</div>');
	$("#dialog-form-delete-word").dialog({
		autoOpen: true,
		width: 280,
		modal: true,
		buttons: {
			'Yes': function() {
				deleteWord($(this),name);
			},
			'No': function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			$("#dialog-form-delete-word").remove();
		}
	});	
}

function deleteWord(dialog,name){
	$.ajax({
			type: 	'POST',
			url: 	"index.php",
			data:	{ 	
						ajax: "sens_edit_delete_word", 
						name: name
					},						
			success: function(data){
						if (data['success']){
							dialog.dialog('close');
							$("#dialog-form-delete-word").remove();
							$("#sensDescriptionContainer").hide();
							getWords();
							ajaxstatus("Usunięto słowo " + name, "success");
							$(".sensEdit").hide();
							$(".sensDelete").hide();
						}else{
							$("#delete-word-form-error").html(data['error']);
						}
					},
			error: function(request, textStatus, errorThrown){	
						dialog_error("<b>HTML result:</b><br/>" + request.responseText);		
					},
			dataType:"json"						
	});
}

function createSensDialog(name,id){
	$("body").append(''+
			'<div id="dialog-form-create-sens" title="Create new sens" style="">'+
			'	<form>'+
			'	<fieldset style="border-width: 0px">'+
			'		<label for="sensnum" style="float: left; width: 60px; text-align: right;margin-bottom: 5px; line-height: 1em">' + name + '-</label>'+
			'		<input type="text" name="sensnum" id="sensnum" class="text ui-widget-content ui-corner-all" style="margin-bottom: 5px; background: #eee" />'+
			'	</fieldset>'+
			'	</form>'+
			'   <span style="color: red; margin-left: 70px" id="create-sens-form-error"></span>'+	
			'</div>');

	$("#dialog-form-create-sens").dialog({
		autoOpen: true,
		width: 280,
		modal: true,
		buttons: {
			'Create': function() {
				createSens($(this),name,id);
			},
			'Cancel': function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			$("#dialog-form-create-sens").remove();
		}
	});	
	
	$("#dialog-form-create-sens input[name=sensnum]").focus();	
}

function createSens(dialog,sensname,sensid){
	var sensnum = $("#sensnum").val();
	$.ajax({
			type: 	'POST',
			url: 	"index.php",
			data:	{ 	
						ajax: "sens_edit_add_sens", 
						sensname: sensname,
						sensid: sensid,
						sensnum: sensnum
					},						
			success: function(data){
						if (data['success']){
							dialog.dialog('close');
							$("#dialog-form-create-word").remove();
							ajaxstatus("Dodano sens " + sensname, "success");
							getSens(sensid,sensname);
						}else{
							$("#create-sens-form-error").html(data['error']);
						}
					},
			error: function(request, textStatus, errorThrown){	
						dialog_error("<b>HTML result:</b><br/>" + request.responseText);		
					},
			dataType:"json"						
	});
}

function deleteSensDialog(name,sens_id,sens_name){
	$("body").append(''+
			'<div id="dialog-form-delete-sens" title="Delete sens" style="">'+
			'	<div id="sensname" style="float: left; text-align: right;margin-bottom: 5px; line-height: 1em">Delete sens '+ name +	'?</div>'+
			'   <br><span style="color: red; margin-left: 70px" id="delete-sens-form-error"></span>'+	
			'</div>');
	$("#dialog-form-delete-sens").dialog({
		autoOpen: true,
		width: 280,
		modal: true,
		buttons: {
			'Yes': function() {
				deleteSens($(this),name,sens_id,sens_name);
			},
			'No': function() {
				$(this).dialog('close');
			}
		},
		close: function() {
			$("#dialog-form-delete-sens").remove();
		}
	});	
}

function deleteSens(dialog,name,sens_id,sens_name){
	$.ajax({
			type: 	'POST',
			url: 	"index.php",
			data:	{ 	
						ajax: "sens_edit_delete_sens", 
						name: name
					},						
			success: function(data){
						if (data['success']){
							dialog.dialog('close');
							$("#dialog-form-delete-sens").remove();
							getSens(sens_id,sens_name);
							ajaxstatus("Usunięto sens " + name, "success");
						}else{
							$("#delete-sens-form-error").html(data['error']);
						}
					},
			error: function(request, textStatus, errorThrown){	
						dialog_error("<b>HTML result:</b><br/>" + request.responseText);		
					},
			dataType:"json"						
	});
}

function updateSens(save_button,name,description,sens_name){
	$.ajax({
			type: 	'POST',
			url: 	"index.php",
			data:	{ 	
						ajax: "sens_edit_update_sens",
						name: name,
						description: description,
						sens_name: sens_name
					},						
			success: function(data){
						if (data['success']){
							ajaxstatus("Edytowano sens " + name, "success");		
						}else{
							ajaxstatus("Błąd edycji sensu " + data['error'], "error");
						}
					},
			error: function(request, textStatus, errorThrown){	
						dialog_error("<b>HTML result:</b><br/>" + request.responseText);		
					},
			dataType:"json"						
	});
}


$(function(){
	
	$("span.sensCreate").click(function(){
		createWordDialog();
		return false;
	});
	
	$("span.sensEdit").click(function(){
		var name = $(this).attr('id');		
		editWordDialog(name);
		return false;
	});
	
	$("span.sensDelete").click(function(){
		var name = $(this).attr('id');
		deleteWordDialog(name);
		$(this).hide();
		return false;
	});
	
	$("span.sensDescriptionCreate").click(function(){
		var name = $(this).attr('id');
		var id = $(this).parent().attr('id');
		createSensDialog(name,id);		
		return false;
	});
	
	$("tr.sensName").live({
		click: function(){
			var button = this;
			
			$(button).after("<img class='ajax_indicator' src='gfx/ajax.gif'/>");
			$(button).attr("disabled", "disabled");
			if (! $(this).hasClass("selected")){
				$("tr.sensName").removeClass("selected");
				$(this).addClass("selected");	
			}
			var this_sens_id = $(this).attr('id');
			var this_sens_name = $(this).find('td.sens_name').text();
			$(".sensEdit").show();
			$(".sensEdit").attr("id",this_sens_name);
			$(".sensDelete").show();
			$(".sensDelete").attr("id",this_sens_name);
			$(".sensDescriptionCreate").attr("id",this_sens_name);
			$(".descriptionTableOptions").attr("id",this_sens_id);
			//ajaxstatus("Ładuję słowo: " + this_sens_name, "loading");
			$.ajax({
				type: 	'POST',
				url: 	"index.php",
				data:	{ 	
						ajax: "sens_edit_get_sens",
						sens_id: this_sens_id
					},
				success:function(data){
						var html = "";
						var data_length = data.length - 1;
						for (a in data){
							html += "<div class='sensItem'><div class='sensItemDescription'><b>" + data[a]['value'] + ":</b> " + data[a]['description'];
							html += "<br><span class='sensItemEdit' id=data[a]['value']>[edytuj opis]</span></div>";
							html += "<div class='sensItemEditForm' id=" + data[a]['value'] + " style='display:none'><div><b>Edycja " + data[a]['value'] + "</b></div>";
													
							html += "<form>";
							html += "<label for='lemat'><b>Lemat:</b></label> <input class='input' type='text' size='50' name='sensNameEdit' value=" + this_sens_name + " /><br />";
  							html += "<label for='opis'><b>Opis:</b></label> <textarea class='input' cols='48' rows='10' name='sensDescriptionEdit'>" + data[a]['description'] + "</textarea><br />"
  							
	  						html += "<button type='button' class='saveSens' name='saveSens'>Zapisz</button>";
  							html += "<button type='button' class='discardSens' name='discardSens'>Anuluj</button>";
  							html += "<button type='button' class='deleteSens' id=" + data[a]['value'] + " name='deleteSens'>Usuń</button>";
  							html += "<div class='sens_id' id=" + this_sens_id + "></div><div class='sens_name' id=" + this_sens_name + "></div>";
							html += "</form> ";
							
							html += "</div><br></div>";
							if(a < data_length){
								html += "<hr width='85%'/>";
							}														
						}
						$("#sensDescriptionContainer").show();
						$("#sensDescriptionList").html(html);
						$(button).removeAttr("disabled");
						$(".ajax_indicator").remove();							
						ajaxstatus("Załadowano słowo: " + this_sens_name, "success");					
					},
				error: function(request, textStatus, errorThrown){
						$(button).removeAttr("disabled");
						$(".ajax_indicator").remove();
						ajaxstatus("Błąd ładowania słowa: " + this_sens_name, "error");
					},
				dataType:"json"
			});							
		}	
	});
	
	$("span.sensItemEdit").live({
		click: function(){
			$(this).parent().parent().find('div.sensItemEditForm').show("slow");
			$(this).parent().hide("slow");
		}
	});
	
	$("button.saveSens").live({
		click: function(){
			var name = $(this).parent().find('input').val();
			var description = $(this).parent().find('textarea').val();
			var sens_name = $(this).parent().parent().attr('id');
			updateSens($(this),name,description,sens_name);
//			ajaxstatus(sens_name, "error");		
			return false;
		}
	});
	
	$("button.discardSens").live({
		click: function(){
			$(this).parent().parent().parent().find('div.sensItemDescription').show("slow");
			$(this).parent().parent().hide("slow");
		}
	});
	
	$("button.deleteSens").live({
		click: function(){
			var id = $(this).attr('id');
			var sens_id = $(this).parent().find('div.sens_id').attr('id');
			var sens_name = $(this).parent().find('div.sens_name').attr('id');
			deleteSensDialog(id,sens_id,sens_name);		
			return false;
		}
	});			
});