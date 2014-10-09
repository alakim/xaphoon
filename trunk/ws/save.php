<?php 
	$docPath = "../data/".$_POST["path"];
	if(get_magic_quotes_gpc())
		$docContent = stripslashes($_POST["data"]);
	else
		$docContent = $_POST["data"];
	file_put_contents($docPath, $docContent);
	echo ($docContent);
?>
