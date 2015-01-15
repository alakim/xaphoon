<?php
// ********* Сохранение множества записей **********


//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];
$orgID = $_POST["orgID"];
$jsonStruct = $_POST["structure"];

$sessions = ProviderFactory::getSessions(null);

if(!$sessions->checkTicket($ticket)){
	Util::writeError('errAuthorizationRequired');
	die;
}

$dbProvider = ProviderFactory::getPhonebook();

$dbProvider->saveStruct($orgID, $jsonStruct);




