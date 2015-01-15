<?php
//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];
$sessions = ProviderFactory::getSessions(null);

if(!$sessions->checkTicket($ticket)){
	Util::writeError('errAuthorizationRequired');
	die;
}

$dbProvider = ProviderFactory::getPhonebook();



$data = array(
	'name'=>$_POST['name'],
	'rabTel'=>$_POST['rabTel'],
	'faks'=>$_POST['faks'],
	'elekAdr'=>$_POST['elekAdr'],
	'potchtAdr'=>$_POST['potchtAdr']
);

$dbProvider->saveOrganization($_POST['id'], $data);




