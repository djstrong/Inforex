<?php
/*
 * Created on 2009-10-30
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */
class TextAligner{
	
	var $text;
	var $index = 0;
	var $is_begin = false;
	var $is_end = false;
	// Czy koniec adnotacji jest wewnątrz tokenu
	var $is_end_inside = false;
	var $inside_end_at = 0;
	var $annotation_name = "";
	var $logs = array();
	
	function __construct($annotated_text){
		$content = $annotated_text;
		$content = html_entity_decode($content);
        $content = preg_replace('/<(\/)?[pP]>/s', ' ', $content);
        $content = preg_replace('/<br(\/)?>/s', ' ', $content);
        $content = trim($content);
		$this->text = $content;
	}
	
	function at($index){
		return $this->text[$index];
	}
	
	/**
	 * Dopasowuje dany fragment tekstu. Jeżeli tekst został dopasowany zwraca true, wpp false. 
	 */
	function align($text_fragment){
		// Jeżeli po ostatnim wywołaniu osiągnięto koniec adnotacji, to usuń teraz jej nazwę.
		if ($this->is_end || $this->is_end_inside)
			$this->annotation_name = "";
			
		$this->is_begin = false;
		$this->is_end = false;
		$this->is_end_inside = false;
		$this->inside_end_at = 0;
		$this->logs = array();
		
		// Sprawdz, czy jest początek adnotacji
		$i = $this->index;
		$this->log("===============");
		$this->log("@" .$this->index. ": " . mb_substr($this->text, $this->index, 40)."...");
		$this->log("   ? ".$text_fragment);
		if ($this->at($i) == "<" && substr($this->text, $i, 4) == "<an#"){
			$moveto = mb_strpos($this->text, ":", $i) + 1;
			$this->log("Move: " . $i . " -> " . $moveto);
			$i = $moveto;
			
			$i_end = mb_strpos($this->text, ">", $i);
			$ann_name = mb_substr($this->text, $i, $i_end-$i);
			// Ustaw wskaźnik na pierwszy znak po adnotacji.
			$this->index = $i_end + 1;
			$this->log("=>@" .$this->index. ": " . mb_substr($this->text, $this->index, 40)."...");
			$this->pass_whitespaces();
			$this->is_begin = true;
			$this->annotation_name = $ann_name;
			$this->log("Ann: ".$ann_name);
		}
		// Wytnik tekst pomijając adnotacje
		$cutnum = mb_strlen(trim($text_fragment));
		$cutoff = "";
		$this->pass_whitespaces();
		while ($cutnum>0){
			if ($this->is_next_tag_end()){
				$this->is_end_inside = true;
				$this->inside_end_at = mb_strlen(trim($text_fragment)) - $cutnum;
				$this->index += 5;
				//$this->pass_whitespaces();
			}else{
				$cutnum--;
				$cutoff .= mb_substr($this->text, $this->index++, 1);
			}
		}
		$this->index += $cutnum;
		
		$this->log("Cutoff='".$cutoff."' (".strlen($cutoff).") ; Fragment='".$text_fragment."'");
		$this->log("@" .$this->index. ": " . mb_substr($this->text, $this->index, 40)."...");
		
		if ( $cutoff == $text_fragment ){
			$this->log("TRUE");
			//$this->index += strlen($text_fragment); 
		
			if ($this->is_next_tag_end()){
				$this->index += 5;
				$this->is_end = true;
			}
				
			$this->pass_whitespaces();
			return true;
		}
		else{
			return false;
		}
	}

	/**
	 * Przewiń do pierwszego znagu nie będącego białym znakiem.
	 */	
	function pass_whitespaces(){
		while ( $this->index < strlen($this->text) && trim($this->text[$this->index])=='')
			$this->index++;		
	}
	
	function is_next_tag_end($index = null){
		if ($index == null)
			$index = $this->index;
		return mb_substr($this->text, $index, 5) == '</an>';
	}
		
	function log($msg){
		fb($msg);
		$this->logs[] = $msg;		
	}	
}
?>
