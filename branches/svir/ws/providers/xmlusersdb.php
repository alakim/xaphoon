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
		
		$passwordChecked = $users->item(0)->getAttribute('password')==md5($password);
		
		$endDate = $users->item(0)->getAttribute('endDate');
		$dateChecked = $endDate!=null;
		
		return $passwordChecked;// && $dateChecked;
	}
	
	function writeSimpleUsersList($fullMode){
		$doc = new DOMDocument('1.0', 'UTF-8');
		$doc->load('xmlData/usersDB.xml');
		$xp = new DOMXPath($doc);
		$users = $xp->query("//users/user");
		
		echo("{\"users\":[");
		foreach($users as $usr){
			$id = Util::conv($usr->getAttribute('id'));
			$nm = Util::conv($usr->getAttribute('name'));
			echo("{\"login\":\"".$id."\",\"name\":\"".$nm."\"");
			if($fullMode){
				$org = $xp->query('access/organization/@id', $usr);
				if($org->length>0)
					echo(',"organization":"'.$org->item(0)->nodeValue.'"');
			}
			echo('},');
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
			
			else if($acc->tagName=="verification")
				echo('"verification"');
			
			else if($acc->tagName=="organization"){
				$orgID = $acc->getAttribute('id');
				echo('{"organization":"'.$orgID.'"}');
			}
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
	
	
	function saveUser($data){
		$db = $this->dbDoc;
		if($db=='') return;
		
		$doc = new DOMDocument('1.0', 'UTF-8');
		$doc->load('xmlData/'.$db);
		$xp = new DOMXPath($doc);
		
		$uColl = $xp->query("//users/user[@id='".$data['login']."']");
		if($uColl->length>0){
			$user = $uColl->item(0);
			$user->setAttribute('name', $data['name']);
			if(isset($data['password'])){
				$user->setAttribute('password', md5($data['password']));
			}
			if(isset($data['organization'])){
				$org = $xp->query('access/organization', $user);
				if($org->length==0){
					$acc = $xp->query('access', $user);
					if($acc->length==0){
						$a = $doc->createElement('access');
						$user->appendChild($a);
						$acc = $a;
					}
					else{
						$acc = $acc->item(0);
					}
					$org = $doc->createElement('organization');
					$acc->appendChild($org);
				}
				else{
					$org = $org->item(0);
				}
				$org->setAttribute('id', $data['organization']);
			}
			
			$doc->save('xmlData/'.$db) or die('Error saving '.self::$docPath);
		}
	}
	
	
}



