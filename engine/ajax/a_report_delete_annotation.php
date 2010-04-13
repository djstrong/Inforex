<?php
/**
 * Usuwa anotację z dokumentu i bazy danych. 
 * 
 */
class Ajax_report_delete_annotation extends CPage {
	
	function execute(){
		global $mdb2;
		$annid = intval($_POST['annotation_id']);

		$row = $mdb2->queryRow("SELECT r.id, r.content FROM reports_annotations ra JOIN reports r ON (r.id=ra.report_id) WHERE ra.id=$annid");
		$id = $row[0];
		$content = $row[1];
		if ($id){
			$content = preg_replace("/<an#$annid:.*?>(.*?)<\/an>/", "$1", $content);
			$mdb2->query("UPDATE reports SET content='".mysql_escape_string($content)."' WHERE id={$id}");
			$mdb2->query("DELETE FROM reports_annotations WHERE id=$annid");
			$json = array("success" => "ok");		
		}
		else{
			$json = array("error" => 'Anotacja nie istnieje w bazie.');
		}
		echo json_encode($json);
	}
	
}
?>