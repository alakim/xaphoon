<?php 
//require('xmldb.php');
//require('xmlTree.php');
require('xmlusersdb.php');
require('xmlUserSessions.php');

//require('xmlphonebookdb.php');
require('xmlDB.php');

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
	
	static function getDB(){
		// return new XmlPhonebookDB();
		return new XmlDB();
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