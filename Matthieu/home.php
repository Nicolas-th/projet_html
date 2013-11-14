<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
include 'config/config.php'; 
session_start();

/*----------------------ACCÈS À FACEBOOK---------------------*/
include 'config/fb_config.php'; 

/*---------------------CONNEXION AU SITE---------------------*/
if($_SESSION["email"]==NULL && $_SESSION["fb_id"]==NULL ){
		header('Location: index.php');
}

/*-------- SÉLÉCTION DES INFORMATION DE L'UTILISATEUR -------*/
include('profile.php');
	
/*----- MODIFICATIONS DES INFORMATION DE L'UTILISATEUR -----*/
include('edit-profile.php');



?>
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>FindItOut</title>
</head>

<body>
<header>
	<div id="logo"></div>
	<a href="logout.php">Logout</a>
	<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="assets/js/edit-profile.js"></script>
	<script src="assets/js/jquery.form.js"></script>
</header>

<div id="sidebar_profile">
	<?php 
	if($user) { ?>
		<img src="<?= $profile['avatar']?>" class="avatar" alt="Avatar de <?= $profile['name'] ?>">
	<?php } else { ?>
		<img src="<?= $src_avatar.$profile['avatar']?>" class="avatar" alt="Avatar de <?= $profile['name'] ?>">
	<?php } ?>
	<p><?= $profile['name'].' '.$profile['surname']?></p>
	<h3>Lieux ajoutés <?php if($count_profile_places!=0) { echo ("(".$count_profile_places.")"); }; ?></h3>
	<?php if($count_profile_places==0) { ?>
		<p>Vous n'avez ajouté aucun lieu</p>
	<?php } else { 
				foreach ($select_profile_places as $select_profile_place) {
				$id_profile_place = $select_profile_place['id'];
				$profile_place = $dbh -> query("SELECT * FROM places WHERE id LIKE '$id_profile_place'")->fetchAll();
	?>	
					<p><?= $profile_place['name']?></p>
		  <?php } ?>
	<?php } ?>
	
	<h3>Itinéraires sauvegardés <?php if($count_profile_routes!=0) { echo ("(".$count_profile_routes.")"); }; ?></h3>
	<?php if($count_profile_routes==0) { ?>
		<p>Vous n'avez sauvegardé aucun itinéraire</p>
	<?php } else { 
				foreach ($select_profile_routes as $select_profile_route) {
				$id_profile_route = $select_profile_route['id'];
				$profile_route = $dbh -> query("SELECT * FROM routes WHERE id LIKE '$id_profile_routes'")->fetchAll();
	?>	
					<p><?= $profile_route['name']?></p>
		  <?php } ?>
	<?php } ?>
	
	<h3>Photos que vous avez prises <?php if($count_profile_media_images!=0) { echo ("(".$count_profile_media_images.")"); }; ?></h3>
	<?php if($count_profile_media_images==0) { ?>
		<p>Vous n'avez pris aucune photo</p>
	<?php } else { 
				foreach ($profile_media_image as $profile_media_image) {
					$profile_media_image_id=$profile_media_image['id'];
					$src_place = $dbh -> query("SELECT places_id FROM media WHERE id LIKE '$profile_media_image_id'")->fetch(0);
	?>	
					<img src="<?= $src_media.$src_place['places_id']."/".$profile_media_image['url_file']?>"</p>
		  <?php } ?>
	<?php } ?>
	
</div>
<br>
<br>
<br>
<br>
<br>

<div id="sidebar_edit-profile">
	<?php 
	if($user) { ?>
		<img class="avatar" src="<?= $profile['avatar']?>" alt="Avatar de <?= $profile['name'] ?>">
	<?php } else { ?>
		<img class="avatar" src="<?= $src_avatar.$profile['avatar']?>" alt="Avatar de <?= $profile['name'] ?>">
	<?php } ?>
	<p><?= $profile['name'].' '.$profile['surname']?></p>
	
	
	<h3>Informations du compte</h3>
	<?php if(!$user) { ?>
	<div id="changeAvatar">
		<form method="post" action="edit-profile.php?id=<?=$profile['id'] ?>" enctype='multipart/form-data'>
				<label for="name">Photo de profil : </label><input type="file" name="avatar" id="avatar" value=""><br>
				<input name="submit_user_avatar" type="submit" value="Enregister"/>	
		</form>
		<div class="conteneur_progress_bar">
				<div class="progress_bar"></div>
				<div class="progress_value">0%</div >
		</div>
	</div>
	<form method="post" action="edit-profile.php?id=<?=$profile['id'] ?>" id="editProfile">
	        <label for="surname">Nom : </label><input type="text" value="<?= $profile['surname'] ?>" name="surname" id="surname" /><br>
	        <label for="name">Prénom : </label><input type="text" value="<?= $profile['name'] ?>" name="name" id="name" /><br>
	        <label for="email">Email : </label><input type="email" value="<?= $profile['email'] ?>" name="email" id="email" required /><br>
	        
	         <input name="submit_modify_profile" type="submit" value="Enregister"/>
	</form>
	<br>
	<h3>Modifier son mot de passe</h3>
	<form method="post" action="edit-profile.php">
			<label for="pass1"></label><input type="password"  name="old_password" size="50" id="old_password" required placeholder="Ancien mot de passe" /><br>
	        <label for="pass1"></label><input type="password" name="password" size="50" id="password" required placeholder="Nouveau mot de passe" /><br>
	        <label for="pass2"></label><input type="password" name="confirm_password" size="50" id="confirm_password" required placeholder="Confirmer le nouveau mot de passe"  /><br>
	        
	        <input name="submit_modify_password" type="submit" value="Enregistrer"/>
	</form>
	<?php } else { ?>
		<p> Vous ne pouvez pas modifié vos informations personnelles. Votre profil est rattaché à votre compte Facebook. </p>
	<?php }  ?>
</div>
<script type="text/javascript">

</script>
</body>
</html>
       