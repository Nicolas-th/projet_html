<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
require_once('config/config.php'); 

/*-----------------------------------------------------------*/	
/*---------------------CONNEXION AU SITE---------------------*/
/*-----------------------------------------------------------*/	

if (isset($_POST['submit_login'])) {
	$mail = $_POST['mail'];
	$password = md5($_POST['password']);
	
	$reqConnex = $dbh->prepare("SELECT * FROM users WHERE email = :mail AND password = :pass") 
	    or die(print_r($dbh->errorInfo()));
	    
	$reqConnex->bindValue('mail', $mail, PDO::PARAM_STR);
	$reqConnex->bindValue('pass', $password, PDO::PARAM_STR);
	$reqConnex->execute();
	$resultat = $reqConnex->fetch();
	
	if(!$resultat){
	       header('Location: index.php');
	}
	else {
	        session_start();
	        $_SESSION['id'] = $resultat['id'];
	        $_SESSION['email'] = $resultat['email'];
	        $_SESSION['first_name'] = $resultat['name'];
			$_SESSION['last_name'] = $resultat['surname'];
			header('Location: home.php');
	}
}


?>