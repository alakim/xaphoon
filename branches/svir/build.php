<?php
// *********************************************
// **                                         **
// **            Javascript builder           **
// **                                         **
// *********************************************


function buildScripts($sources, $target){
	$ff = fopen('js/'.$target, 'w');
	fwrite($ff, "//**** Automatic created file. Don't edit manually! Use build.php. **********\n\n");
	foreach($sources as $mod){
		$script = file_get_contents('js/'.$mod);
		fwrite($ff, $script);
	}
	fclose($ff);
}

buildScripts(array(
	'main.js',
	'util.js',
	'forms/authorization.js',
	'forms/mainMenu.js',
	'forms/phonebookAccordionView.js',
	'forms/phonebookView.js',
	'forms/phonebook_simple.js',
	'forms/search.js',
	'forms/verification.js'
), "main_pub.js");


buildScripts(array(
	'admin.js',
	'util.js',
	'forms/adminMenu.js',
	'forms/authorization.js',
	'forms/colTable_input.js',
	'forms/dataInput.js',
	'forms/table_input.js',
	'forms/users.js',
	'forms/verification.js',
	'forms/myaccount.js'
), "main_admin.js");


echo("Done");

