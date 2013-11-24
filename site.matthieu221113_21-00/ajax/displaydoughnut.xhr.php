<?php
	require_once('../config/config.php');
	
	//Récupère la variable AJAX;
	$lieu = $_POST['lieu'];
	//Requête PHP pour sélectionner le nombre de like et de dislike
	$reqLike = $dbh->prepare("SELECT COUNT(*) FROM `like` WHERE id_lieu LIKE :lieu");
		$reqLike->bindValue('lieu',$lieu,PDO::PARAM_INT);
	$reqDislike = $dbh->prepare("SELECT COUNT(*) FROM `dislike` WHERE id_lieu LIKE :lieu");
		$reqDislike->bindValue('lieu',$lieu,PDO::PARAM_INT);
	//Éxécution de la requête
	$reqLike->execute();
	$reqDislike->execute();
	//Récupération de la la requête dans la variable $nblike
	$nbLike = $reqLike->fetch();
	$nbDislike = $reqDislike->fetch();
	echo $nbLike[0];
	echo '-';
	echo $nbDislike[0];
?>