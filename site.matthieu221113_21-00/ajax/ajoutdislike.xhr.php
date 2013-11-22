<?php
	include_once('../config/config.php');
	
	$user = 9;
	
	//Récupère la variable AJAX lieu et user
	$lieu = $_POST['lieu'];
	//Requête PHP pour sélectionner le nombre de like et de dislike
	$reqInsertLike = $dbh->prepare("INSERT INTO `dislike` VALUES('',:user,:lieu)");
		$reqInsertLike->bindValue('user',$user,PDO::PARAM_INT);
		$reqInsertLike->bindValue('lieu',$lieu,PDO::PARAM_INT);
	//Éxécution de la requête
	$reqInsertLike->execute();
	
	//Requête PHP pour compter le nombre de personnes qui ont voté qu'ils n'aimaient pas ce lieu
	$reqNbDislike = $dbh->prepare("SELECT COUNT(*) FROM `dislike` WHERE id_lieu LIKE :id_lieu");
		$reqNbDislike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
	$reqNbDislike->execute();
	$resultNbDislike = $reqNbDislike->fetch();
	
	echo $resultNbDislike[0];
?>