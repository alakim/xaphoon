<?php 

class Identity{
	function __construct($items){
		$this->ids = array();
		$this->itemsChanged = false;
		$duplicated = array();
		foreach($items as $itm){
			$itmID = $itm->getAttribute('id');
			//echo("found ID ".$itmID." - ");
			if($this->ids[$itmID]){
				if(!array_key_exists($itmID, $duplicated)){
					$duplicated[$itmID] = array();
				}
				array_push($duplicated[$itmID], $itm);
			}
			$this->ids[$itmID] = true;
			//echo("<br/>");
		}
		
		foreach($duplicated as $dup => $list){
			foreach($list as $itm){
				$newID = $this->getNewID();
				$itm->setAttribute('id', $newID);
				$this->itemsChanged = true;
			}
		}
	}
	
	private $lastNewIDCounter = 1;
	function getNewID(){
		$counter = $this->lastNewIDCounter;
		$id = "i".$counter;
		while($this->ids[$id]){
			$counter = $counter+1;
			$id = "i".$counter;
		}
		$this->lastNewIDCounter = $counter;
		$this->ids[$id] = true;
		return $id;
	}
	
}

// function Test(){
// 	$docPath = 'xmlData/phonebook/single/phonebook.xml';
// 	$dbDoc = new DOMDocument('1.0', 'UTF-8');
// 	$dbDoc->load($docPath) or die('Error loading '.$docPath);
// 	$xpath = new DOMXPath($dbDoc);
// 	$items = $xpath->query("//*[@id]");
// 	$identity = new Identity($items);
// 
// 	if($identity->itemsChanged){
// 		$dbDoc->save($docPath) or die('Error saving '.$docPath);
// 	}
// 
// 	
// 	echo("<hr/>");
// 	echo("new id: ".$identity->getNewID()."<br/>");
// 	echo("new id: ".$identity->getNewID()."<br/>");
// 	echo("new id: ".$identity->getNewID()."<br/>");
// 	echo("new id: ".$identity->getNewID()."<br/>");
// 	echo("new id: ".$identity->getNewID()."<br/>");
// 	echo("new id: ".$identity->getNewID()."<br/>");
// 
// }
// Test();

