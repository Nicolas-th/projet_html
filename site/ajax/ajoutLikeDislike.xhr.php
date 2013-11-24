<?php
	session_start();
	include_once('../config/config.php');
	$user = 9;

	if(isset($_POST['lieu']) && isset($_POST['type'])){

		$retour = [];

		//Récupère la variable AJAX lieu et type
		$id_lieu = $_POST['lieu'];
		//Requête PHP pour sélectionner le nombre de like et de dislike
		if($_POST['type']=='like'){
			$reqInsertLike = $dbh->prepare("INSERT INTO `like` VALUES ('',:user,:lieu)");
		}else{
			$reqInsertLike = $dbh->prepare("INSERT INTO `dislike` VALUES ('',:user,:lieu)");
		}
		$reqInsertLike->bindValue('user',$user,PDO::PARAM_INT);
		$reqInsertLike->bindValue('lieu',$id_lieu,PDO::PARAM_INT);
		//Éxécution de la requête
		$reqInsertLike->execute();
		
		//Requête PHP pour compter le nombre de personnes qui ont voté qu'ils aimaient ce lieu
		$reqNbLike = $dbh->prepare("SELECT (SELECT COUNT(`like`.id_like) FROM `like` WHERE id_lieu=:id_lieu) AS likes, (SELECT COUNT(`dislike`.id_dislike) FROM `dislike` WHERE id_lieu=:id_lieu) AS dislikes");
		$reqNbLike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
		$reqNbLike->execute();
		$resultats=$reqNbLike->fetch(PDO::FETCH_ASSOC);
		$retour['likes'] = $resultats['likes'];
		$retour['dislikes'] = $resultats['dislikes'];
		
		echo json_encode($retour);
	}
?>