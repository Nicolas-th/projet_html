<?php
	session_start();
	ini_set('session.gc_maxlifetime', 3600); 
    
	include_once('config.php');
	
	
	try{
		$dbh = new PDO('mysql:host='.$hote.';dbname='.$db, $user, $mdp);
	}
	catch(Exception $e){
		die('Erreur : '.$e->getMessage());
	}
	
	$name = $_POST['nom'];
	$surname = $_POST['prenom'];
	$pseudo = $_POST['pseudo'];
	$mail = $_POST['mail'];
	$password = md5($_POST['password1']);
	$date = date('Y-m-d H:i:s');
	
	$reqMail = $dbh->prepare("SELECT email FROM users WHERE email LIKE :mail");
	$reqMail->bindValue('mail',$mail,PDO::PARAM_STR);
	$reqMail->execute();
	
	if($reqMail->fetch() == 0){
		$reqPseudo = $dbh->prepare("SELECT nickname FROM users WHERE nickname LIKE :pseudo");
		$reqPseudo->bindValue('pseudo',$pseudo,PDO::PARAM_STR);
		$reqPseudo->execute();
		
		if($reqPseudo->fetch() == 0){
			$reqInsertUser = $dbh->prepare("INSERT INTO users VALUES('','',:name,:surname,:pseudo,:mail,:password,:date,'','')");
			$reqInsertUser->bindValue('name',$name,PDO::PARAM_STR);
			$reqInsertUser->bindValue('surname',$surname,PDO::PARAM_STR);
			$reqInsertUser->bindValue('pseudo',$pseudo,PDO::PARAM_STR);
			$reqInsertUser->bindValue('mail',$mail,PDO::PARAM_STR);
			$reqInsertUser->bindValue('password',$password,PDO::PARAM_STR);
			$reqInsertUser->bindValue('date',$date,PDO::PARAM_INT);
			$reqInsertUser->execute();
			
		}
		else {
			echo "le pseudo déjà utilisé";
		}
		
	}
	else {
		echo "email déjà utilisé";

	}
?>
<h1>Inscrivez-vous</h1>



<form method="post" action="inscription.php">
	<label for="name">Nom : </label><input type="text" name="nom" id="name" /><br>
	<label for="surname">Prénom : </label><input type="text"name="prenom" id="surname" /><br>
	<label for="pseudo">*Pseudo : </label><input type="text" name="pseudo" placeholder="Pseudo" id="pseudo" required /><br>
	<label for="mail">*Mail : </label><input type="email" name="mail" id="mail" required /><br>
	<label for="pass1">*Mot de passe : </label><input type="password" name="password1" id="pass1" required /><br>
	<label for="pass2">*Retapez votre mot de passe : </label><input type="password" name="password2" id="pass2" onchange="checkpassword()" required /><br>
	<span id="passMatched"></span>
	
	<input type="submit" value="S'inscrire"/>
</form>
<script type="text/javascript">
	function checkpassword(){
		var t1=document.getElementById('passMatched').innerHTML="";
		var pass1 = document.getElementById('pass1').value;
		var pass2 = document.getElementById('pass2').value;
		
		if(pass1 == pass2){
			var t1=document.getElementById('passMatched').innerHTML="Password Match";
		}
	}
</script>