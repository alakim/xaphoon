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



$dbProvider->deleteOrganization($_POST['id']);




