<?php
class Ajax_corpus_add extends CPage {
	
	function checkPermission(){
		if (hasRole(USER_ROLE_ADMIN))
			return true;
		else
			return "Brak prawa do edycji.";
	}
	
	function execute(){
		global $db, $user, $mdb2;

		$sql = "INSERT INTO corpora ( name, description, public, user_id, ext) VALUES ( ?, ?, 0, ?, '') ";
		$db->execute($sql, array($_POST['name_str'], $_POST['desc_str'], $user['user_id'])); 

		$last_id = $mdb2->lastInsertID();
		echo json_encode(array("success"=>1, "last_id"=>$last_id));
	}
	
}
?>