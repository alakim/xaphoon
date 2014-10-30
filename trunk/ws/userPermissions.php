<?php

require('providers/factory.php');

$ticket = $_POST["ticket"];
if($ticket==null){
	Util::writeError('errAuthorizationRequired');
	die;
}

Util::writeUserPermissions($ticket);


