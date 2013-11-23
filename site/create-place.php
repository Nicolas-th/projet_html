<?php
	session_start();
	
	$id_user = 6;
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
		<link rel="stylesheet" type="text/css" href="assets/css/place.css" />
		<link rel="stylesheet" type="text/css" href="assets/css/simplegrid-lieu.css" />
	</head>
	<body>
		<div id="container">
			<div class="grid grid-pad">
				<div class="col-1-1">
					<h1>Ajouter un lieu</h1>
				</div>
			</div>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<form method="post" action="validate-place.php">
						<label for="namePlace">Nom du lieu*</label>
						<input type="text" id="namePlace" name="namePlace" required/><br/><br/>
						<label for="description" >Description*</label>
						<textarea name="description" required></textarea><br/><br/>
						<label for="address">Adresse</label>
						<input type="text" id="address" name="address" /><br/><br/>
						<label for="postCode">Code postal</label>
						<input type="number" id="postCode" name="postCode" /><br/><br/>
						<label for="city">Ville*</label>
						<input type="text" id="city" name="city" required/><br/><br/>
						
						<div id="fields-select-submit">
							<select name="inOut">
								<option value="0">Intérieur</option>
								<option value="1">Extérieur</option>
							</select>
							
							<select name="categorie">
								<option value="1">Catégorie 1</option>
								<option value="2">Catégorie 2</option>
								<option value="3">Catégorie 3</option>
								<option value="4">Catégorie 4</option>
							</select>

							<input type="hidden" name="latitude" value="<?php echo $lat; ?>" />
							<input type="hidden" name="longitude" value="<?php echo $long; ?>" />
							<input type="hidden" name="valid" value="0" />
						
							<br><input class="submit" type="submit" name="valueButton" value="Soumettre" />
						</div>
					</form>
				</div>
			</div>

		</div><!-- #container -->
	</body>
</html>