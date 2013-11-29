<?php
session_start();
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
require_once("../config/config.php");

if(isset($_SESSION['id'])){
	$idUser = intval($_SESSION['id']);

	/*-----------------------------------------------------------*/	
	/*------ MODIFICATIONS DES INFORMATION DE L'UTILISATEUR -----*/
	/*-----------------------------------------------------------*/	

	if (isset($_POST['name']) && isset($_POST['surname']) && isset($_POST['email'])) {
		$modify_name= $_POST['name'];
		$modify_surname= $_POST['surname'];
		$modify_email= $_POST['email'];
		$edit_profile = $dbh->query("UPDATE users SET 
		  	 							name = '$modify_name',
		  	 							surname = '$modify_surname',
		  	 							email = '$modify_email'
		  	 						WHERE id = '$idUser'");
		echo "successProfile";	
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
		//DOSSIER OU SERA DEPLACE L'AVATAR
		$tmp_file = $_FILES['avatar']['tmp_name'];
		if( !is_uploaded_file($tmp_file) )
		{
			echo "missingFiles";
		}

		$image =$_FILES["avatar"]["name"];
		$uploadedfile = $_FILES['avatar']['tmp_name'];
		if ($image) {
		$filename = stripslashes($_FILES['avatar']['name']);
		$extension = getExtension($filename);
		$extension = strtolower($extension);
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
				  
				  if (!file_exists("../media/avatar")) {
						mkdir ("../media/avatar", 0700);
				  }	

				  $extension = strrchr($_FILES['avatar']['name'], '.');
				  $new_name_file = "avatar_".$idUser.$extension;
				  $directory_file = "../media/avatar/avatar_".$idUser.$extension;
				  imagejpeg($tmp,$directory_file,100);
				  
				  imagedestroy($src);
				  //imagedestroy($tmp);
				  
				  $dbh->query("UPDATE users SET avatar='$new_name_file' WHERE id = '$idUser'");
				  echo "Changement de photo effectué";
				  
			  }
		   }
		}

	/*-----------------------------------------------------------*/	
	/*----- MODIFICATION DU MOT DE PASSE DE L'UTILISATEUR -------*/
	/*-----------------------------------------------------------*/	

	if (isset($_POST['old_password']) && isset($_POST['password']) && isset($_POST['confirm_password'])) {
		$profile = $dbh -> query("SELECT * FROM users WHERE id LIKE '$idUser'")->fetch();
		$modify_old_password= md5($_POST['old_password']);
		$modify_password= md5($_POST['password']);
		$modify_confirm_password= md5($_POST['confirm_password']);
		
		if ($modify_old_password == $profile['password']) {
			if ($modify_password == $modify_confirm_password) {

					$edit_password = $dbh->query("UPDATE users SET 
					  	 							password = '$modify_password'
					  	 						WHERE id = '$idUser'");
					echo "successPswd";	

			} else { echo "newPswdWrong";   }
		} else { echo "oldPswdWrong";}
	}

	/*-----------------------------------------------------------*/	
	/*---------- MODIFICATION DU PARTAGE D'ACTIVITE -------------*/
	/*-----------------------------------------------------------*/	

	if (isset($_POST['submit_social_activity'])) {

		if(isset($_POST['social_activity'])){
			$facebook_post = 1;
		}else{
			$facebook_post = 0;
		}

		$edit_password = $dbh->query("UPDATE users SET 
					  	 						facebook_post = '$facebook_post'
					  	 						WHERE id = '$idUser'");
		header('Location: /home.php');
	}




	//
}
?>