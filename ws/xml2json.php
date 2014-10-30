<?php 
/** 
*
*      Формирование единого JSON-документа из XML-базы, размещенной в разных файлах
*
**/

include 'util.php';

class Xml2Json{
	
	static function prepareValue($txt){
		$txt = preg_replace("/\\\\/i", '/', $txt);
		$txt = preg_replace('/\"/i', '\"', $txt);
		return Util::conv($txt);
	}

	static function writeXDoc($docFile, $outFile){
		$doc = new DOMDocument('1.0', 'UTF-8');
		$doc->load($docFile) or die('Error loading '.$docFile);
		$el = $doc->documentElement;
		self::writeXElement($outFile, $el);
	}

	static function writeXElement($outFile, $xEl){
		$type = $xEl->tagName;
		fwrite($outFile, '{"xmltype":"'.$type.'"');
		if($xEl->hasAttributes()){
			$attrs = $xEl->attributes;
			foreach($attrs as $a){
				$aNm = $a->nodeName;
				$aVal = self::prepareValue($a->nodeValue);
				fwrite($outFile, ',"'.$aNm.'":"'.$aVal.'"');
			}
		}
		if($xEl->hasChildNodes()){
			fwrite($outFile, ',"xmlchildren":[');
			$children = $xEl->childNodes;
			$firstEl = true;
			foreach($children as $chld){
				if(strlen($chld->tagName)==0) continue;
				if($firstEl) $firstEl = false; else fwrite($outFile, ',');
				self::writeXElement($outFile, $chld);
			}
			fwrite($outFile, ']');
		}
		fwrite($outFile, '}');
	}
}



