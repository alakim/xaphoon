<?php 
/** 
*
*      Формирование единого JSON-документа из XML-базы, размещенной в разных файлах
*
**/

include 'xml2json.php';

class XmlDB{
	
	static $cachedFile = '../cache/db';
	static $docPath = 'xmlData/db.xml';
	
	function __construct(){
		$this->dbDoc = new DOMDocument('1.0', 'UTF-8');
		$this->dbDoc->load(self::$docPath) or die('Error loading '.self::$docPath);
		$this->xpath = new DOMXPath($this->dbDoc);
	}
	


	function writeSongs($outFile){
		$songs = $this->xpath->query('/xaphoonDB/songs/song');
		$first = true;
		foreach($songs as $song){
			if($first)$first = false; else fwrite($outFile, ",");
			$orgID = $song->getAttribute('id');
			fwrite($outFile, '"'.$orgID.'":');
			Xml2Json::writeXElement($outFile, $song, false);
		}
	}


	
	// выводит все содержимое в формате JSON
	function writeContent($clearCache){
		if(!file_exists(self::$cachedFile) || $clearCache){
			$file = fopen(self::$cachedFile, 'w');
			fwrite($file, "{");
			fwrite($file, '"songs":{');
			$this->writeSongs($file);
			fwrite($file, '}}');
			fclose($file);
		}

		function file_get_contents_utf8($fn) {
			$content = file_get_contents($fn);
			return $content;
		}

		$content = file_get_contents_utf8(self::$cachedFile);
		echo($content);
	}
	
	function getDocument(){
		return $this->dbDoc;
	}
	
	// сохраняет документ, обновляет кэш
	function saveDocument(){
		$this->dbDoc->save(self::$docPath) or die('Error saving '.self::$docPath);
		if(file_exists(self::$cachedFile)) unlink(self::$cachedFile);
	}
	
	// создает новый уникальный идентификатор
	function getNewID(){
		$counter = 1;
		$id = "i".$counter;
		$nodes = $this->xpath->query("//*[@id='".$id."'][1]");
		while($nodes->length>0){
			$counter = $counter+1;
			$id = "i".$counter;
			$nodes = $this->xpath->query("//*[@id='".$id."'][1]");
		}
		return $id;
	}
	

}



