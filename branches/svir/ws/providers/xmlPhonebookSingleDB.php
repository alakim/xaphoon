<?php 
/** 
*
*      Формирование единого JSON-документа из XML-базы, размещенной в разных файлах
*
**/

include 'xml2json.php';

class XmlPhonebookSingleDB{
	
	static $cachedFile = '../cache/phonebook';
	static $docPath = 'xmlData/phonebook/single/phonebook.xml';
	
	function __construct(){
		$this->dbDoc = new DOMDocument('1.0', 'UTF-8');
		$this->dbDoc->load(self::$docPath) or die('Error loading '.self::$docPath);
		$this->xpath = new DOMXPath($this->dbDoc);
	}
	

	// выводит список колонок в формате JSON
	function writeColumns($outFile){
		$cols = $this->xpath->query('/phonebook/columns/col');
		$first = true;
		foreach($cols as $col){
			$cID = $col->getAttribute('id');
			$cNm = Xml2Json::prepareValue($col->getAttribute('name'));
			if($first)$first = false; else fwrite($outFile, ",");
			fwrite($outFile, '"'.$cID.'":{"id":"'.$cID.'","name":"'.$cNm.'"}');
		}
	}

	// выводит список организаций в формате JSON
	function writeOrganizations($outFile){
		$orgs = $this->xpath->query('/phonebook/organizations/organization');
		$first = true;
		foreach($orgs as $org){
			if($first)$first = false; else fwrite($outFile, ",");
			$orgID = $org->getAttribute('id');
			fwrite($outFile, '"'.$orgID.'":');
			Xml2Json::writeXElement($outFile, $org);
		}
	}


	
	// выводит все содержимое в формате JSON
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
	
	function getDocument(){
		return $this->dbDoc;
	}
	
	// сохраняет документ, обновляет кэш
	function saveDocument(){
		$this->dbDoc->save(self::$docPath) or die('Error saving '.self::$docPath);
		if(file_exists(self::$cachedFile)) unlink(self::$cachedFile);
	}
	
	// сохраняет данные сотрудника
	function savePerson($id, $data){
		$node = $this->xpath->query("//person[@id='".$id."']")->item(0);
		foreach($data as $key => $val){
			$node->setAttribute($key, $val);
		}
		$this->saveDocument();
		echo('{"success":true}');
	}
}



