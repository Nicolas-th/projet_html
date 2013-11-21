<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
require_once('config/config.php'); 

/*-----------------------------------------------------------*/	
/*---------------------CONNEXION AU SITE---------------------*/
/*-----------------------------------------------------------*/	

if (isset($_POST['nickname']) && isset($_POST['password'])) {
	$nickname = $_POST['nickname'];
	$password = md5($_POST['password']);
	
	$reqConnex = $dbh->prepare("SELECT * FROM users WHERE nickname = :nickname AND password = :pass") 
	    or die(print_r($dbh->errorInfo()));
	    
	$reqConnex->bindValue('nickname', $nickname, PDO::PARAM_STR);
	$reqConnex->bindValue('pass', $password, PDO::PARAM_STR);
	$reqConnex->execute();
	$resultat = $reqConnex->fetch();
	if(!$resultat){
	       echo "error";
	}
	else {
	        session_start();
	        $_SESSION['id'] = $resultat['id'];
	        $_SESSION['nickname'] = $resultat['nickname'];
	        $_SESSION['first_name'] = $resultat['name'];
			$_SESSION['last_name'] = $resultat['surname'];
			echo "success";
	}
}

?>