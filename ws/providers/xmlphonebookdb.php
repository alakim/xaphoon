<?php 
/** 
*
*      Формирование единого JSON-документа из XML-базы, размещенной в разных файлах
*
**/

include 'xml2json.php';

class XmlPhonebookDB{
	
	static $cachedFile = '../cache/phonebook';
	static $dirPath = 'xmlData/phonebook/splitted/organizations';
	static $columnsDoc = 'xmlData/phonebook/splitted/columns.xml';
	
	function __construct(){
		
	}
	

	function writeColumns($outFile){
		$doc = new DOMDocument('1.0', 'UTF-8');
		$doc->load(self::$columnsDoc) or die('Error loading');
		$xp = new DOMXPath($doc);
		$cols = $xp->query('//col');
		$first = true;
		foreach($cols as $col){
			$cID = $col->getAttribute('id');
			$cNm = Xml2Json::prepareValue($col->getAttribute('name'));
			if($first)$first = false; else fwrite($outFile, ",");
			fwrite($outFile, '"'.$cID.'":{"id":"'.$cID.'","name":"'.$cNm.'"}');
		}
	}

	function writeOrganizations($outFile){
		$files = scandir(self::$dirPath);
		$first = true;
		foreach($files as $org){
			if($org=="." || $org=="..") continue;
			if($first)$first = false; else fwrite($outFile, ",");
			$orgNm = str_replace('.xml', '', $org);
			fwrite($outFile, '"'.$orgNm.'":');
			Xml2Json::writeXDoc(self::$dirPath.'/'.$org, $outFile);
		}
	}


	function writeContent($clearCache){

		if(!file_exists(self::$cachedFile) || $clearCache){
			$file = fopen(self::$cachedFile, 'w');
			fwrite($file, "{");
			fwrite($file, '"columns":{');
			$this->writeColumns($file);
			fwrite($file, '},"organizations":{');
			$this->writeOrganizations($file);
			fwrite($file, '}');
			fwrite($file, "}");
			fclose($file);
		}

		function file_get_contents_utf8($fn) {
			$content = file_get_contents($fn);
			return $content;
		}

		$content = file_get_contents_utf8(self::$cachedFile);
		echo($content);
	}
}



