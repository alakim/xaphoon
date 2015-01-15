<?php
//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];
$sessions = ProviderFactory::getSessions(null);

if(!$sessions->checkTicket($ticket)){
	Util::writeError('errAuthorizationRequired');
	die;
}

$userProvider = new XmlUsersDB();



$data = array(
	'login'=>$_POST['login'],
	'name'=>$_POST['name'],
	'organization'=>$_POST['organization'],
	'password'=>$_POST['password']
);

$userProvider->saveUser($data);

echo('{"success":true}');

