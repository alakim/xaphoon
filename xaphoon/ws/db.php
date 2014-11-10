<?php

require('providers/factory.php');

$clearCache = isset($_REQUEST['clearcache']);

$dbProvider = ProviderFactory::getDB();

$dbProvider->writeContent($clearCache);


