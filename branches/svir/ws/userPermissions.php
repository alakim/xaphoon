<?php

require('providers/factory.php');

$ticket = $_POST["ticket"];

$sessions = ProviderFactory::getSessions(null);

if(!$sessions->checkTicket($ticket)){
	Util::writeError('errAuthorizationRequired');
	die;
}

Util::writeUserPermissions($ticket);


