<table style="width: 100%">
	<tr>
		<td style="vertical-align: top">
			<div class="column" id="widget_text">
				<div class="ui-widget ui-widget-content ui-corner-all">			
					<div class="ui-widget ui-widget-header ui-helper-clearfix ui-corner-all">Document content:</div>
					<div id="content" style="padding: 5px;" class="annotations scrolling">{$content_inline|format_annotations}</div>
				</div>
			</div>
		</td>
		<td style="vertical-align: top; width: 400px;">
			<form  action="index.php?page=report&amp;corpus={$corpus_id}&amp;subpage=preview&amp;id={$report_id}" method="post">
				<div class="ui-widget ui-widget-content ui-corner-all" style="background: PeachPuff">			
					<div class="ui-widget ui-widget-header ui-helper-clearfix ui-corner-all">Layers:</div>
					<div style="padding: 2px;">
						<div id="layersList" class="scrolling" style="overflow: auto">	
							<table id="annotations" class="tablesorter" cellspacing="1">
								<thead>
								<tr>
									<th>Name</th>
									<th>Show</th>
								</tr>
								</thead>
								<tbody>
								{foreach from=$layers item=layer}
								<tr>
									<td>{$layer.description}</td>
									<td><input type="radio" name="previewLayer" value="{$layer.annotation_set_id}" {if $previewLayer==$layer.annotation_set_id}checked="checked"{/if}/></td>
								</tr>
								{/foreach} 
								</tbody>
							</table>
						</div>
						<input type="submit" value="Apply" />
					</div>
				</div>
			</form> 
		
			<div class="column scrolling" id="widget_annotation">
			{include file="inc_widget_annotation_list.tpl"}
			</div>
		</td>
	</tr>
</table>
<input type="hidden" id="report_id" value="{$row.id}"/>