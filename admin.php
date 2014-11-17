<?php
	session_start(); 
	$ticket = $_SESSION["ticket"];
	$usrName = $_SESSION["usrName"];
	$usrID = $_SESSION["usrID"];
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<title>���������� ����������</title>
	<link rel="stylesheet" type="text/css" href="reset.css"/>
	<link rel="stylesheet" type="text/css" href="styles.css"/>
	<!-- "main_admin" for compiled scripts or "admin" for separate scripts -->
	<script type="text/javascript" data-main="js/admin" src="js/lib/require.js"></script>
	<script type="text/javascript">
		$USER = {
			ticket: "<?=$ticket?>",
			name: "<?=$usrName?>",
			login: "<?=$usrID?>"
		};
		if(!$USER.ticket || !$USER.ticket.length) $USER.ticket = null;
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