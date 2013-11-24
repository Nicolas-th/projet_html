<?php
	session_start();
	
	include_once('../config/config.php');
	include_once('../includes/functions.inc.php');
	
	if(isset($_POST['message']) && isset($_POST['lieu']) && isset($_SESSION['id'])){

		$id_user = $_SESSION['id'];

		$id_lieu = intval($_POST['lieu']);
		$message = strip_tags($_POST['message']);
		$valid = 0;
	
		$reqComment = $dbh->prepare("INSERT INTO comments (content,date_comment,valid,users_id,places_id) VALUES(:message,:time,:valid,:id_user,:id_lieu)");
		$reqComment->bindValue('message',$message,PDO::PARAM_STR);
		$reqComment->bindValue('time',time(),PDO::PARAM_INT);
		$reqComment->bindValue('valid',$valid,PDO::PARAM_INT);
		$reqComment->bindValue('id_user',$id_user,PDO::PARAM_INT);
		$reqComment->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
		$reqComment->execute();
		$last_id = $dbh->lastInsertId();

		$reqDisplay = $dbh->prepare("SELECT comments.*, users.nickname, users.avatar FROM comments LEFT JOIN users ON comments.users_id = users.id WHERE comments.id=:id_comment");
		$reqDisplay->bindValue('id_comment',$last_id,PDO::PARAM_INT);
		$reqDisplay->execute();
		
		$result = $reqDisplay->fetch();

		echo(structureCommentaire($result));
	}
?>