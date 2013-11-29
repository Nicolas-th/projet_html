<?php
	
	session_start();

	$retour = array();
	$retour['code'] = 0;
	$retour['infos'] = array();
	
	if(isset($_SESSION['id']) && isset($_POST['lieux']) && isset($_POST['depart']) && isset($_POST['arrivee']) && isset($_POST['name'])){
		require_once('../config/config.php');
		require_once('../classes/sql.class.php');
		require_once('../includes/functions.inc.php');

		$user_id = $_SESSION['id'];
		$name = $_POST['name'];
		$places = $_POST['lieux'];
		$depart = $_POST['depart'];
		$arrivee = $_POST['arrivee'];
		$date_creation = time();

		$sql = new SQL($dbh);
		$sql->prepare('INSERT INTO routes (name, date_creation, position_start, position_end, places, user_id) VALUES (:name, :date_creation, :position_start, :position_end, :places, :user_id)');
		$sql->bindValue('date_creation',$date_creation,PDO::PARAM_INT);
		$sql->bindValue('position_start',$depart,PDO::PARAM_STR);
		$sql->bindValue('position_end',$arrivee,PDO::PARAM_STR);
		$sql->bindValue('places',$places,PDO::PARAM_STR);
		$sql->bindValue('user_id',$user_id,PDO::PARAM_INT);
		$sql->bindValue('name',strip_tags($name),PDO::PARAM_STR);

		$sql->execute();

		$last_id = $sql->lastInsertId();

		if($last_id!=false){
			$retour['infos']['id'] = intval($last_id);
			$retour['code'] = 200;
		}else{
			$retour['code'] = 500;
		}
		
	}else if(!isset($_SESSION['id'])){
		$retour['code'] = 403;
	}

	echo(json_encode($retour));


?>