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
	'super'=>$_POST['super']
	//'priority'=>$_POST['priority']
);

$dbProvider->saveOrganization($_POST['id'], $data);




