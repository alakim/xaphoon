<?php
include 'util.php';

// Преобразование документа, экспортированного из Excel to ODS в формат JSON


$cachedFile = '../cache/phonebook_export';
if(!file_exists($cachedFile)){
	$doc = new DOMDocument('1.0', 'UTF-8');
	$doc->load('xmlData/phonebook_exported.xml') or die('Error loading');
	$xp = new DOMXPath($doc);
	$xp->registerNamespace("table", "urn:oasis:names:tc:opendocument:xmlns:table:1.0");
	$xp->registerNamespace("text", "urn:oasis:names:tc:opendocument:xmlns:text:1.0");
	$rows = $xp->query('//table:table-row');
		
	$file = fopen($cachedFile, 'w');
	fwrite($file, "{\"rows\":[");
	
	foreach($rows as $row){
		fwrite($file, "[");
		$cells = $xp->query('table:table-cell', $row);
		foreach($cells as $cell){
			$p = $xp->query('text:p', $cell);
			if($p->length==0){
				$txt = "0";
				fwrite($file, "0,");
			}
			else{
				$txt = Util::conv($p->item(0)->textContent);
				$txt = preg_replace("/\\\\/i", '/', $txt);
				$txt = preg_replace('/\"/i', '\"', $txt);
				fwrite($file, strlen($txt)>0?("\"".$txt."\","):"0,");
			}
		}
		fwrite($file, "0],");
	}
	fwrite($file, "null]}");
}

echo(file_get_contents($cachedFile));
