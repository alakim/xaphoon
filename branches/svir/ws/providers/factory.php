<?php 
//require('xmldb.php');
//require('xmlTree.php');
require('xmlusersdb.php');
require('xmlUserSessions.php');

//require('xmlphonebookdb.php');
require('xmlPhonebookSingleDB.php');

class ProviderFactory{
	// static function getDBTypes(){
	// 	return array(
	// 		'xmlDB'=>'XmlDB',
	// 		'xmlUsersDB'=>'XmlUsersDB'
	// 	);
	// }
	
	static function getSessions($baseDir){
		return new XmlUsersSessions($baseDir);
	}

	// static function getTree(){
	// 	return new XmlTree();
	// }

	static function getUsers(){
		return new XmlUsersDB();
	}
	
	static function getPhonebook(){
		// return new XmlPhonebookDB();
		return new XmlPhonebookSingleDB();
	}
	
	// static function getTable($tblRef){
	// 	$provName = $tblRef['srcType'];
	// 	if($provName==''){
	// 		echo("{\"error\":\"errMissingDataProvider\"}");
	// 		die();
	// 	};
	// 	$provider = new $provName($tblRef[$provName::$idField]);
	// 	return $provider;
	// }
	
}