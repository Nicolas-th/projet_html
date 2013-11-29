<?php
	session_start();
	
	require_once('config/config.php');
	require_once('includes/functions.inc.php');
	require_once('classes/Mobile_Detect.class.php');
	require_once('includes/profile.inc.php');
	
	if(isset($_GET['id'])){
		$id_user = intval($_GET['id']);
		$reqDisplayPhotoUser = $dbh->prepare("SELECT name,surname FROM users WHERE id =:id_user");
		$reqDisplayPhotoUser->bindValue('id_user',$id_user,PDO::PARAM_INT);
		$reqDisplayPhotoUser->execute();
		$reqDisplayPhoto = $reqDisplayPhotoUser->fetch();

		/*-----------------------------------------------------------*/	
		/*------ SÉLÉCTION DES PHOTOS PRISES PAR L'UTILISATEUR ------*/
		/*-----------------------------------------------------------*/	

		$medias_image = $dbh -> query("SELECT * FROM media WHERE users_id='$id_user' AND type ='img' ")->fetchAll();
		$count_medias_images = $dbh -> query("SELECT * FROM media WHERE users_id='$id_user' AND type='img'")->rowCount();

		/*-----------------------------------------------------------*/	
		/*------ SÉLÉCTION DES VIDEOS PRISES PAR L'UTILISATEUR ------*/
		/*-----------------------------------------------------------*/	

		$medias_video = $dbh -> query("SELECT * FROM media WHERE users_id='$id_user' AND type ='video' ")->fetchAll();
		$count_medias_videos = $dbh -> query("SELECT * FROM media WHERE users_id='$id_user' AND type='video'")->rowCount();

		$h1_images = 'Photos prises par <span>'.$reqDisplayPhoto["surname"].' '.$reqDisplayPhoto["name"].'</span>';
		$h1_videos = 'Vidéos prises par <span>'.$reqDisplayPhoto["surname"].' '.$reqDisplayPhoto["name"].'</span>';

		$aucune_photo = '<p>Vous n\'avez ajouté aucune photo</p>';
		$aucune_video = '<p>Vous n\'avez ajouté aucune vidéo</p>';

		$h1 = 'Galerie de '.$reqDisplayPhoto["name"].' '.$reqDisplayPhoto["surname"];
	}elseif(isset($_GET['id_lieu'])){
		$id_lieu = intval($_GET['id_lieu']);
		$reqInfosLieu = $dbh->prepare("SELECT * FROM places WHERE id =:id_lieu");
		$reqInfosLieu->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
		$reqInfosLieu->execute();
		$infos_lieu = $reqInfosLieu->fetch();

		/*-----------------------------------------------------------*/	
		/*--------------- SÉLÉCTION DES PHOTOS DU LIEU --------------*/
		/*-----------------------------------------------------------*/	

		$medias_image = $dbh -> query("SELECT * FROM media WHERE places_id='$id_lieu' AND type ='img' ")->fetchAll();
		$count_medias_images = $dbh -> query("SELECT * FROM media WHERE places_id='$id_lieu' AND type='img'")->rowCount();

		/*-----------------------------------------------------------*/	
		/*--------------- SÉLÉCTION DES VIDEOS DU LIEU --------------*/
		/*-----------------------------------------------------------*/	

		$medias_video = $dbh -> query("SELECT * FROM media WHERE places_id='$id_lieu' AND type ='video' ")->fetchAll();
		$count_medias_videos = $dbh -> query("SELECT * FROM media WHERE places_id='$id_lieu' AND type='video'")->rowCount();

		$h1_images = 'Photos de <span>'.$infos_lieu['name'].'</span>';
		$h1_videos = 'Vidéos de <span>'.$infos_lieu['name'].'</span>';

		$aucune_photo = '<p>Aucune photo du lieu n\'a été ajoutée.</p>';
		$aucune_video = '<p>Aucune vidéo du lieu n\'a été ajoutée.</p>';

		$h1 = 'Galerie de '.$infos_lieu['name'];
	}else{
		header("HTTP/1.1 301 Moved Permanently");
   		header('Location : '.$chemin_relatif_site.'index.php');
		exit;
	}
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title><?php echo($h1); ?></title>
    	<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/global.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/place.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/simplegrid-lieu.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/gallery.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/lightbox.css" />

		
	</head>
	<body>
		<div id="container-lieu" data-id="8">			

			<div class="grid grid-pad">
				<div class="col-1-1">
				
				<a href="/home.php" class="md-close close-ajax-page"><img src="<?php echo($chemin_relatif_site); ?>assets/img/close.png" width="15" height="15" alt="close"></a>
				
					<h1><?php echo($h1_images); ?></h1>
				</div>
			</div>
			<hr/>


			<div class="grid grid-pad">
				<div class="col-1-1">
					<div id="photos-lieu">
						<?php if($count_medias_images==0) { 
							echo($aucune_photo);
						} else { 
									foreach ($medias_image as $media_image) {
						?>	
										<a href="<?php echo getUrlMedia($media_image['url_file'],$media_image['places_id'],'img')?>"><img class="photo-lieu" src="<?php echo getUrlMedia($media_image['url_file'],$media_image['places_id'],'img')?>" alt=""></a> 
							  <?php } ?>
						<?php } ?>
					</div>
				</div>
		
				<div class="col-1-1">
					<h1><?php echo($h1_videos); ?></h1>
					
					<hr/>
					
					<div id="video_content">
						<?php
							if($count_medias_videos == 0){
								echo $aucune_video;
							}
							else {
								foreach ($medias_video as $media_video) {									
						?>
									<video width="40%" controls="controls">
										<source src="<?php echo getUrlMedia($media_video['url_file'],$media_video['places_id'],'video'); ?>" type="video/mp4" />
										<source src="<?php echo getUrlMedia($media_video['url_file'],$media_video['places_id'],'video'); ?>" type="video/webm" />
										<source src="<?php echo getUrlMedia($media_video['url_file'],$media_video['places_id'],'video'); ?>" type="video/ogg" />
										Vidéo non compatible
									</video>
						<?php
								}
							}
						?>
					</div> <!-- fin video content -->
					
				</div>
			</div>
		</div>

		<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
		<script type="text/javascript" src="<?php echo($chemin_relatif_site); ?>js/jquery.lightbox-0.5.js"></script>
		
		<script type="text/javascript">
		$(function() {
			
			$('#photos-lieu a').lightBox(); // Select all links in object with gallery ID
			// This, or...
			
		});
		</script>

	</body>
</html>			