<?php
	session_start();

	require_once('config/config.php'); 
	require_once('includes/functions.inc.php');
	require_once('classes/sql.class.php');

	if(!isset($_SESSION['id'])){
   		header('Location : '.$chemin_relatif_site.'index.php');
	}
	
	$id_user = intval($_SESSION['id']);
	$address = "Place du Trocadéro";
	$postCode = 95000;
	$city = "Paris";
	$lat = 48.8582285;
	$long = 2.2943877;
?>

<!DOCTYPE html>
<head>
 	<meta charset="UTF-8" />
 	<meta http-equiv="X-UA-Compatible" content="IE=edge">
 	
		<title>Création d'un lieu</title>
		<meta name="description" content="">
		
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/global.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/place.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/simplegrid-lieu.css" />
	</head>
	<body>
	<?php if(!(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')) { ?>
		<header>
	  	<?php if(isset($_SESSION["id"])){ ?>
			<a href="../logout.php"><div class="icon"></div></a>
		<?php }else{ ?>
			<a href="../index.php" class="connexion">Connexion</a>
		<?php } ?>
	  	</header>
	  	<a href="../index.php" id="bouton">Accueil</a> 
	<?php } ?>
		<div id="container">
			<div class="grid grid-pad">
				<div class="col-1-1">
					<h1>Ajouter un lieu</h1>
				</div>
			</div>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<form method="post" action="/ajax/validate-place.xhr.php" id="form-ajout-lieux">
						<label for="namePlace">Nom du lieu*</label>
						<input type="text" id="namePlace" name="namePlace" required/><br/><br/>
						<label for="description" >Description*</label>
						<textarea name="description" required></textarea><br/><br/>
						
						<div id="fields-select-submit">
							
							<div class="infos_localisation_lieu hide">
								<label for="address" >Adresse*</label>
								<input type="hidden" name="address" /><br/><br/>
								<label for="postCode" >Code postal*</label>
								<input type="hidden" name="postCode" /><br/><br/>
								<label for="city" >Ville*</label>
								<input type="hidden" name="city" />
							</div>
							<input type="hidden" name="latitude" />
							<input type="hidden" name="longitude" />
							<input type="hidden" name="valid" value="0" />

							<label for="inOut" >Localisation</label>
							<select name="inOut">
								<option value="0">Intérieur</option>
								<option value="1">Extérieur</option>
							</select><br/><br/>

							<label for="categorie" >Catégorie</label>
							<select name="categorie">	
								<?php
								$sql = new SQL($dbh);
								$sql->prepare("SELECT * FROM categories");
								$categories = $sql->execute(true);

								if(is_array($categories) && count($categories)>0){
									foreach($categories as $cat){
										echo('<option value="'.$cat['id'].'">'.$cat['name'].'</option>');
									}
								}
								?>
							</select>
						
							<br><input class="submit" type="submit" name="valueButton" value="Soumettre" />
						</div>
					</form>
				</div>
			</div>

		</div><!-- #container -->
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
		<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=true&libraries=places&key=AIzaSyD2GbjbQbMiZrFHJN5b2L09ZenuQ8IzJUc&v=3.exp"></script>
		<script type="text/javascript" src="js/localize.js"></script>
		<script type="text/javascript" src="js/create-place.js"></script>
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