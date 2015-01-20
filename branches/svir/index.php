<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>Телефонный справочник</title>
	<link rel="stylesheet" type="text/css" href="reset.css"/>
	<link rel="stylesheet" type="text/css" href="styles.css"/>
	
	<!-- main_pub || main -->
	<script type="text/javascript" data-main="js/main_pub" src="js/lib/require.js"></script>
	
	<script type="text/javascript">
		var $DATA = <?php 
			ini_set("include_path", "ws");
			require('providers/factory.php');
			XmlPhonebookSingleDB::$cachedFile = 'cache/phonebook';
			XmlPhonebookSingleDB::$docPath = 'ws/xmlData/phonebook/single/phonebook.xml';
			$dbProvider = ProviderFactory::getPhonebook();
			$dbProvider->writeContent($clearCache);
		?>;
	</script>
</head>
<body>
	<?php include 'header.php'; ?>
	<nav class="mainMenu">
		<img src="images/wait.gif"/>
	</nav>
	<div id="out">
		
	</div>
	<?php include 'footer.php'; ?>
</body>
</html>