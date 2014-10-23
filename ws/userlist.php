<?php
//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];
if($ticket==null){
	Util::writeError('errAuthorizationRequired');
	die;
}

$userProvider = new XmlUsersDB();
		
if(true){
	$userProvider->writeSimpleUsersList();
}
else{
	Util::writeError('errUserListError');
}

