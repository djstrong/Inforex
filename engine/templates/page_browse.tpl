{include file="inc_header.tpl"}

{if $corpus.public || $user}
	<div id="filter_menu" style="float: right; margin-left: 10px; ">
		
		<h2>Applied filters:</h2>
	
		{if $filter_order|@count>0}
			{foreach from=$filter_order item=filter_type}
				{include file="inc_filter.tpl"}
			{/foreach}
		{else}		
			<div class="total_count">
				<small><i>brak ustawionych kryteriów</i></small>
			</div>
		{/if}
	
		<div>Number of displayed documents:</small> <b>{$total_count}</b></div>
	
		<h2>Available filters:</h2>
		{foreach from=$filter_notset item=filter_type}
			{include file="inc_filter.tpl"}
		{/foreach}
	</div>
	
	{capture name=pagging}
		<div class="pagging">
		Strony:
		{foreach from=$page_map item=page}
			{if $page.nolink}
				<span>{$page.text}</span>
			{else}
		    	<a {if $page.selected} class="active"{/if}href="index.php?page=browse&amp;corpus={$corpus.id}&amp;p={$page.p}">{$page.text}</a>
		    {/if}
		{/foreach}
		</div>
	{/capture}
	
	<div style="padding-right: 280px">	
		{$smarty.capture.pagging}
		
		<table id="table-documents" class="tablesorter" cellspacing="1">
			<thead>
				<tr>
				{foreach from=$columns item=c key=k}
					<th>{$c}</th>
				{/foreach}
				</tr>
			</thead>
			<tbody>
		{foreach from=$rows item=r name=list}
			<tr class="{if $smarty.foreach.list.index%2==0}even{else}odd{/if}">
				{foreach from=$columns item=c key=k}
					{if $k=="lp"}
					<td style="text-align: right">{$smarty.foreach.list.index+$from}.</td>
					{elseif $k=="id"}
					<td style="text-align: right; color: grey">{$r.id}</td>
					{elseif $k=="title"}
					<td><a href="index.php?page=report&amp;corpus={$corpus.id}&amp;id={$r.id}{if $p && $p>0}&amp;p={$p}{/if}">{$r.title|default:"<i>brak</i>"}</a></td>
					{elseif $k=="type_name"}
					<td style="{if $r.type==1}color: #777;{/if}; text-align: center;">{$r.type_name|default:"---"|replace:" ":"&nbsp;"}</td>
					{else}					
					<td style="text-align: center;">{$r.$k}</td>					
					{/if}			
				{/foreach}
			</tr>
		{/foreach}
			</tbody>
		</table>
		{$smarty.capture.pagging}
	</div>
{else}
	<h1>Korpus <i>{$corpus.name}</i> jest korpusem <span style="color: red">prywatnym</span>.</h1>
{/if}
{include file="inc_footer.tpl"}