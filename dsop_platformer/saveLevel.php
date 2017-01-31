<?php 

$content = $_POST["content"];
$userind = strpos($content, ':END:');
$user = substr($content, 0, $userind);
$content = substr($content, $userind + 5, strlen($content));
$file = $user.".csv";
$Saved_File = fopen($file, 'w');
fwrite($Saved_File, $content);
fclose($Saved_File); 

?>