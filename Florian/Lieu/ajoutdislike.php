<?php
	include_once('config.php');
	
	try{
		//Connexion à la BDD en PDO
		$connexion = new PDO('mysql:host='.$hote.';dbname='.$db, $user, $mdp);
		//Récupère la variable AJAX lieu et user
		$lieu = $_POST['lieu'];
		$user = $_POST['user'];
		//Requête PHP pour sélectionner le nombre de like et de dislike
		$reqInsertLike = $connexion->prepare("INSERT INTO `dislike` VALUES('',:user,:lieu)");
			$reqInsertLike->bindValue('user',$user,PDO::PARAM_INT);
			$reqInsertLike->bindValue('lieu',$lieu,PDO::PARAM_INT);
		//Éxécution de la requête
		$reqInsertLike->execute();
	}
	catch(Exception $e){
		var_dump($e);
		die('Erreur : '.$e->getMessage());
	}
?>