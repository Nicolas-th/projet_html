<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
require_once('config/config.php'); 
//$idUser = $_GET['id'];

/*-----------------------------------------------------------*/	
/*------ MODIFICATIONS DES INFORMATION DE L'UTILISATEUR -----*/
/*-----------------------------------------------------------*/	

if (isset($_POST['name']) && isset($_POST['surname']) && isset($_POST['email'])) {
	$idUser = $_GET['id'];
	$modify_name= $_POST['name'];
	$modify_surname= $_POST['surname'];
	$modify_email= $_POST['email'];
	$edit_profile = $dbh->query("UPDATE users SET 
	  	 							name = '$modify_name',
	  	 							surname = '$modify_surname',
	  	 							email = '$modify_email'
	  	 						WHERE id = '$idUser'");
	echo ($success_edit_profil = "Vos informations ont bien été enregistrées");	
}


/*-----------------------------------------------------------*/	
/*-------- MODIFICATION DE L'AVATAR DE L'UTILISATEUR --------*/
/*-----------------------------------------------------------*/	

function getExtension($str) {
	 $i = strrpos($str,".");
	 if (!$i) { return ""; } 
	 $l = strlen($str) - $i;
	 $ext = substr($str,$i+1,$l);
	 return $ext;
}

if (isset($_FILES["avatar"]) != "") {
	$idUser = $_GET['id'];	
	//DOSSIER OU SERA DEPLACE L'AVATAR
	$tmp_file = $_FILES['avatar']['tmp_name'];
	if( !is_uploaded_file($tmp_file) )
	{
		$error_avatar_find_modify = "Le fichier n'a pas été trouvé";
	}

	$image =$_FILES["avatar"]["name"];
	$uploadedfile = $_FILES['avatar']['tmp_name'];
	if ($image) {
	$filename = stripslashes($_FILES['avatar']['name']);
	$extension = getExtension($filename);
	$extension = strtolower($extension);
	var_dump($image);
		  if (($extension != "jpg") && ($extension != "jpeg") && ($extension != "png") && ($extension != "gif")) {
			  echo ' Unknown Image extension ';
			  $errors=1;
		  } else {
			  if($extension=="jpg" || $extension=="jpeg" ){
				  $uploadedfile = $_FILES['avatar']['tmp_name'];
				  $src = imagecreatefromjpeg($uploadedfile);
			  } else if($extension=="png"){
				  $uploadedfile = $_FILES['avatar']['tmp_name'];
				  $src = imagecreatefrompng($uploadedfile);
			  } else {
				  $src = imagecreatefromgif($uploadedfile);
			  }
	
			  list($width,$height)=getimagesize($uploadedfile);

			  $newwidth=100;
			  $newheight=($height/$width)*$newwidth;
			  $tmp=imagecreatetruecolor($newwidth,$newheight);
			 
			  
			  imagecopyresampled($tmp,$src,0,0,0,0,$newwidth,$newheight,$width,$height);
			  
			  if (!file_exists("media/avatar")) {
					mkdir ("media/avatar", 0700);
			  }	

			  $extension = strrchr($_FILES['avatar']['name'], '.');
			  $new_name_file = "avatar_".$idUser.$extension;
			  $directory_file = "media/avatar/avatar_".$idUser.$extension;
			  imagejpeg($tmp,$directory_file,100);
			  
			  imagedestroy($src);
			  //imagedestroy($tmp);
			  
			  $dbh->query("UPDATE users SET avatar='$new_name_file' WHERE id = '$idUser'");
			  echo $success_avatar_upload_modify = "Votre photo de profil a été modifiée";
			  
		  }
	   }
	}

/*-----------------------------------------------------------*/	
/*----- MODIFICATION DU MOT DE PASSE DE L'UTILISATEUR -------*/
/*-----------------------------------------------------------*/	

if (isset($_POST['old_password']) && isset($_POST['password']) && isset($_POST['confirm_password'])) {
	$idUser = $_GET['id'];
	$profile = $dbh -> query("SELECT * FROM users WHERE id LIKE '$idUser'")->fetch();
	$modify_old_password= md5($_POST['old_password']);
	echo $modify_password= md5($_POST['password']);
	$modify_confirm_password= md5($_POST['confirm_password']);
	
	if ($modify_old_password == $profile['password']) {
		if ($modify_password == $modify_confirm_password) {

				$edit_password = $dbh->query("UPDATE users SET 
				  	 							password = '$modify_password'
				  	 						WHERE id = '$idUser'");
				var_dump($edit_password);
				echo ($success_edit_profil = "Vos informations ont bien été enregistrées");	

		} else { echo "Les 2 mots de passe ne corresponde pas";   }
	} else { echo "Le mot de passe actuel n'est pas correct";}
}


?>