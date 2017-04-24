{*
 * Part of the Inforex project
 * Copyright (C) 2013 Michał Marcińczuk, Jan Kocoń, Marcin Ptak
 * Wrocław University of Technology
 * See LICENCE 
 *}
 
{include file="inc_header2.tpl" content_class="corpus"}

{if "admin"|has_role || "manager"|has_corpus_role_or_owner}
	{include file="inc_system_messages.tpl"}
	<div id="corpusId" style="display:none">{$corpus.id}</div>
    <nav class="navbar navbar-report">
        <div class="container-fluid">
            <ul class="nav navbar-nav">
                {foreach from=$subpages key=perspectiv item=perspectiv_name}
                    <li class="{if $subpage==$perspectiv}active{/if}">
                        <a href="index.php?page=corpus&amp;corpus={$corpus.id}&amp;subpage={$perspectiv}">{$perspectiv_name}</a>
                    </li>
                {/foreach}
                {if isCorpusOwner() || "admin"|has_role}
                    <li class="{if $subpage==corpus_delete}{/if}">
                        <a href="index.php?page=corpus&amp;corpus={$corpus.id}&amp;subpage=corpus_delete">Delete corpora</a>
                    </li>
                {/if}
		    </ul>
        </div>
    </nav>
	
    <div style="margin: 4px">
        {include file="$subpage_file"}
    </div>
	
	</div>
{/if}

{include file="inc_footer.tpl"}