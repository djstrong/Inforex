<?php
class Ajax_sens_edit_get_sens extends CPage {
	var $isSecure = false;
	function execute(){
		
		$result = DbSens::getSensDataById($_POST['sens_id']);
		echo json_encode($result);
	}	
}
?>