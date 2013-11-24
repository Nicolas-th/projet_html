<?php
	require_once('../config.php');
	
	$id = $_GET['id'];
	
	$reqSignalComment = $dbh->prepare("UPDATE comments SET valid = 0 WHERE id LIKE :id");
		$reqSignalComment->bindValue('id',$id,PDO::PARAM_INT);
	$reqSignalComment->execute();
	
	header("Location: ".$_SERVER["HTTP_REFERER"]);
?>