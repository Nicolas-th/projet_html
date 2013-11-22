<?php
	session_start();
	
	include_once('../config/config.php');
	
	$user = 9;
	
	//Récupère la variable AJAX lieu et user
	$lieu = $_POST['lieu'];
	//Requête PHP pour sélectionner le nombre de like et de dislike
	$reqInsertLike = $dbh->prepare("INSERT INTO `like` VALUES('',:user,:lieu)");
		$reqInsertLike->bindValue('user',$user,PDO::PARAM_INT);
		$reqInsertLike->bindValue('lieu',$lieu,PDO::PARAM_INT);
	//Éxécution de la requête
	$reqInsertLike->execute();
	
	//Requête PHP pour compter le nombre de personnes qui ont voté qu'ils aimaient ce lieu
	$reqNbLike = $dbh->prepare("SELECT COUNT(*) FROM `like` WHERE id_lieu LIKE :id_lieu");
		$reqNbLike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
	$reqNbLike->execute();
	$resultNbLike = $reqNbLike->fetch();
	
	echo $resultNbLike[0];
?>