<?php


class Ajax_nextcloud_import extends CPagePublic {
		
	function execute(){
		global $corpus, $db, $user, $config;

		$email = strval($_POST['email']);
		$name = strval($_POST['name']);
		$path = strval($_POST['path']);
		$description = strval($_POST['description']);

		if ( $email == "" ){
			die(json_encode(array("error"=>"USER_EMAIL_IS_MISSING")));
		}
		if ( $name == "" ){
			die(json_encode(array("error"=>"CORPUS_NAME_IS_MISSING")));
		}
		if ( $path == "" ){
			die(json_encode(array("error"=>"PATH_IS_MISSING")));
		}

		$user = $db->fetch("SELECT * FROM users WHERE login = ?", array($email));
		
		if ( $user == null ){
            $user = $db->fetch("SELECT * FROM users WHERE clarin_login = ?", array($email));
		}
        if ( $user == null ) {
            die(json_encode(array("error" => "USER_NOT_FOUND: $email")));
        }

        if($description == ""){
            $description = "Import documents from Nextcloud";
        }

		$corpus = new CCorpus();
		$corpus->name = $name;
		$corpus->description = $description;
		$corpus->public = false;
		$corpus->user_id = $user['user_id'];
		$corpus->save();
		
		$this->assignAnnotationSetToCorpus("Named Entities (n82)", $corpus->id);
		$this->assignAnnotationSetToCorpus("Named Entities (top9)", $corpus->id);
		$this->assignAnnotationSetToCorpus("Named Entities (nam)", $corpus->id);
		$this->assignAnnotationSetToCorpus("Temporal Expressions (4 classes)", $corpus->id);
		$this->assignAnnotationSetToCorpus("Temporal Expressions (1 class)", $corpus->id);
		
		$this->assignReportPerspectiveToCorpus("preview", $corpus->id);
		$this->assignReportPerspectiveToCorpus("annotator", $corpus->id);
		$this->assignReportPerspectiveToCorpus("autoextension", $corpus->id);
		$this->assignReportPerspectiveToCorpus("metadata", $corpus->id);
		
		$task = new CTask();
		$task->user_id = $user['user_id'];
		$task->type = "nextcloud_import";
		$task->description = $description;
		$task->parameters = json_encode(array("path"=>$path));
		$task->corpus_id = $corpus->id;
		$task->max_steps = 100;
		$task->current_step = 0;
		$task->status = "new";
		$task->save();
		
		$url = sprintf("%s?page=tasks&corpus=%d&task_id=%d", $config->url, $corpus->id, $task->task_id);
		 		
		die(json_encode(array("redirect"=>$url)));
	}
	
	
	/**
	 * Assign an annotation set identified by a name to a corpus identified by id.
	 * @param $annotation_set_name Name of an annotation set
	 * @param $corpus_id Id of a corpus
	 */
	function assignAnnotationSetToCorpus($annotation_set_name, $corpus_id){
		global $db;
		$annotation_set_id = $db->fetch_one("SELECT annotation_set_id" .
				" FROM annotation_sets" .
				" WHERE description = ?", array($annotation_set_name));
		if ( $annotation_set_id !== null ){
			$cols = array("annotation_set_id"=>$annotation_set_id, "corpus_id"=>$corpus_id);
			$db->insert("annotation_sets_corpora", $cols);
		}
	}		
	
	/**
	 * Assign a report perspective to given corpus.
	 */
	function assignReportPerspectiveToCorpus($perspective_id, $corpus_id){
		global $db;
		$cols = array();
		$cols['corpus_id'] = $corpus_id;
		$cols['perspective_id'] = $perspective_id;
		$cols['access'] = 'loggedin';
		$db->insert("corpus_and_report_perspectives", $cols);
	}
}
