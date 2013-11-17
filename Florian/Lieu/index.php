<?php
	session_start();
	
	echo $id_user = 6;
	echo $lat = 48.8582285;
	echo $long = 2.2943877;
?>

<!DOCTYPE html>
<head>
 	<meta charset="UTF-8" />
 	<meta http-equiv="X-UA-Compatible" content="IE=edge">
 	
		<title></title>
		<meta name="description" content="">
		
		<meta name="viewport" content="width=device-width,initial-scale=1">
		
	</head>
	<body>
		<h1>Ajouter un lieu</h1>
		<form method="post" action="validateLieu.php">
		
			<label for="namePlace">Nom du lieu</label>
			<input type="text" id="namePlace" name="namePlace" required/><br>
			Description <textarea name="description" >
			</textarea><br>
			<label for="address">Adresse</label>
			<input type="text" id="address" name="address" /><br>
			<label for="postCode">Code postal</label>
			<input type="number" id="postCode" name="postCode" /><br>
			<label for="city">Ville</label>
			<input type="text" id="city" name="city" required/><br>
			
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
			
			<br><input type="submit" name="valueButton" value="Soumettre" />
		</form>
	</body>
</html>