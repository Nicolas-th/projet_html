<?php
	include_once('config.php');
			
	try{
		//Connexion à la BDD en PDO
		$connexion = new PDO('mysql:host='.$hote.';dbname='.$db, $user, $mdp);
		//Récupère la variable AJAX;
		$lieu = $_POST['lieu'];
		//Requête PHP pour sélectionner le nombre de like et de dislike
		$reqLike = $connexion->prepare("SELECT COUNT(*) FROM `like` WHERE id_lieu=$lieu");
		$reqDislike = $connexion->prepare("SELECT COUNT(*) FROM `dislike` WHERE id_lieu=$lieu");
		//Éxécution de la requête
		$reqLike->execute();
		$reqDislike->execute();
		//Récupération de la la requête dans la variable $nblike
		$nbLike = $reqLike->fetch();
		$nbDislike = $reqDislike->fetch();
		echo $nbLike[0];
		echo $nbDislike[0];
	}
	
	catch(Exception $e){
		die('Erreur : '.$e->getMessage());
	}
?>