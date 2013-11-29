		<?php
		/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
		session_start();
		require_once('config/config.php'); 

		/*----------------------ACCÈS À FACEBOOK---------------------*/
		require_once('config/fb_config.php'); 

		/*-------- SÉLÉCTION DES INFORMATION DE L'UTILISATEUR -------*/
		require_once('includes/profile.inc.php');


		/*-------- SÉLÉCTION DES INFORMATION DE L'UTILISATEUR -------*/
		require_once('includes/functions.inc.php');

		/*-------- DETECTION DES MOBILES -------*/
		require_once('classes/Mobile_Detect.class.php');

		$detectMobile = new Mobile_Detect();

		if(isset($itineraire_charge) && is_array($itineraire_charge) && count($itineraire_charge)>0){
			$itineraire['position_start'] =  json_decode($itineraire_charge[0]['position_start'],true);
			$itineraire['position_end'] =  json_decode($itineraire_charge[0]['position_end'],true);
			$itineraire['lieux'] =  json_decode($itineraire_charge[0]['places'],true);
		}


		function getPlaces($str) {
				$clean = explode(",",$str);
				
				$clean[0] = preg_replace("/[^0-9\/_|+ .-]/", '', $clean[0]);
				$clean[0] = strtolower(trim($clean[0], '-'));
				$clean[0] = preg_replace("/[\/_|+ -]+/", '-', $clean[0]);
				
				$clean[1] = preg_replace("/[^0-9\/_|+ .-]/", '', $clean[1]);
				$clean[1] = strtolower(trim($clean[1], '-'));
				$clean[1] = preg_replace("/[\/_|+ -]+/", '-', $clean[1]);
			
				return $tableau = array($clean[0], $clean[1]);
		}
		?>
		<!DOCTYPE html>
		<html>
		  <head>
		  	<meta charset="UTF-8">

		  	<title>Find It Out - Redéfinissez le must-see.</title>
		  	
		    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		   
		    <link rel="stylesheet" type="text/css" href="assets/css/global.css">
		    <link rel="stylesheet" type="text/css" href="assets/css/home.css">
		    <link rel="stylesheet" type="text/css" href="assets/css/modals.css">
		    <link rel="icon" type="image/png" href="assets/img/favicon.ico" />
				<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
				<link rel="apple-touch-icon" sizes="72x72" href="assets/img/apple-touch-72.png">
				<link rel="apple-touch-icon" sizes="114x114" href="assets/img/apple-touch-114.png">
		    
		  </head>
		  
		  <body>
		  
		  <header>
		  
		  	<img src="assets/img/logo_home.png" width="100" height="30"/>

		  	<?php if(isset($_SESSION["id"])){ ?>
				<a href="logout.php"><div class="icon"></div></a>
				<div class="icon"></div>
				<div class="icon"></div>
				<?php if($detectMobile->isMobile()){ ?>
					 <a id="create_place" href="create-place.php"></a>
				<?php } ?>
			<?php }else{ ?>
				<a href="index.php" class="connexion">Connexion</a>
			<?php } ?>

		  </header>
		  
		 <div id="bouton" class="actif"></div> 
		  
		 <section id="popup"> <!-- début barre latérale gauche -->
			  
			  
			  <p>Définissez votre trajet:</p>
			  
			<form id="formulaire_itineraire" method="post" action="#">
				 
			    <input type="text" name="lieux_depart" id="lieux_depart" autocomplete="off" placeholder="Point de départ"  />
			    <a href="#" id="position">Position</a>
			    <input type="hidden" name="latitude_position" />
			    <input type="hidden" name="longitude_position" />
			    <input type="hidden" name="ref_lieux_depart" id="ref_lieux_depart" class="ref_lieu" />
			    <ul id="resultats_lieux_depart" class="autocomplete"></ul>


			    <input type="text" name="lieux_arrive" id="lieux_arrive"  autocomplete="off" placeholder="Lieu de destination"/>
			    <input type="hidden" name="ref_lieux_arrive" id="ref_lieux_arrive" class="ref_lieu"/>

				<?php
					// Si on charge un itineraire on ajoute les informations pour que le javascript puisse le charger aussi
					if(isset($itineraire)){
						echo('<input type="hidden" name="longitude_depart_itineraire" value="'.$itineraire['position_start']['position']['longitude'].'" />');
						echo('<input type="hidden" name="latitude_depart_itineraire" value="'.$itineraire['position_start']['position']['latitude'].'" />');
						echo('<input type="hidden" name="longitude_arrivee_itineraire" value="'.$itineraire['position_end']['position']['longitude'].'" />');
						echo('<input type="hidden" name="latitude_arrivee_itineraire" value="'.$itineraire['position_end']['position']['latitude'].'" />');
						
						echo('<input type="hidden" name="lieux_itineraire" value="'.implode(';',$itineraire['lieux']).'" />');

						echo('<input type="hidden" name="adresse_depart_itineraire" value="'.$itineraire['position_start']['adresse'].'" />');
						echo('<input type="hidden" name="ville_depart_itineraire" value="'.$itineraire['position_start']['ville'].'" />');

						echo('<input type="hidden" name="adresse_arrivee_itineraire" value="'.$itineraire['position_end']['adresse'].'" />');
						echo('<input type="hidden" name="ville_arrivee_itineraire" value="'.$itineraire['position_end']['ville'].'" />');
					}

				?>

			    <ul id="resultats_lieux_arrive" class="autocomplete"></ul>
		    
			     <!-- choix du moyen de transport -->   
			    <div class="ligne">
				    <div class="choix_transport">
					    <a href="#" id="marche" class="actif" alt="a pied"></a>
					    <a href="#" id="velo" alt="velo"></a>
					    <a href="#" id="metro" alt="metro"></a>
					</div>
					
					<form method="post" action="#">
						<input type="submit" value="Rechercher"/>
					</form>
				</div>
				
		   </form>
		   
		   
		   <hr>
		   
		   <!-- affichage des lieux trouvés dans le périmètre de l'itinéraire -->
		   
		   <div id="resultat_lieux"></div>
		   <div id="guidage_itineraire"></div>
			  
		  </section> <!-- fin barre latérale gauche -->
		  
		 
		<?php 
		if(isset($_SESSION["id"])){
		?>

		<!-- ***************Début de la sidebar de droite******************** -->
		  
		<section id="popup_right">

		<!-- sidebar affichage du profil -->

		<div id="sidebar_profile">

			<?php 
			if($user) { ?>
					<p><div class="mask"><img class="avatar mask" src="<?= $profile['avatar']?>" alt="Avatar de <?= $profile['name'] ?>"></div></p>
			<?php } else { ?>
					<p><div class="mask"><img class="avatar mask" src="<?= $src_avatar.$profile['avatar']?>" alt="Avatar de <?= $profile['name'] ?>"></div></p>
			<?php } ?>
			
				  
			<h3><span class="prenom"><?= $profile['name']?></span> <span id="nom"><?= $profile['surname']?></span></h3>
			<h4><?= $profile['nickname']?></h4>
			
			<hr>
			
			  <!-- affichage des lieux ajoutés par l'utilisateur -->
			  
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
						 	<a href="<?= getRewrite($profile_place['name'],$profile_place['id'])?>" class="place"><?= $profile_place['name']?></a>	
					  	</li>
					<?php } ?>
			  	</form> 	
			  </ul> 
			  <?php } ?>
			  <hr>
			  
			 <!-- affichage des itinéraires sauvegardés -->
			  
			 <p>Itinéraires sauvegardés <?php if($count_profile_routes!=0) { echo ("(".$count_profile_routes.")"); }; ?></p>
			  
			  <ul>
				  	
			  <?php if($count_profile_routes==0) { ?>
				<p>Vous n'avez sauvegardé aucun itinéraire</p>
					<?php } else { 
						foreach ($select_profile_routes as $select_profile_route) {
							$id_profile_route = $select_profile_route['id'];
							$profile_route = $dbh -> query("SELECT * FROM routes WHERE id LIKE '$id_profile_route'")->fetch();
							$places = json_decode($profile_route['places'],true);					
					?>	
					<li class="itinerary"> 
							<a href="<?php echo(getUrlItineraire($select_profile_route['name'],$select_profile_route['id'])); ?>">
								<p><?= $profile_route['name']?></p>
							</a>
							<div class="saved"></div>	
					</li>
					 <?php } ?>
			  	<form method="post" action="#">
			  	<input id="submit_delete_password" name="submit_delete_itinerary" type="submit" value="enregistrer">
			  	</form>	 
			  	
			  	<?php } ?> 
			  </ul>
			  
			  
			 <hr>
			 
			 <!-- Affichage des photos de l'utilisateur -->
			 
			 <p>Vos photos  <?php if($count_profile_media_images!=0) { echo (" (".$count_profile_media_images.")"); }; ?></p>
			 <div id="pictures">
			<?php if($count_profile_media_images==0) { ?>
				<p>Vous n'avez pris aucune photo</p>
			<?php } else { 
						foreach ($profile_media_image as $profile_media_image) {
							$profile_media_image_id=$profile_media_image['id'];
							$src_place = $dbh -> query("SELECT places_id FROM media WHERE id LIKE '$profile_media_image_id'")->fetch(0);
			?>	
							<div><img src="<?= getUrlMedia($profile_media_image['url_file'],$src_place['places_id'],'img')?>" /></div> 
				  <?php } ?>
			<?php } ?>

				 <a href="<?php echo(getUrlGalerie($profile['name'],$_SESSION['id'],'user')); ?>" id="other_pictures"></a>
			 </div>
			 
			 <hr>
			 
			 <!-- Affichage des vidéos de l'utilisateur -->
			 
			 <p>Vos Vidéos <?php if($count_profile_media_videos!=0) { echo (" (".$count_profile_media_videos.")"); }; ?></p>
			 
			 <div id="videos">
			 	<?php
					if($count_profile_media_videos == 0){
						echo '<p>Vous n\'avez pris aucune vidéo</p>';
					}
					else {
						foreach ($profile_media_video as $profile_media_video) {
							$profile_media_video_id = $profile_media_video['id'];
							$src_place1 = $dbh -> query("SELECT places_id FROM media WHERE id LIKE '$profile_media_image_id'")->fetch(0);
				?>
							<video width="40%" controls="controls">
								<source src="<?php echo getUrlMedia($profile_media_video['url_file'],$src_place1['places_id'],'video'); ?>" type="video/mp4" />
								<source src="<?php echo getUrlMedia($profile_media_video['url_file'],$src_place1['places_id'],'video'); ?>" type="video/webm" />
								<source src="<?php echo getUrlMedia($profile_media_video['url_file'],$src_place1['places_id'],'video'); ?>" type="video/ogg" />
								Erreur: votre vidéo n'a pas pu tre affichée
							</video>
				<?php
						}
					}
				?>
			 </div>

		</div>

		<!-- ***************Fin de la sidebar profil********************** -->



		<!-- *********début de la sidebar profile settings************** -->



		<div id="sidebar_edit"> 
		<?php 
		if($user) { ?>
			<p><div class="mask"><img class="avatar mask" src="<?= $profile['avatar']?>" alt="Avatar de <?= $profile['name'] ?>"></div></p>
		<?php } else { ?>
			<p><div class="mask"><img class="avatar mask" src="<?= $src_avatar.$profile['avatar']?>" alt="Avatar de <?= $profile['name'] ?>"></div></p>
		<?php } ?>

			  
		<h3><span class="prenom"><?= $profile['name']?></span> <span id="nom"><?= $profile['surname']?></span></h3>
		<h4><?= $profile['nickname']?></h4>
		<?php if(!$user) { ?>
			<div id="changeAvatar">
				<div id="form_avatar">
					<form enctype="multipart/form-data" action="<?php echo($chemin_relatif_site); ?>includes/edit-profile.inc.php" method="post">
						<div>
							<input type="file" name="avatar" accept="image/*">
						</div>
						<input type="submit" value="Charger une photo">
					</form>
				</div>
				<div class="conteneur_progress_bar">
						<div class="progress_bar"></div>
						<div class="progress_value">0%</div >
				</div>
				<p class="response"></p>
			</div>
		<hr>


		<div id="edit"><p>Informations du compte</p><img src="assets/img/rouage.svg"/></div>

		<form id="update_info" method="post" action="includes/edit-profile.inc.php">
				
				<p><label for="surname">Nom</label>
				<input type="text" value="<?= $profile['surname'] ?>" name="surname" id="surname" disabled/></p>
				
				<p><label for="name">Prénom</label>
				<input type="text" value="<?= $profile['name'] ?>" name="name" id="name" disabled/></p>
				
				<p><label for="save_infos">Mail</label>
				<input type="email" value="<?= $profile['email'] ?>" name="email" id="email" disabled/> </p>
				
				<input id="save_infos" name="submit_modify_profile" type="submit" value="Enregistrer">			
							
		</form>

		<hr>

		<div id="edit_password"><p>Modifier le mot de passe</p><img src="assets/img/rouage.svg"/></div>

		<form id="hidden_password" method="post" action="includes/edit-profile.inc.php"  >

				<p><label for="old_password">Mot de passe actuel</label></p>
				<input type="password"  name="old_password" size="50" id="old_password" disabled/> 
						
				<p><label for="password">Nouveau mot de passe</label></p>
				</label><input type="password" name="password" size="50" id="password" disabled/> 
				
				<p><label for="confirm_password">Confirmez</label></p>
				<input type="password" name="confirm_password" size="50" id="confirm_password" disabled/> 
				
				<input id="save_password" name="submit_modify_password" type="submit" value="Enregistrer">
										
		</form>

		<div id="partage_activite"><p>Partage d'activité</p></div>
		<a id="btn-facebook" href="<?php echo $loginUrl; ?>">Connexion avec <strong>Facebook</strong></a>
		<?php } else { ?>
				<p> Vous ne pouvez pas modifier vos informations personnelles. Votre profil est rattaché à votre compte Facebook. </p>
				<div id="partage_activite">
					<p>Partage d'activité</p>
					<form id="social_activity" method="post" action="includes/edit-profile.inc.php"  >
						<input type="checkbox"  name="social_activity" id="social_activity" <?php if(intval($profile['facebook_post'])==1){ echo('checked'); } ?>/>
						<label for="social_activity">Je souhaite partager mon activité</label>	
						<input name="submit_social_activity" type="submit" value="Enregistrer">							
					</form>
				</div>
		<?php }  ?>


		</div> 

		<!-- ******************fin de la sidebar profile settings*********************** -->
			   
		</section>  <!-- ******Fin de la sidebar****** -->	
		<?php 
		}	// Fin de if(isset($_SESSION["nickname"])){
		?>

		  	<div id="map-canvas"></div>
		  	<div id="navigation-ajax"></div>
		  	<div class="md-modal md-effect-1 little-modal" id="save-itineraire-modal">
				<div class="md-content">
				</div>
			</div>
		  	<div class="md-overlay"></div>
		  	<div class="loader">
			  <canvas id="canvas" width="250" height="250"></canvas>
			  <p>Chargement en cours...</p>
		  	</div>
		  	<div id="hidden"></div>

			<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
			<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true&libraries=places&key=AIzaSyD2GbjbQbMiZrFHJN5b2L09ZenuQ8IzJUc&v=3.exp"></script>
			<script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js"></script>
			<script type="text/javascript" src="js/jquery.form.js"></script>
			<script type="text/javascript" src="js/functions.js"></script>
			<script type="text/javascript" src="js/autocompletion.js"></script>
			<script type="text/javascript" src="js/carte.js"></script>
			<script type="text/javascript" src="js/navigation-ajax.js"></script>
			<script type="text/javascript" src="js/itineraire.js"></script>
			<script type="text/javascript" src="js/loader.js"></script>
			<script type="text/javascript" src="js/localize.js"></script>
			<script type="text/javascript" src="js/home.js"></script>
			<script type="text/javascript" src="js/sidebar.js"></script>
			<script type="text/javascript" src="js/edit-profile.js"></script>
			<script>
			  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			  ga('create', 'UA-46020182-1', 'find-it-out.fr');
			  ga('send', 'pageview');

			</script>
		  </body>  
		</html>

