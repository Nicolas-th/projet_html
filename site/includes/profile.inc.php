<?php

/*-----------------------------------------------------------*/	
/*------- SÉLÉCTION DES INFORMATIONS DE L'UTILISATEUR -------*/
/*-----------------------------------------------------------*/	

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
/*------ SÉLÉCTION DES PHOTOS PRISES PAR L'UTILISATEUR ------*/
/*-----------------------------------------------------------*/	

$profile_media_image = $dbh -> query("SELECT * FROM media WHERE users_id='$idUser' AND type ='img' ")->fetchAll();
$count_profile_media_images = $dbh -> query("SELECT * FROM media WHERE users_id='$idUser' AND type='img'")->rowCount();


?>