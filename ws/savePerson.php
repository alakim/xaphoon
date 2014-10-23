<?php
//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];
if($ticket==null){
	Util::writeError('errAuthorizationRequired');
	die;
}

$dbProvider = ProviderFactory::getPhonebook();



$data = array(
	'fio'=>$_POST['fio'],
	'dolzh'=>$_POST['dolzh'],
	'vnutTel'=>$_POST['vnutTel'],
	'rabTel'=>$_POST['rabTel'],
	'faks'=>$_POST['faks'],
	'mobTel'=>$_POST['mobTel'],
	'elekAdr'=>$_POST['elekAdr'],
	'numKomn'=>$_POST['numKomn'],
	'potchtAdr'=>$_POST['potchtAdr']
);

$dbProvider->savePerson($_POST['id'], $data);




