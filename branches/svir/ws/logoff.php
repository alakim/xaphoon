<?php
session_start(); 

//require('util.php');
require('providers/factory.php');

$ticket = $_POST["ticket"];


$userProvider = new XmlUsersDB();
$sessionProvider = ProviderFactory::getSessions(null);
		
$sessionProvider->closeSession($ticket);
$_SESSION["ticket"] = '';
$_SESSION["usrName"] = '';

echo("{}");

