<?php
	
	session_start();
	
	if(isset($_SESSION['id']) && isset($_POST['lieux']) && isset($_POST['depart']) && isset($_POST['arrivee'])){
		require_once('../includes/config.inc.php');
		require_once('../classes/sql.class.php');
		require_once('../includes/functions.inc.php');

		$user_id = $_SESSION['id'];
		$places = $_POST['lieux'];
		$depart = $_POST['depart'];
		$arrivee = $_POST['arrivee'];
		$date_creation = time();

		$sql = new SQL();
		$sql->prepare('INSERT INTO routes (date_creation, position_start, position_end, places, user_id) VALUES (:date_creation, :position_start, :position_end, :places, :user_id)');
		$sql->bindValue('date_creation',$date_creation,PDO::PARAM_INT);
		$sql->bindValue('position_start',$depart,PDO::PARAM_STR);
		$sql->bindValue('position_end',$arrivee,PDO::PARAM_STR);
		$sql->bindValue('places',$places,PDO::PARAM_STR);
		$sql->bindValue('user_id',$user_id,PDO::PARAM_INT);

		$sql->execute();
		
	}else if(!isset($_SESSION['id'])){
		echo('connexion');
	}


?>