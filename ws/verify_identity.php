<?php
//require('../util.php');
require('providers/factory.php');
include 'identity.php';

$ticket = $_POST["ticket"];
$sessions = ProviderFactory::getSessions(null);

if(!$sessions->checkTicket($ticket)){
	Util::writeError('errAuthorizationRequired');
	die;
}

$dbProvider = ProviderFactory::getPhonebook();

$doc = $dbProvider->getDocument();
$xp = new DOMXPath($doc);

$docChanged = false;
$ids = array();
$newIDs = array();
$notIdenfified = array();

$idItems = $xp->query("//*[@id]");
$identity = new Identity($idItems);
if($identity->itemsChanged){
	$dbProvider->saveDocument();
}

function getNewID(){
	return $identity->getNewID();
}

$errors = array();

foreach( $xp->query("//person") as $prs){
	if($prs->hasAttribute('id')){
		$prsID = $prs->getAttribute('id');
		if(array_key_exists($prsID, $ids)){
			array_push($errors, 'Дублирование идентификатора "'.$prsID.'"');
		}
		else
			$ids[$prsID] = true;
	}
	else{
		array_push($notIdenfified, $prs);
	}
}

foreach( $xp->query("//organization") as $org){
	if($org->hasAttribute('id')){
		$ids[$org->getAttribute('id')] = true;
	}
	else{
		array_push($notIdenfified, $org);
	}
}

foreach($notIdenfified as $itm){
	$id = getNewID();
	$itm->setAttribute('id', $id);
	$docChanged = true;
}

echo('{"complete":true');
if(count($newIDs)>0){
	echo(',"addedIDs":"');
	$first = true;
	foreach($newIDs as $id){
		if($first)$first = false; else echo(", ");
		echo($id);
	}
	echo('"');
}
if($docChanged){
	$dbProvider->saveDocument();
	echo(',"documentSaved":true');
}
if(count($errors)>0){
	echo(',"errors":[');
	$first = true;
	foreach($errors as $err){
		if($first)$first=false; else echo(',');
		echo('"'.$err.'"');
	}
	echo(']');
}

echo('}');

