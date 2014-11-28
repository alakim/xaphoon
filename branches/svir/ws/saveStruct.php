<?php
// ********* Сохранение множества записей **********


//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];
$orgID = $_POST["orgID"];
$jsonStruct = $_POST["structure"];

if($ticket==null){
	Util::writeError('errAuthorizationRequired');
	die;
}

$dbProvider = ProviderFactory::getPhonebook();

$dbProvider->saveStruct($orgID, $jsonStruct);




