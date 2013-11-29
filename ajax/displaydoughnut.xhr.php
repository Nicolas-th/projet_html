<?php
	require_once('../config/config.php');

	if(isset($_POST['lieu'])){

		$retour = [];

		//Récupère la variable AJAX lieu et type
		$id_lieu = $_POST['lieu'];
	
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