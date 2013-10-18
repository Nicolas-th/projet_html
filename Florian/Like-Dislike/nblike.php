<?php
	$hote = "localhost";
	$user = "root";
	$mdp = "root";
	$db = "like";
			
	try{
		$connexion = new PDO('mysql:host='.$hote.';dbname='.$db, $user, $mdp);
		$req = $connexion->prepare("SELECT COUNT(*) FROM `like`");
		$req->execute();
		$nblike = $req->fetch();
		$test = $_POST['test'];
		echo $nblike[0].$test;
	}
	catch(Exception $e){
		echo(false);
		die('Erreur : '.$e->getMessage());
	}
			
	
?>
			