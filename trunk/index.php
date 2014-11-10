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
	<link rel="stylesheet" href="xaphoon/reset.css"/>
	<link rel="stylesheet" href="xaphoon/styles.css"/>
	<script type="text/javascript" data-main="xaphoon/js/main" src="xaphoon/js/lib/require.js"></script>
	<script type="text/javascript">
		$USER = {
			ticket: "<?=$ticket?>",
			name: "<?=$usrName?>"
		};
		if(!$USER.ticket || !$USER.ticket.length) $USER.ticket = null;
		$STATE = {
			form:null,
			editMode:false
		};
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