<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
session_start();
require_once('config/config.php'); 

/*----------------------ACCÈS À FACEBOOK---------------------*/
require_once('config/fb_config.php'); 

/*---------------------CONNEXION AU SITE---------------------*/
if($_SESSION["email"]==NULL && $_SESSION["fb_id"]==NULL ){
	header('Location: index.php');
}

/*-------- SÉLÉCTION DES INFORMATION DE L'UTILISATEUR -------*/
require_once('includes/profile.inc.php');
	
/*----- MODIFICATIONS DES INFORMATION DE L'UTILISATEUR -----*/
require_once('includes/edit-profile.inc.php');


/*
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
				$id_profile_place = $select_profile_place['places_id'];
				$profile_place = $dbh -> query("SELECT * FROM places WHERE id LIKE '$id_profile_place'")->fetch();
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
				$profile_route = $dbh -> query("SELECT * FROM routes WHERE id LIKE '$id_profile_route'")->fetch();
	?>	
					<p><?= $profile_route['id']?></p>
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

*/ ?>

<!DOCTYPE html>
<html>
  <head>
  	<meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    
    <link rel="stylesheet" type="text/css" href="assets/css/home.css">
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true&libraries=places&key=AIzaSyD2GbjbQbMiZrFHJN5b2L09ZenuQ8IzJUc&v=3.exp"></script>
	<script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js"></script>
	<script src="assets/js/functions.js"></script>
	<script src="assets/js/classes.js"></script>
	<script src="assets/js/itineraires.js"></script>
	<script src="assets/js/home.js"></script>
  </head>
  
<body>
  
  <header>
	  <div class="icon" id="menu"></div>
	  <div class="icon" id="profile"></div>
	  <div class="icon" id="settings"></div>
  </header>
  
  <div id="bouton2"></div>
  
  <div id="popup"> <!-- début barre latérale gauche -->
	  <div id="bouton"></div>
	  
	  <p>Indiquez votre trajet :</p>
	  
	<form id="formulaire_itineraire">
	    <input type="text" name="lieux_depart" id="lieux_depart" autocomplete="off" placeholder="Point de départ"/>
	    <input type="hidden" name="latitude_position" />
	    <input type="hidden" name="longitude_position" />
	    
	    <button id="position">Ma position</button>
	    
	    <input type="hidden" name="ref_lieux_depart" id="ref_lieux_depart" class="ref_lieu" />
	    <ul id="resultats_lieux_depart"></ul>
	    <input type="text" name="lieux_arrive" id="lieux_arrive"  autocomplete="off" placeholder="Lieu de destination"/>
	    <input type="hidden" name="ref_lieux_arrive" id="ref_lieux_arrive" class="ref_lieu"/>
    
	    <ul id="resultats_lieux_arrive"></ul>
	    <div class="choix_transport">
		    <a href="#" id="marche" class="actif">A pied</a>
		    <a href="#" id="velo">En vélo</a>
		    <a href="#" id="metro">En métro</a>
		</div>
		
		<input type="submit" value="Rechercher"/>
		
   </form>
  
	  
  </div> <!-- fin barre latérale gauche -->
  
  
    <div id="popup_right">
	  <div id="bouton_right"></div>
	  
	  <p><img src="assets/img/avatar.png"/></p>
	  
	  <h3>Manon Baudemont</h3>
  
	  <hr>
	  
	  <p>2 lieux ajoutés</p>
	  
	   <ul>
	  	<li>
		 	<img src="assets/img/yellow_marker.svg" width="30" height="30"/>
		 	<label id="place">Nom du lieu</label>	
	  	</li>
	  	
	  	<li>
		 	<img src="assets/img/yellow_marker.svg" width="30" height="30"/>
		 	<label class="place">Nom du lieu</label>
	  	</li>
	  	<form method="post" action="#">
	  	<input type="submit" value="modifier">	 
	  	</form> 	
	  </ul> 
	  
	  <hr>
	  
	  <p>2 itinéraires ajoutés</p>
	  
	  <ul>
	  	<li class="itinerary">
		  	<div></div>
			<p>Lieu de départ</p> 
			<p>Lieu d'arrivée</p> 	
	  	</li>
	  	
	  	<li class="itinerary">
	  		
		  	<div></div>
			<p>Lieu de départ</p> 
			<p>Lieu d'arrivée</p> 	
	  	</li>
	  	<form method="post" action="#">
	  	<input type="submit" value="modifier">
	  	</form>	  
	  </ul>
	  
	  
	 <hr>
	 
	 <p>Photos prises par <span>Manon</span></p>
	 
	 <div class="pictures"><img src="assets/img/picture.png"/></div>
	 <div class="pictures"><img src="assets/img/picture.png"/></div>
	 <div class="pictures"><img src="assets/img/picture.png"/></div>
	 <div class="pictures"><img src="assets/img/picture.png"/></div>
	 
	 <a href="#" id="other_pictures"></a>
	 
	 <input type="file">




	 
	  
	  
	  
  </div> <!-- Fin div profil -->
  
  

  <div id="map-canvas"></div>
  <div id="hidden"></div>

  
  <script type="text/javascript">
  
  $("#bouton2").css("display","none");
  
  $("#profile,#settings").click(function(){
  	  $("#popup_right").animate({
	  right:"0"
	  },400);
	  
	  $("#bouton2").css("display","block");	
	  
	  $("#popup").animate({
	  left:"-280px"
	  },400); 
	  
  });
  
  $("#bouton_right").click(function(){
	  $("#popup_right").animate({
	  right:"-280px"
	  },400);
  });
  
  $("#bouton").click(function(){
  	  $("#popup").animate({
  	  left:"-280px"
  	  },400);
 
  $("#bouton2").css("display","block");	   
      
  });
  
  $("#bouton2").click(function(){
	  $("#popup").animate({
	  left:"0px"
	  },400);
	  
	  $("#popup_right").animate({
	  right:"-280px"
	  },400);
	 
  $("#bouton2").css("display","none");
  });
  
  
  
  
 
  </script>
  
 
    
  </body>
</html>

