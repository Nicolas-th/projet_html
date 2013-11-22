<?php
	require_once('config/config.php');
	require_once('includes/functions.inc.php');
	
	$namePlace = htmlspecialchars(trim($_POST['namePlace']));
	$city = htmlspecialchars(trim($_POST['city']));
	
	if( isset($namePlace) && !empty($namePlace) && isset($city) && !empty($city) ){
		$latitude = $_POST['latitude'];
		$longitude = $_POST['longitude'];
		$description = htmlspecialchars($_POST['description']);
		$address = htmlspecialchars($_POST['address']);
		$postCode = htmlspecialchars(trim($_POST['postCode']));
		$categorie = $_POST['categorie'];
		$valid = $_POST['valid'];
		$inOut = $_POST['inOut'];
		
		
		//On vérifie le code postal
		if(!preg_match (" /^[0-9]{5,5}$/ ",$postCode)){
			$error =  'Le code postal n\'existe pas.';
		}
			
		//On vérifie si il existe un lieu dans la BDD avec le même nom et la même ville
		$reqVerif = $dbh->prepare("SELECT name FROM places WHERE name LIKE :name AND city LIKE :city");
			$reqVerif->bindValue('name',$namePlace,PDO::PARAM_STR);
			$reqVerif->bindValue('city',$city,PDO::PARAM_STR);
		$reqVerif->execute();
		
		if($reqVerif->fetch() == 0){
			
			//On insère le lieu dans la BDD
			$reqPlace = $dbh->prepare("INSERT INTO places VALUES('',:name,:description,:latitude,:longitude,:address,:postcode,:city,:inOut,:valid,:categorie)");
				$reqPlace->bindValue('name',$namePlace,PDO::PARAM_STR);
				$reqPlace->bindValue('description',$description,PDO::PARAM_STR);
				$reqPlace->bindValue('latitude',$latitude,PDO::PARAM_INT);
				$reqPlace->bindValue('longitude',$longitude,PDO::PARAM_INT);
				$reqPlace->bindValue('address',$address,PDO::PARAM_STR);
				$reqPlace->bindValue('postcode',$postCode,PDO::PARAM_INT);
				$reqPlace->bindValue('city',$city,PDO::PARAM_STR);
				$reqPlace->bindValue('inOut',$inOut,PDO::PARAM_INT);
				$reqPlace->bindValue('valid',$valid,PDO::PARAM_INT);
				$reqPlace->bindValue('categorie',$categorie,PDO::PARAM_INT);
			$reqPlace->execute();
			
			//On effectue une requête pour récupérer l'id du lieu inséré précèdemment
			$reqGetId = $dbh->prepare("SELECT id FROM places WHERE name LIKE :name AND city LIKE :city");
				$reqGetId->bindValue('name',$namePlace,PDO::PARAM_STR);
				$reqGetId->bindValue('city',$city,PDO::PARAM_STR);
			$reqGetId->execute();
			
			$result = $reqGetId->fetch();
			$idPlace = $result['id'];
		
			$url =  getRewrite($namePlace,$idPlace);
			
			//On redirige sur la page du lieu crée
			header("location:$url"); 
		}
		else {
			$error =  'Il existe déjà un lieu avec ce nom dans cette ville.';
		}
	}
	else {
		$error = 'Vous n\'avez pas sélectionné de nom de lieu ou de ville';
	}
	
	if(!empty($error)){
		echo $error;
		echo "<br><a href=\"create-place.php\">Retour</a>";
	}
	
?>