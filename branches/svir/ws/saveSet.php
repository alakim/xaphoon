<?php
// ********* Сохранение множества записей **********


//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];
$orgID = $_POST["orgID"];
$jsonPersons = $_POST["persons"];

if($ticket==null){
	Util::writeError('errAuthorizationRequired');
	die;
}

$dbProvider = ProviderFactory::getPhonebook();

$dbProvider->saveSet($orgID, $jsonPersons);




