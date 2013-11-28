<?php
/*-----------------------------------------------------------*/	
/*------------------ INSCRIPTION AU SITE  -------------------*/
/*-----------------------------------------------------------*/	



require_once('config/config.php');

if (isset($_POST['mail'])) {
    $name = $_POST['nom'];
    $surname = $_POST['prenom'];
    $pseudo = $_POST['pseudo'];
    $email = $_POST['mail'];
    $password = md5($_POST['password1']);
    $password2 = md5($_POST['password2']);
    $avatar = "default/avatar_default.jpg";
    
    if($password == $password2){
    $reqMail = $dbh->prepare("SELECT email FROM users WHERE email ='$email'");
    //$reqMail->bindValue('mail',$mail,PDO::PARAM_INT);
    $reqMail->execute();
	    if($reqMail->fetch() == 0){
	        $reqPseudo = $dbh->prepare("SELECT nickname FROM users WHERE nickname ='$pseudo'");
	        //$reqMail->bindValue('mail',$mail,PDO::PARAM_INT);
	        $reqPseudo->execute();
	        
	        if($reqPseudo->fetch() == 0){
	                $reqInsertUser = $dbh->prepare("INSERT INTO users VALUES('','$avatar','$name','$surname','$pseudo','','$email','$password', NOW(),'','','','')");
	                $reqInsertUser->execute();
	                $id= $dbh->lastInsertId();
					$reqUser = $dbh->query("SELECT * FROM users WHERE id ='$id'")->fetch();
	                session_start();
					ini_set('session.gc_maxlifetime', 3600); 
					$_SESSION['id'] = $reqUser['id'];
					$_SESSION['nickname'] = $reqUser['nickname'];
					$_SESSION['first_name'] = $reqUser['name'];
					$_SESSION['last_name'] = $reqUser['surname'];
	                echo "success";
	        } else {
	                echo "userExist";
	        }  
	    } else {
	    	echo "emailExist";
	    }
	} else {
		echo "errorPassword"; 
	}
}
?>