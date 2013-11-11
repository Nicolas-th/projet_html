<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
require 'config/config.php'; 
$idUser = $_GET['id'];

/*-----------------------------------------------------------*/	
/*------ MODIFICATIONS DES INFORMATION DE L'UTILISATEUR -----*/
/*-----------------------------------------------------------*/	

if (isset($_POST['submit_modify_profile'])) {
	$modify_name= $_POST['name'];
	$modify_surname= $_POST['surname'];
	$modify_email= $_POST['email'];
	$edit_profile = $dbh->query("UPDATE users SET 
	  	 							name = '$modify_name',
	  	 							surname = '$modify_surname',
	  	 							email = '$modify_email'
	  	 						WHERE id = '$idUser'");
	var_dump($edit_profile);
	echo ($success_edit_profil = "Vos informations ont bien été enregistrées");	
}


/*-----------------------------------------------------------*/	
/*-------- MODIFICATION DE L'AVATAR DE L'UTILISATEUR --------*/
/*-----------------------------------------------------------*/	

if( isset($_POST['submit_user_avatar']) ) 
		{				
		//DOSSIER OU SERA DEPLACE L'AVATAR
		$avatar_dir = "media/avatar/" ; 
		$tmp_file = $_FILES['avatar']['tmp_name'];
		if( !is_uploaded_file($tmp_file) )
		{
			$error_avatar_find_modify = "Le fichier n'a pas été trouvé";
		}
		//VERIFICATION DES EXTENTIONS
		$type_file = $_FILES['avatar']['type'];
		if( !strstr($type_file, 'jpg') && !strstr($type_file, 'jpeg') && !strstr($type_file, 'bmp') && !strstr($type_file, 'gif') && !strstr($type_file, 'png') && !strstr($type_file, 'JPG') && !strstr($type_file, 'JPEG') && !strstr($type_file, 'BMP')  && !strstr($type_file, 'GIF')  && !strstr($type_file, 'PNG') )
		{
			$error_avatar_extentions_modify = "Le fichier n'est pas une image";
		} else {
			//COPIE DU FICHIER DANS LE REPERTOIRE 
			$name_file = $_FILES['avatar']['name'];
			$new_name_file = "avatar_".$idUser;
			if( !move_uploaded_file($tmp_file, $avatar_dir . $new_name_file) )
			{
				$error_avatar_upload_modify = "Impossible de copier ce fichier";
			} else {
				$avatar_modify = "media/avatar/".$new_name_file;
				$dbh->query("UPDATE users SET avatar='$avatar_modify' WHERE id = '$idUser'");	
				$success_avatar_upload_modify = "Votre photo de profil a été modifiée";
			}
		}
	}	  	 						
	


/*-----------------------------------------------------------*/	
/*----- MODIFICATION DU MOT DE PASSE DE L'UTILISATEUR -------*/
/*-----------------------------------------------------------*/	

?>