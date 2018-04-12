<?php
/**
 * Part of the Inforex project
 * Copyright (C) 2013 Michał Marcińczuk, Jan Kocoń, Marcin Ptak
 * Wrocław University of Technology
 * See LICENCE
 */

class Ajax_subcorpus_delete extends CPage {

    function checkPermission(){
        if (hasRole(USER_ROLE_ADMIN) || isCorpusOwner() || hasCorpusRole(CORPUS_ROLE_MANAGER))
            return true;
        else
            return "Brak prawa do edycji.";
    }

    function execute(){
        ob_start();
        DbSuborpus::deleteSubcorpus(intval($_POST['element_id']));
        $error_buffer_content = ob_get_contents();
        ob_clean();
        if(strlen($error_buffer_content))
            throw new Exception("Error: ". $error_buffer_content);
        else
            return;
    }
}
?>