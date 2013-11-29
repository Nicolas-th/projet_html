<?php

/*-----------------------------------------------------------*/	
/*------- SÉLÉCTION DES INFORMATIONS DE L'UTILISATEUR -------*/
/*-----------------------------------------------------------*/	

if(isset($_SESSION['id'])){

	$idUser = $_SESSION['id'];
	$profile = $dbh -> query("SELECT * FROM users WHERE id LIKE '$idUser'")->fetch();


	/*-----------------------------------------------------------*/	
	/*------ SÉLÉCTION DES LIEUX VISITÉS PAR L'UTILISATEUR ------*/
	/*-----------------------------------------------------------*/	

	$select_profile_places = $dbh -> query("SELECT * FROM users_has_places WHERE users_id LIKE '$idUser'")->fetchAll();
	$count_profile_places = $dbh -> query("SELECT * FROM users_has_places WHERE users_id LIKE '$idUser'")->rowCount();

	/*-----------------------------------------------------------*/	
	/*- SÉLÉCTION DES ITINÉRAIRES SAUVEGARDÉS PAR L'UTILISATEUR -*/
	/*-----------------------------------------------------------*/	

	$select_profile_routes = $dbh -> query("SELECT * FROM routes WHERE user_id LIKE '$idUser'")->fetchAll();
	$count_profile_routes = $dbh -> query("SELECT * FROM routes WHERE user_id LIKE '$idUser'")->rowCount();

	/*-----------------------------------------------------------*/	
	/*---------------- SUPPRESSION D'ITINÉRAIRES ----------------*/
	/*-----------------------------------------------------------*/
		

	foreach ($select_profile_routes as $select_profile_route):	
	if ( isset($_POST['delete_route']) ) 
	{
	    $delete = $dbh -> query("DELETE FROM painting WHERE id='".$_POST['delete_route']."' " );
	    var_dump($delete);
	}
	endforeach;


	/*-----------------------------------------------------------*/	
	/*------ SÉLÉCTION DES PHOTOS PRISES PAR L'UTILISATEUR ------*/
	/*-----------------------------------------------------------*/	

	$profile_media_image = $dbh -> query("SELECT * FROM media WHERE users_id='$idUser' AND type ='img' ")->fetchAll();
	$count_profile_media_images = $dbh -> query("SELECT * FROM media WHERE users_id='$idUser' AND type='img'")->rowCount();

	/*-----------------------------------------------------------*/	
	/*------ SÉLÉCTION DES VIDEOS PRISES PAR L'UTILISATEUR ------*/
	/*-----------------------------------------------------------*/	

	$profile_media_video = $dbh -> query("SELECT * FROM media WHERE users_id='$idUser' AND type ='video' ")->fetchAll();
	$count_profile_media_videos = $dbh -> query("SELECT * FROM media WHERE users_id='$idUser' AND type='video'")->rowCount();


	/*-----------------------------------------------------------*/	
	/*--------------- CHARGEMENT DES ITINERAIRES ----------------*/
	/*-----------------------------------------------------------*/	
	if(isset($_GET['id_itineraire'])){
		$id_itineraire = intval($_GET['id_itineraire']);

		$itineraire_charge = $dbh ->query("SELECT * FROM routes WHERE id='$id_itineraire' AND user_id = '$idUser' ")->fetchAll();
	}
}

/*-----------------------------------------------------------*/	
/*----------- SÉLÉCTION DES PHOTOS PRISES DU LIEU -----------*/
/*-----------------------------------------------------------*/	
if(isset($id_lieu)){
	$place_media_image = $dbh ->query("SELECT * FROM media WHERE places_id='$id_lieu' AND type = 'img' ")->fetchAll();
	$count_place_media_images = $dbh -> query("SELECT * FROM media WHERE places_id='$id_lieu' AND type ='img'")->rowCount();
}
?>

