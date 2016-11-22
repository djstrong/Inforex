<?php
/**
 * Part of the Inforex project
 * Copyright (C) 2013 Michał Marcińczuk, Jan Kocoń, Marcin Ptak
 * Wrocław University of Technology
 * See LICENCE 
 */
 
require_once(implode(DIRECTORY_SEPARATOR, array($config->path_engine, "pages", "export.php")));

class Page_export_download extends CPage{
	
	var $isSecure = false;

	function checkPermission(){
		global $corpus;
		return hasCorpusRole(CORPUS_ROLE_EXPORT) || $corpus['public'];
	}
		
	function execute(){
		global $db, $user, $corpus, $config;

		$export_id = $_GET['export_id'];
		$path = $config->path_exports;
		$file = Page_export::getExportFilePath($export_id);
		
		header('Content-Type: text/csv; charset=utf-8');
		header("Content-Disposition: attachment; filename=\"inforex_export_{$export_id}.7z\"");		
		header('Content-Length: ' . filesize($file));
		readfile($file);
		exit;
	}
		
}


?>
