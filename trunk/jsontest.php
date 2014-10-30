<?php
$src = "{\"x\":\"xxxx\",\"y\":25}";
echo("<p>Source JSON: ".$src."</p>");
$var = json_decode($src);

echo("<p>Object: ");
print_r($var);
echo("<p>");

$var->x = "zzz";


echo("<p>Modified JSON: ".json_encode($var)."</p>");