<?php
	require_once('../config.php');
	
	$id_lieu = $_POST['id_lieu'];
	$id_user = $_POST['id_user'];
	$message = $_POST['message'];
	$valid = 1;
	
	$reqComment = $dbh->prepare("INSERT INTO comments VALUES('',:message,NOW(),:valid,:id_user,:id_lieu)");
		$reqComment->bindValue('message',$message,PDO::PARAM_STR);
		$reqComment->bindValue('valid',$valid,PDO::PARAM_INT);
		$reqComment->bindValue('id_user',$id_user,PDO::PARAM_INT);
		$reqComment->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
	$reqComment->execute();
	echo('message : ' . $message);
	echo('id_lieu : ' . $id_lieu);
	echo('id_user : ' . $id_user);
	var_dump($reqComment);
	header("Location: ".$_SERVER["HTTP_REFERER"]);
?>