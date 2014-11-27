<?php
//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];
if($ticket==null){
	Util::writeError('errAuthorizationRequired');
	die;
}

$dbProvider = ProviderFactory::getPhonebook();

$orgID = $_POST['id'];
$order = $_POST['order'];

$dbProvider->savePersOrder($orgID, $order);




