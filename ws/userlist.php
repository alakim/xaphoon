<?php
//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];
$fullMode = $_POST["fullMode"]=='true';
if($ticket==null){
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

