<?php	
	include_once('config.php');
	
	try{
		$dbh = new PDO('mysql:host='.$hote.';dbname='.$db, $user, $mdp);
	}
	catch(Exception $e){
		die('Erreur : '.$e->getMessage());
	}
		
	$mail = $_POST['mail'];
	$password = md5($_POST['password']);
	
	$reqConnex = $dbh->prepare("SELECT * FROM users WHERE email = :mail AND password = :pass") 
	    or die(print_r($dbh->errorInfo()));
	    
	$reqConnex->bindValue('mail', $mail, PDO::PARAM_STR);
	$reqConnex->bindValue('pass', $password, PDO::PARAM_STR);
	$reqConnex->execute();
	$resultat = $reqConnex->fetch();
	
	if(!$resultat){
		echo "ca marche pas";
	}
	else {
		session_start();
		$_SESSION['id'] = $resultat['id'];
		header('Location: pageTest.php');
	}
?>