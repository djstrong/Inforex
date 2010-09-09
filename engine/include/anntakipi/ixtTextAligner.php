<?php
/* 
 * ---
 * 
 * ---
 * Created on 2010-01-13
 * Michał Marcińczuk <marcinczuk@gmail.com> [czuk.eu]
 */
 
//class AlignResult{
//	var $begin = null; 
//	var $ended = false;
//	var $inside = false;
//	
//	function __construct($begin, $ended, $inside){
//		$this->begin = $begin;
//		$this->ended = $ended;
//		$this->inside = $inside;
//	}
//} 
 
class TextAligner{
	
	// Public variables
	var $is_begin = false;
	var $is_end = false;
	var $is_inside = false;
	var $annotation_name = "";
	
	// Private variables
	var $_text = "";
	var $_text_length = "";
	var $_index = 0;	
	
	var $_c194 = null;
	var $_c160 = null;
	
	function __construct($text){
		$this->_text = $text;
		$this->_text_length = strlen($text);
		$this->_c194 = chr(194);
		$this->_c160 = chr(160);
	}
	
	function at($index){
		return $this->_text[$index];
	}
	
	function getNext($size){
		return mb_substr($this->_text, $this->_index, $size);
	}
	
	/**
	 * Dopasowuje dany fragment tekstu. Jeżeli tekst został dopasowany zwraca true, wpp false.
	 * Po udanym dopasowaniu ustawiane są następujące zmienne:
	 * $is_begin = true -- napotkano początek adnotacji
	 * $is_end   = true -- napotkano koniec adnotacji
	 * $is_border_inside = true -- początek lub koniec adnotacji wystąpił wewnątrz dopasowanego tekstu
	 * $annotation_name -- nazwa ostatnio napotkanej adnotacji
	 */
	function align($text_fragment){
		// Jeżeli po ostatnim wywołaniu osiągnięto koniec adnotacji, to usuń teraz jej nazwę.
		if ($this->is_end) $this->annotation_name = "";
			
		$this->is_begin = false;
		$this->is_end = false;
		$this->is_inside = false;
		
		// Sprawdz, czy jest początek adnotacji
		$backup_index = $this->_index; 

		$cutnum = mb_strlen(trim($text_fragment)); // Number of characters to pass
		$cutoff = "";
		while ($cutnum>0){
			$this->pass_whitespaces();
			if ($this->is_next_tag_begin()){
				if ($cutoff!="") {
					// The annotation begin was found inside the character sequence.
					$this->is_inside = true;
				}; 
				$this->consume_tag_begin();
			}
			elseif ($this->is_next_tag_end()){
				$this->is_inside = true;
				$this->is_end = true;
				$this->_index += 5;
			}else{
				$cutnum--;
				$cutoff .= mb_substr($this->_text, $this->_index++, 1);
			}
		}
		$this->_index += $cutnum;
		
		if ( $cutoff == $text_fragment ){
			if ($this->is_next_tag_end()){
				$this->_index += 5;
				$this->is_end = true;
			}				
			$this->pass_whitespaces();
			return true;
		}
		else{
			$this->_index = $backup_index;
			return false;
		}
	}

	/**
	 * Przewiń do pierwszego znaku nie będącego białym znakiem.
	 */	
	function pass_whitespaces(){
		do{
			$before = $this->_index;
			// Hack to pass unicde character 194,160
			if ($this->_index+1 < $this->_text_length && $this->_text[$this->_index]==$this->_c194 && $this->_text[$this->_index+1]==$this->_c160 ) 
				$this->_index+=2;
			elseif ($this->_index < $this->_text_length && trim($this->_text[$this->_index])=='') 
				$this->_index++;
		}
		while ($before != $this->_index);
	}
	
	function is_next_tag_end($index = null){
		if ($index == null)
			$index = $this->_index;
		return mb_substr($this->_text, $index, 5) == '</an>';
	}
	
	function is_next_tag_begin($index = null){
		if ($index == null)
			$index = $this->_index;
		return $this->at($this->_index) == "<" && substr($this->_text, $this->_index, 4) == "<an#";
	}
	
	function consume_tag_begin(){
		$i = $this->_index;
		$moveto = mb_strpos($this->_text, ":", $i) + 1;
		$i = $moveto;
		
		$i_end = mb_strpos($this->_text, ">", $i);
		$ann_name = mb_substr($this->_text, $i, $i_end-$i);
		// Ustaw wskaźnik na pierwszy znak po adnotacji.
		$this->_index = $i_end + 1;
		$this->pass_whitespaces();
		$this->is_begin = true;
		$this->annotation_name = $ann_name;		
	}
		
}
 
?>
