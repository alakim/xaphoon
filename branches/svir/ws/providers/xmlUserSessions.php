<?php 

class XmlUsersSessions{
	// отдельный файл для хранения сессий чтобы не засорять SVN-репозиторий 
	// постоянно меняющимися значениями тикетов
	static $storageDoc = 'userSessions.xml';
	
	function __construct($baseDir){
		if($baseDir==null) $this->docPath = 'xmlData/'.self::$storageDoc;
		else $this->docPath = $baseDir.self::$storageDoc;
	}
	
	private function getDoc(){
		$xmlDoc = new DOMDocument('1.0', 'UTF-8');
		$xmlDoc->load($this->docPath);
		return $xmlDoc;
	}
	
	private function getUser($xmlDoc, $usrID){
		$xpath = new DOMXPath($xmlDoc);
		return $xpath->query("/userSessions/user[@id='$usrID']");
	}
	
	function checkTicket($ticket){
		if(is_null($ticket)) return false;
		$xDoc = self::getDoc();
		$xpath = new DOMXPath($xDoc);
		$user = $xpath->query("/userSessions/user[@ticket='$ticket']");
		return $user->length>0;
	}
	
	function getAuthorizedUser($ticket){
		$xDoc = self::getDoc();
		$xpath = new DOMXPath($xDoc);
		$user = $xpath->query("/userSessions/user[@ticket='$ticket']");
		if($user->length==0) return;
		return $user->item(0)->getAttribute('id');
	}
	
	function setSession($usrID, $ticket){
		$xDoc = self::getDoc();
		$user = self::getUser($xDoc, $usrID);
		if($user->length!=0)
			$user = $user->item(0);
		else{
			$user = $xDoc->createElement("user");
			$xpath = new DOMXPath($xDoc);
			$section = $xpath->query("/userSessions")->item(0);
			$section->appendChild($user);
			$user->setAttribute('id', $usrID);
		}
		$user->setAttribute('ticket', $ticket);
		$xDoc->save($this->docPath);
	}
	
	function closeSession($ticket){
		$xDoc = self::getDoc();
		$xpath = new DOMXPath($xDoc);
		$user = $xpath->query("/userSessions/user[@ticket='$ticket']");
		if($user->length==0) return;
		
		$user = $user->item(0);
		$user->setAttribute('ticket', '');
		$xDoc->save($this->docPath);
	}
}