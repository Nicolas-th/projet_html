<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
session_start();
if ($_SESSION["email"] == NULL):
require_once('config/config.php'); 


/*----------------------ACCÈS À FACEBOOK---------------------*/
require_once('config/fb_config.php'); 


?>
<!doctype html>
<html>
	<head>
		<title>Find It Out !</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="initial-scale=1.0">
		<meta name="description" content="FindItOut vous permet de découvrir des lieux insolites dans toute la France à travers des itinéraires originaux !">
		<meta name="keywords" content="finditout, lieux insolites, lieux originaux, ville, france, paris, lyon, marseille, toulouse, rennes, bordeaux, caen, nantes">
		<link rel="stylesheet" type="text/css" href="assets/css/simplegrid.css" />
		<link rel="stylesheet" type="text/css" href="assets/css/style.css" />
		<script src="js/modernizr.custom.js"></script>
	</head>
	<body onload="initialize()">
		<div class="container">	
			<!-- header : logo + connexion -->
			<div class="grid grid-pad">
				<div class="col-2-12">
					<img id="logo" src="#" alt="Logo ici">
				</div>
	
				<div class="col-2-12 center push-right">
					<a href="#" class="md-trigger bouton-connexion" data-modal="connexion-modal">Se connecter</a>
				</div>
			</div>
	
			<!-- introduction : slogan, connexion fb, inscription -->
			<div id="introduction">
	
				<div class="grid">
					<div class="col-1-1">
						<h1 id="intro">Redéfinissez le must-see.</h1>
					</div>
				</div>
				
				<div class="grid">
					<div class="col-1-1">
						<p id="connexion">Vous avez déjà un compte ?<a href="#" class="md-trigger" data-modal="connexion-modal"> Se connecter</a></p>
					</div>
				</div>
	
				<div class="grid">
					<div id="inscription" class="col-1-1 center">
						<div id="connexion-facebook">
							<a href="<?php echo $loginUrl; ?>">Connexion avec <strong>Facebook</strong></a>
						</div> 
						<div id="creer-mon-compte">
							<a href="signin.php">Créer mon compte</a>
						</div>
					</div>
				</div>
	
			</div>
	
			<!-- 1) Localisez-vous -->
	
			<div class="grid">
				<div class="col-1-1">
					<div class="encadre">
						<img class="trait" src="assets/img/firstpage/trait.jpg" alt="trait">
						<span class="nb-encadre">1.</span>
						<img class="trait" src="assets/img/firstpage/trait.jpg" alt="trait">
					</div>
				</div>
			</div>
	
			<div class="grid">
				<div class="col-1-1">
					<h1>Localisez-vous !</h1>
				</div>
				<div class="col-1-1">
					<p id="description-1">FindItOut repère dans un premier temps l’endroit où vous vous situez.</p>
				</div>
			</div>
			
			<div id="map-canvas"></div>
	
	
			<!-- 2) Définissez votre itinéraire de base -->
	
			<div class="grid">
				<div class="col-1-1">
					<div class="encadre">
						<img class="trait" src="assets/img/firstpage/trait.jpg" alt="trait">
						<span class="nb-encadre">2.</span>
						<img class="trait" src="assets/img/firstpage/trait.jpg" alt="trait">
					</div>
				</div>
			</div>
			
			<div class="grid">
				<div class="col-1-1">
					<h1>Définissez votre itinéraire de base</h1>
				</div>
				<div class="col-1-1">
					<p id="description-2">Imaginons que vous souhaitiez vous rendre d’un point A à un point B. Renseignez vos points de départ et d’arrivée afin que FindItOut puisse analyser le périmètre proche de votre circuit.</p>
				</div>
				<div class="illustration">
					<img src="assets/img/firstpage/walk.png" id="carte-2" alt="Itinéraire de base" title="Itinéraire de base">
				</div>
			</div>
	
			<!-- 3) Les détours valent parfois le coup ! -->
	
			<div class="grid">
				<div class="col-1-1">
					<div class="encadre">
						<img id="encadre-3" class="trait" src="assets/img/firstpage/trait.jpg" alt="trait">
						<span class="nb-encadre">3.</span>
						<img id="encadre-3" class="trait" src="assets/img/firstpage/trait.jpg" alt="trait">
					</div>
				</div>
			</div>
	
			<div class="grid">
				<div class="col-1-1">
					<h1>Les détours valent parfois le coup !</h1>
				</div>
				<div class="col-1-1">
					<p id="description-3">Les villes regorgent de lieux insolites et charmants. Armez-vous d’un peu de temps supplémentaire et détournez un peu vos habitudes et votre routine. ll y a forcément des endroits bien sympathiques autour de vous qui vous sont inconnus.</p>
				</div>
			</div>
			
			<div class="illustration">
				<img src="assets/img/firstpage/pictures.jpg" id="diapo" alt="Diapo">
			</div>
			<div class="illustration">
				<img src="assets/img/firstpage/walk_marks.png" id="carte-3" alt="Détours">
			</div>
	
			<!-- + Utilisez FindItOut dans différentes situations. -->
	
			<div class="grid">
				<div class="col-1-1">
					<div class="encadre">
						<img class="trait" src="assets/img/firstpage/trait.jpg" alt="trait">
						<span class="nb-encadre">+</span>
						<img class="trait" src="assets/img/firstpage/trait.jpg" alt="trait">
					</div>
				</div>
			</div>
	
			<div class="grid">
				<div class="col-1-1">
					<h1 id="last">Utilisez FindItOut dans différentes situations.</h1>
				</div>
			</div>
	
			<div class="illustration" id="laptop-devices">
				<img id="laptop" src="assets/img/firstpage/laptop.jpg" alt="laptop">
				<img id="devices" src="assets/img/firstpage/devices.jpg" alt="devices">
			</div>
	
			<div class="grid grid-pad">
				<div class="col-1-2">
					<div class="texte-utilisateur" id="texte-laptop">
						<h2>Utilisateurs de PC/Mac</h2>
						<ul>
							<li><img alt="Disponible" src="assets/img/firstpage/green_icon.png">Géolocalisation</li>
							<li><img alt="Disponible" src="assets/img/firstpage/green_icon.png">Création d'itinéraires</li>
							<li><img alt="Disponible" src="assets/img/firstpage/green_icon.png">Examen des alentours</li>
							<li><img alt="Non disponible" src="assets/img/firstpage/red_icon.png">Partagez un lieu</li>
						</ul>
					</div>
				</div>
				<div class="col-1-2">
					<div class="texte-utilisateur" id="texte-mobile"> 
						<h2>Utilisateurs de tablettes <br/>et smartphones</h2>
						<ul>
							<li><img alt="Disponible" src="assets/img/firstpage/green_icon.png">Géolocalisation</li>
							<li><img alt="Disponible" src="assets/img/firstpage/green_icon.png">Création d'itinéraires</li>
							<li><img alt="Disponible" src="assets/img/firstpage/green_icon.png">Examen des alentours</li>
							<li><img alt="Disponible" src="assets/img/firstpage/green_icon.png">Partagez un lieu</li>
						</ul>
					</div>
				</div>
			</div>
	
			<div class="grid">
				<div class="col-1-1">
					<a id="essayer" href="#">Essayer !</a>
				</div>
			</div>
	
			<!-- footer -->
			<div id="footer-header">
				Ce projet a été réalisé dans le cadre du cours HTML/CSS3 par un groupe de H3 P2016.
			</div>
			<div id="footer-footer">
				©HETIC - P2016 - Tous droits réservés
			</div>
		</div>
				
		<div id="connexion-modal" class="md-modal md-effect-1">
		<div class="md-content">
		  <p>Connexion</p>
		 		 <a  href="#" class="md-close"><img src="imgs/close.png" alt="close"/></a>
		 		 	<form method='post' action='login.php'>
			 		 	<input type="text" name="mail" placeholder="E-mail" id="mail" required/>
			 		 	<input type="password" name="password" placeholder="Mot de passe" id="password" required/>
			 		 	<div id="btn-connexion"> <input type="submit" name="submit_login" value="Se connecter" /></div>	 
			 		 </form>
		</div> 
		

		<script src="http://code.jquery.com/jquery-1.4.2.min.js" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
		<script src="assets/js/config.js"></script> 
		<script src="assets/js/classie.js"></script>
		<script src="assets/js/modalEffects.js"></script>
		<script type="text/javascript" src="assets/js/firstpage.js"></script>
		<script>
		  window.fbAsyncInit = function() {
		    // init the FB JS SDK
		    FB.init({
		      appId      : '<? echo $app_id ?>',                        // App ID from the app dashboard
		      channelUrl : '', // Channel file for x-domain comms
		      status     : true,                                 // Check Facebook Login status
		      xfbml      : true                                  // Look for social plugins on the page
		    });
		
		    // Additional initialization code such as adding Event Listeners goes here
		  };
		
		  // Load the SDK asynchronously
		  (function(d, s, id){
		     var js, fjs = d.getElementsByTagName(s)[0];
		     if (d.getElementById(id)) {return;}
		     js = d.createElement(s); js.id = id;
		     js.src = "//connect.facebook.net/fr_FR/all.js";
		     fjs.parentNode.insertBefore(js, fjs);
		   }(document, 'script', 'facebook-jssdk'));
	   </script>
	</body>
	
</html>
<?php 
else: 
	header('Location: home.php');
endif ?>
