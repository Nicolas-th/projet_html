<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
session_start();
require_once('config/config.php'); 

/*----------------------ACCÈS À FACEBOOK---------------------*/
require_once('config/fb_config.php'); 

/*---------------------CONNEXION AU SITE---------------------*/
if(!(isset($_SESSION["nickname"]) || isset($_SESSION["fb_id"]))){
	header('Location: index.php');
}

/*-------- SÉLÉCTION DES INFORMATION DE L'UTILISATEUR -------*/
require_once('includes/profile.inc.php');
?>
<!DOCTYPE html>
<html>
  <head>
  	<meta charset="UTF-8">
  	
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" type="text/css" href="assets/css/home.css">
    <link rel="stylesheet" type="text/css" href="assets/css/modals.css">
    
  </head>
  
  <body>
  
  <header>
  	
	  <div class="icon" id="menu"></div>
	  <div class="icon" id="profile"></div>
	  <div class="icon" id="settings"></div>
	  
  </header>
  
  <div id="bouton2"></div>
  
  <section id="popup"> <!-- début barre latérale gauche -->

	<div id="bouton"></div>

	<p>Indiquez votre trajet :</p>
	  
	<form id="formulaire_itineraire" method="post" action="#">
		<input type="text" name="lieux_depart" id="lieux_depart" autocomplete="off" placeholder="Point de départ" />
		<button id="position">Ma position</button>
		<input type="hidden" name="latitude_position" />
		<input type="hidden" name="longitude_position" />



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

	<hr>

	<div id="resultat_lieux"></div>
	  
  </section> <!-- fin barre latérale gauche -->
  
 
  
  
<div id="popup_right">
 

<?php 
if($user) { ?>
	<div class="mask"><img class="avatar" src="<?= $profile['avatar']?>" alt="Avatar de <?= $profile['name'] ?>"></div>
<?php } else { ?>
	<div class="mask"><img class="avatar" src="<?= $src_avatar.$profile['avatar']?>" alt="Avatar de <?= $profile['name'] ?>"></div>
<?php } ?>

	  
<h3><span class="prenom"><?= $profile['name']?></span> <span id="nom"><?= $profile['surname']?></span></h3>
<?php if(!$user) { ?>
<form id="changeAvatar" action="includes/edit-profile.inc.php?id=<?=$profile['id'] ?>" method="post" enctype="multipart/form-data">
    <div class="upload">
        <input type="file" name="avatar" id="avatar" value="">	
    </div>
    <input name="submit_user_avatar" type="submit" value="Enregister"/>
</form>

<hr>

<div id="edit"><p>Informations du compte</p><img src="assets/img/rouage.svg"/></div>

<form id="update_info" method="post" action="includes/edit-profile.inc.php?id=<?=$profile['id'] ?>">
		
		<p><label for="full_name">Nom</label>
		<input type="text" value="<?= $profile['surname'] ?>" name="surname" id="surname" disabled/></p>
		
		<p><label for="full_name">Prénom</label>
		<input type="text" value="<?= $profile['name'] ?>" name="name" id="name" disabled/></p>
		
		<p><label for="full_name">Pseudo</label>
		<input type="text"  name="pseudo" value="JudyMoon" disabled/> </p>
		
		<p><label for="full_name">Mail</label>
		<input type="email" value="<?= $profile['email'] ?>" name="email" id="email" disabled/> </p>
		
		<input id="save_infos" name="submit_modify_profile" type="submit" value="Enregistrer">			
					
</form>

<hr>

<div id="edit_password"><p>Modifier le mot de passe</p><img src="assets/img/rouage.svg"/></div>

<form id="hidden_password" method="post" action="includes/edit-profile.inc.php?id=<?=$profile['id'] ?>"  >

		<p><label for="full_name">Mot de passe actuel</label></p>
		<input type="password"  name="old_password" size="50" id="old_password" disabled/> 
				
		<p><label for="full_name">Nouveau mot de passe</label></p>
		</label><input type="password" name="password" size="50" id="password" disabled/> 
		
		<p><label for="full_name">Confirmez</label></p>
		<input type="password" name="confirm_password" size="50" id="confirm_password" disabled/> 
		
		<input id="save_password" name="submit_modify_password" type="submit" value="Enregistrer">
								
</form>
<?php } else { ?>
		<p> Vous ne pouvez pas modifié vos informations personnelles. Votre profil est rattaché à votre compte Facebook. </p>
<?php }  ?>


<!-- Début de la sidebar profile settings -->
<!--
	<?php 
	if($user) { ?>
			<div class="mask"><img class="avatar mask" src="<?= $profile['avatar']?>" alt="Avatar de <?= $profile['name'] ?>"></div>
	<?php } else { ?>
			<div class="mask"><img class="avatar mask" src="<?= $src_avatar.$profile['avatar']?>" alt="Avatar de <?= $profile['name'] ?>"></div>
	<?php } ?>
	
		  
	<h3><span class="prenom"><?= $profile['name']?></span> <span id="nom"><?= $profile['surname']?></span></h3>
	
	<hr>
	  
	  <p>Lieux ajoutés <?php if($count_profile_places!=0) { echo ("(".$count_profile_places.")"); }; ?></p>
	  
	   <ul>
	  	<?php if($count_profile_places==0) { ?>
		<p>Vous n'avez ajouté aucun lieu</p>
			<?php } else { 
				foreach ($select_profile_places as $select_profile_place) {
				$id_profile_place = $select_profile_place['places_id'];
				$profile_place = $dbh -> query("SELECT * FROM places WHERE id LIKE '$id_profile_place'")->fetch();
			?>	
				<li>
				 	<img src="assets/img/yellow_marker.svg" width="28" height="28"/>
				 	<label class="place"><?= $profile_place['name']?></label>	
			  	</li>
			<?php } ?>
		  
	  		<a class="edit_added_places" href="#">modifier</a>
	  	
	  		<form method="post" action="#">
	  	<input type="submit" value="enregistrer">	 
	  	</form> 	
	  </ul> 
	  <?php } ?>
	  <hr>
	  
	 <p>Itinéraires sauvegardés <?php if($count_profile_routes!=0) { echo ("(".$count_profile_routes.")"); }; ?></p>
	  
	  <ul>
		  	
	  <?php if($count_profile_routes==0) { ?>
		<p>Vous n'avez sauvegardé aucun itinéraire</p>
			<?php } else { 
				foreach ($select_profile_routes as $select_profile_route) {
					$id_profile_route = $select_profile_route['id'];
					$profile_route = $dbh -> query("SELECT * FROM routes WHERE id LIKE '$id_profile_route'")->fetch();
			?>	
					<div class="saved"></div>
					<p><?= $profile_route['position_start']?></p>
					<p><?= $profile_route['position_end']?></p>
			 <?php } ?>
	  	<a class="edit_itineraries" href="#">modifier</a>
	  	<form method="post" action="#">
	  	<input id="save_itineraries" type="submit" value="enregistrer">
	  	</form>	 
	  	
	  	<?php } ?> 
	  </ul>
	  
	  
	 <hr>
	 
	 <p>Photos que vous avez prises <?php if($count_profile_media_images!=0) { echo ("(".$count_profile_media_images.")"); }; ?></p>
	 
	 <div id="pictures">
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

		 <a href="#" id="other_pictures"></a>
	 </div>

 -->
	   
</div>  	
 

  <div id="map-canvas"></div>
  <div id="navigation-ajax"></div>
  <div class="md-overlay"></div>
  <div id="hidden"></div>

  <script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
  <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true&libraries=places&key=AIzaSyD2GbjbQbMiZrFHJN5b2L09ZenuQ8IzJUc&v=3.exp"></script>
  <script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js"></script>
  <script type="text/javascript" src="js/functions.js"></script>
  <script type="text/javascript" src="js/classes.js"></script>
  <script type="text/javascript" src="js/navigation-ajax.js"></script>
  <script type="text/javascript" src="js/itineraires.js"></script>
  <script type="text/javascript" src="js/home.js"></script>
  <script type="text/javascript" src="js/sidebar.js"></script>
  <script type="text/javascript" src="js/edit-profile.js"></script>
  <script type="text/javascript" src="js/jquery.form.js"></script>
  </body>  
</html>

