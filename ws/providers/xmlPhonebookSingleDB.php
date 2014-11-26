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
	
	// добавляет данные сотрудника
	function createPerson($orgID, $data){
		$orgNode = $this->xpath->query("//organization[@id='".$orgID."'][1]")->item(0);
		$node = $this->dbDoc->createElement("person");
		$orgNode->appendChild($node);
		foreach($data as $key => $val){
			$node->setAttribute($key, $val);
		}
		$nID = $this->getNewID(1);
		$node->setAttribute("id", $nID);
	}
	
	// добавляет данные сотрудника и сохраняет документ
	function addPerson($orgID, $data){
		$this->createPerson($orgID, $data);
		$this->saveDocument();
		echo('{"success":true}');
	}
	
	// удаляет данные сотрудника
	function delPerson($id){
		$node = $this->xpath->query("//person[@id='".$id."'][1]")->item(0);
		$node->parentNode->removeChild($node);
		
		$this->saveDocument();
		echo('{"success":true}');
	}
	
	// сохраняет данные организации
	function saveOrganization($id, $data){
		if($id==null){
			$node = $this->dbDoc->createElement('organization');
			$id = $this->getNewID();
			$node->setAttribute('id', $id);
		}
		else
			$node = $this->xpath->query("//organization[@id='".$id."']")->item(0);
		foreach($data as $key => $val){
			if($key!='super') $node->setAttribute($key, $val);
			else{
				if($node->parentNode!=null)
					$node->parentNode->removeChild($node);
				$supOrg = $this->xpath->query("//organization[@id='".$val."']")->item(0);
				if($supOrg!=null)
					$supOrg->appendChild($node);
				else{
					$root = $this->xpath->query("//organizations")->item(0);
					$root->appendChild($node);
				}
			}
		}
		$this->saveDocument();
		echo('{"success":true}');
	}
	
	function deleteOrganization($id){
		if($id==null) {util.writeError('orgDoesNotExists'); return;}
		$node = $this->xpath->query("//organization[@id='".$id."']")->item(0);
		$node->parentNode->removeChild($node);
		$this->saveDocument();
		echo('{"success":true}');
	}
	
	function saveSet($orgID, $jsonPersons){
		
		$orgNode = $this->xpath->query("//organization[@id='".$orgID."'][1]")->item(0);
		$persons = json_decode($jsonPersons);
		foreach($persons as $pers){
			$this->createPerson($orgID, $pers);
		}
		$this->saveDocument();
		echo('{"success":true}');
	}
	
	function saveOrgOrder($orgID, $order){
		if($orgID!=null)
			$parentNode = $this->xpath->query("//organization[@id='".$orgID."']")->item(0);
		else
			$parentNode = $this->xpath->query("//organizations")->item(0);
			
		$order = explode(',', $order);
		
		$orgs = array();
		
		foreach($order as $id){
			$org = $this->xpath->query("//organization[@id='".$id."']", $parentNode)->item(0);
			if($org!=null) $orgs[$id] = $org;
		}
		foreach($order as $id){
			$parentNode->removeChild($orgs[$id]);
		}
		foreach($order as $id){
			$parentNode->appendChild($orgs[$id]);
		}
		
		$this->saveDocument();
		echo('{"success":true}');
	}
}


