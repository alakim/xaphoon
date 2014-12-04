<?php
session_start(); 

//require('util.php');
require('providers/factory.php');

$usr = $_POST["login"];
$psw = $_POST["password"];
$ticket = $_POST["ticket"];

# Функция для генерации случайной строки
function generateCode($length=6) {
	$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRQSTUVWXYZ0123456789";
	$code = "";
	$clen = strlen($chars) - 1;  
	while (strlen($code) < $length) {
		$code .= $chars[mt_rand(0,$clen)];  
	}
	return $code;
}


function getUserHash(){
	return md5(generateCode(10));
}

$userProvider = new XmlUsersDB();
$sessionProvider = ProviderFactory::getSessions(null);
		
if($userProvider->checkUser($usr, $psw)){
	$ticket = getUserHash();
	$nm = $userProvider->getUserName($usr);
	$_SESSION["ticket"] = $ticket;
	$_SESSION["usrName"] = $nm;
	$_SESSION["usrID"] = $usr;
	$sessionProvider->setSession($usr, $ticket);
	header("Content-type: text/html; charset=windows-1251");
	echo("{\"ticket\":\"".$ticket."\",\"login\":\"".$usr."\",\"name\":\"".$nm."\"}");
}
else{
	Util::writeError('errAuthorizationRequired');
}

