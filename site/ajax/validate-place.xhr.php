<?php
	require_once('../config/config.php');
	require_once('../includes/functions.inc.php');

	if(isset($_POST['latitude']) && isset($_POST['longitude']) && isset($_POST['description']) && isset($_POST['address']) && isset($_POST['postCode']) && isset($_POST['categorie']) && isset($_POST['valid']) && isset($_POST['inOut'])){
	
		$namePlace = htmlspecialchars(trim($_POST['namePlace']));
		$city = htmlspecialchars(trim($_POST['city']));
		
		if( isset($namePlace) && !empty($namePlace) && isset($city) && !empty($city) ){
			$latitude = $_POST['latitude'];
			$longitude = $_POST['longitude'];
			$description = htmlspecialchars($_POST['description']);
			$address = htmlspecialchars($_POST['address']);
			$postCode = htmlspecialchars(trim($_POST['postCode']));
			$categorie = intval($_POST['categorie']);
			$valid = 0;
			$inOut = intval($_POST['inOut']);
			
			
			//On vŽrifie le code postal
			if(!preg_match (" /^[0-9]{5,5}$/ ",$postCode)){
				$error =  'Le code postal n\'existe pas.';
			}
				
			//On vŽrifie si il existe un lieu dans la BDD avec le mme nom et la mme ville
			$reqVerif = $dbh->prepare("SELECT name FROM places WHERE name LIKE :name AND city LIKE :city");
				$reqVerif->bindValue('name',$namePlace,PDO::PARAM_STR);
				$reqVerif->bindValue('city',$city,PDO::PARAM_STR);
			$reqVerif->execute();
			
			if($reqVerif->fetch() == 0){
				
				//On insre le lieu dans la BDD
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
				
				//On effectue une requte pour rŽcupŽrer l'id du lieu insŽrŽ prŽcdemment
				$reqGetId = $dbh->prepare("SELECT id FROM places WHERE name LIKE :name AND city LIKE :city");
					$reqGetId->bindValue('name',$namePlace,PDO::PARAM_STR);
					$reqGetId->bindValue('city',$city,PDO::PARAM_STR);
				$reqGetId->execute();
				
				$result = $reqGetId->fetch();
				$idPlace = $result['id'];
			
				$url =  getRewrite($namePlace,$idPlace);
			
			}
			else {
				$error =  'Il existe déjà un lieu avec ce nom dans cette ville.';
			}
		}
		else {
			$error = 'Vous n\'avez pas sélectionné de nom de lieu ou de ville';
		}
		
		if(isset($error)){
			$retour['type'] = 'error';
			$retour['erreur'] = $error;
		}else{
			$retour['type'] = 'ok';
			$retour['url'] = $url;
		}

	}else{
		$retour['type'] = 'error';
		$retour['erreur'] = 'Tous les champs du formulaire ne sont pas remplis';
	}

	echo(json_encode($retour));
		
?>