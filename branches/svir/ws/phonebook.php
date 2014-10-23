<?php

require('providers/factory.php');

$clearCache = isset($_REQUEST['clearcache']);

$dbProvider = ProviderFactory::getPhonebook();

$dbProvider->writeContent($clearCache);


