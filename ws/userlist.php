<?php
//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];
$fullMode = $_POST["fullMode"]=='true';
$sessions = ProviderFactory::getSessions(null);

if(!$sessions->checkTicket($ticket)){
	Util::writeError('errAuthorizationRequired');
	die;
}

$userProvider = new XmlUsersDB();
		
if(true){
	$userProvider->writeSimpleUsersList($fullMode);
}
else{
	Util::writeError('errUserListError');
}

