<?php
	session_start(); 
	$ticket = $_SESSION["ticket"];
	$usrName = $_SESSION["usrName"];
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>Xaphoon</title>
	<link rel="stylesheet" href="reset.css"/>
	<link rel="stylesheet" href="styles.css"/>
	<script type="text/javascript" data-main="js/main" src="js/lib/require.js"></script>
	<script type="text/javascript">
		$USER = {
			ticket: "<?=$ticket?>",
			name: "<?=$usrName?>"
		};
		if(!$USER.ticket || !$USER.ticket.length) $USER.ticket = null;
	</script>
</head>
<body>
	<header>
		<h1>Xaphoon</h1>
	</header>
	<nav>
		<div class="mainMenu"></div>
	</nav>
	<div class="mainPanel"></div>
	
	
	<footer>Xaphoon Team &copy;2014</footer>
</body>
</html>