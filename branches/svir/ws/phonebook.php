<?php

require('providers/factory.php');

$clearCache = isset($_REQUEST['clearcache']);

$dbProvider = ProviderFactory::getPhonebook();

header("Content-type: text/html; charset=windows-1251");
$dbProvider->writeContent($clearCache);


