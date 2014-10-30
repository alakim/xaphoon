<?php 

class XmlUsersDB{
	static $idField = "usersDBID";
	
	static $defaultDoc = 'usersDB.xml';
	
	function __construct(){
		$this->dbDoc = self::$defaultDoc;
	}
	
	function checkUser($usrID, $password){
		$db = $this->dbDoc;
		if($db=='') return;
		$doc = new DOMDocument('1.0', 'UTF-8');
		$doc->load('xmlData/'.$db);
		$xp = new DOMXPath($doc);
		
		$users = $xp->query("//users/user[@id='$usrID']");
		if($users->length==0) return false;
		return $users->item(0)->getAttribute('password')==md5($password);
	}
	
	function writeSimpleUsersList(){
		$doc = new DOMDocument('1.0', 'UTF-8');
		$doc->load('xmlData/usersDB.xml');
		$xp = new DOMXPath($doc);
		$users = $xp->query("//users/user");
		
		echo("{\"users\":[");
		foreach($users as $usr){
			$id = Util::conv($usr->getAttribute('id'));
			$nm = Util::conv($usr->getAttribute('name'));
			echo("{\"login\":\"".$id."\",\"name\":\"".$nm."\"},");
		}
		echo("null]}");
	}
	
	function getUserName($usrID){
		$db = $this->dbDoc;
		if($db=='') return;
		$doc = new DOMDocument('1.0', 'UTF-8');
		$doc->load('xmlData/'.$db);
		$xp = new DOMXPath($doc);
		
		$users = $xp->query("//users/user[@id='$usrID']");
		if($users->length==0) return;
		return Util::conv($users->item(0)->getAttribute('name'));
	}
	
	function writeUserPermissions($usrID){
		$db = $this->dbDoc;
		if($db=='') return;
		$doc = new DOMDocument('1.0', 'UTF-8');
		$doc->load('xmlData/'.$db);
		$xp = new DOMXPath($doc);
		
		$groups = $xp->query("//users/user[@id='$usrID']/member/@group");
		
		function writeAccess($acc){
			if($acc->tagName=="users")
				echo('"users"');
			else if($acc->tagName=="edit")
				echo('"edit"');
			if($acc->tagName=="verification")
				echo('"verification"');
			
		}
		
		echo("[");
		$first = true;
		foreach($groups as $grp){
			$grpID = $grp->value;
			$access = $xp->query("//groups/group[@id='$grpID']/access/*");
			foreach($access as $acc){
				if($first)$first=false; else echo(',');
				writeAccess($acc);
			}
		}
		
		$usrAccess = $xp->query("//users/user[@id='$usrID']/access/*");
		foreach($usrAccess as $acc){
			if($first)$first=false; else echo(',');
			writeAccess($acc);
		}
		
		echo("]");
	}
	
	
}



