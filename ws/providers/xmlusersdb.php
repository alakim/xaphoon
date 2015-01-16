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
		if($endDate==null) return $passwordChecked;
		
		$now = new DateTime();
		$T2 = new DateTime($endDate);
		$D = $now->diff($T2);
		$TooOld = $D->format('%R') == '-';
		
		return $passwordChecked && !$TooOld;
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
				$access = $this->getAccess($id);
				echo(',"access":{');
				$first = true;
				foreach($access as $k=>$v){
					if($first)$first=false; else echo(',');
					echo('"'.$k.'":'.($v?'1':'0'));
				}
				echo('}');
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
	
	private function addAccess($acc, &$permissions){
		if($acc->tagName=="users")
			$permissions["@users"] = true;
		else if($acc->tagName=="verification")
			$permissions["@verification"] = true;
		else if($acc->tagName=="allow"){
			$orgID = $acc->getAttribute('org');
			$permissions[$orgID] = true;
		}
		else if($acc->tagName=="deny"){
			$orgID = $acc->getAttribute('org');
			$permissions[$orgID] = false;
		}
	}
	
	function getAccess($usrID){
		$db = $this->dbDoc;
		if($db=='') return;
		$doc = new DOMDocument('1.0', 'UTF-8');
		$doc->load('xmlData/'.$db);
		$xp = new DOMXPath($doc);
		
		$permissions = array();
		
		$groups = $xp->query("//users/user[@id='$usrID']/member/@group");
		foreach($groups as $grp){
			$grpID = $grp->value;
			$access = $xp->query("//groups/group[@id='$grpID']/access/*");
			foreach($access as $acc){
				$this->addAccess($acc, $permissions);
			}
		}
		$usrAccess = $xp->query("//users/user[@id='$usrID']/access/*");
		foreach($usrAccess as $acc){
			$this->addAccess($acc, $permissions);
		}
		return $permissions;
	}
	
	function writeUserPermissions($usrID){
		$db = $this->dbDoc;
		if($db=='') return;
		$doc = new DOMDocument('1.0', 'UTF-8');
		$doc->load('xmlData/'.$db);
		$xp = new DOMXPath($doc);
		
		$groups = $xp->query("//users/user[@id='$usrID']/member/@group");
		
		$permissions = $this->getAccess($usrID);
		echo("{");
		$first = true;
		foreach($permissions as $k=>$v){
			if($first)$first=false; else echo(',');
			echo('"'.$k.'":'.($v?'1':'0'));
		}
		echo("}");
		
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



