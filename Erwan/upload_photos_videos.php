<?php

	session_start();

	require_once('includes/config.inc.php');
	require_once('includes/functions.inc.php');
	require_once('classes/sql.class.php');

	if (isset($_FILES['imageFile']) && $_FILES["imageFile"]["error"] == 0){

		$destinationDirectory   = '/var/www/illio.fr/web/projet_html/tests_erwan/uploads/';
		$destinationURL   		= 'http://www.find-it-out.fr/tests_erwan/uploads/';
		$imageMaxSize       	= 500;
		$quality           		= 90;

		$imageName      = str_replace(' ','-',strtolower($_FILES['imageFile']['name']));
	    $imageSize      = $_FILES['imageFile']['size'];
	    $tempImage      = $_FILES['imageFile']['tmp_name'];
	    $imageType      = $_FILES['imageFile']['type'];

	    switch(strtolower($imageType)){
	        case 'image/png':
	            $createdImage =  imagecreatefrompng($_FILES['imageFile']['tmp_name']);
	            $createdImage = imagetranstowhite($createdImage);
	            break;
	        case 'image/gif':
	            $createdImage =  imagecreatefromgif($_FILES['imageFile']['tmp_name']);
	            break;
	        case 'image/jpeg':
	        	$createdImage =  imagecreatefromjpeg($_FILES['imageFile']['tmp_name']);
	            break;
	        case 'image/pjpeg':
	            $createdImage = imagecreatefromjpeg($_FILES['imageFile']['tmp_name']);
	            break;
	        default:
	            $erreur = 'Format de fichier non supporté !';
	    }

	    if(!isset($erreur)){

	    	list($currentWidth,$currentHeight) = getimagesize($tempImage);

	    	$newImageName = 'temp.jpeg';
		    $destNewImage = $destinationDirectory.$newImageName;
		    $urlNewImage = $destinationURL.$newImageName;

		    if(resizeImage($currentWidth,$currentHeight,$imageMaxSize,$destNewImage,$createdImage,$quality,'image/jpeg')){
				//echo('OK');
		    }else{
		        $erreur = 'Resize Error';
		    }

	    }

	    if(!isset($erreur)){
	    	$sql = new SQL();

	    	/* Flickr */

	    	$flickr = array(
	    		'type' => 'uploadPhoto',
	    		'attachment' => json_encode(array('path_image' => $destNewImage, 'title' => 'test', 'description' => 'Test', 'keywords' => 'test1, test2'))
	    	);

	    	$sql->prepare('INSERT INTO api_flickr (type,attachment) VALUES (:type,:attachment)');
			$sql->bindValue('type',$flickr['type'],PDO::PARAM_STR);
			$sql->bindValue('attachment',$flickr['attachment'],PDO::PARAM_STR);
			$sql->execute();


			/* Twitter */

			$twitter = array(
	    		'type' => 'https://api.twitter.com/1.1/statuses/update_with_media.json',
	    		'attachment' => json_encode(array(
	    			'media[]'  => '@{'.$destNewImage.'};type=image/jpeg;filename={'.$destNewImage.'}',
	            	'status'   => '#dev',
	    		))
	    	);

			$sql->prepare('INSERT INTO api_twitter (type,attachment) VALUES (:type,:attachment)');
			$sql->bindValue('type',$twitter['type'],PDO::PARAM_STR);
			$sql->bindValue('attachment',$twitter['attachment'],PDO::PARAM_STR);
			$sql->execute();

			/* Facebook */

			$facebook = array(
	    		'type' => '/'.FACEBOOK_PAGE_ID.'/feed/',
	    		'attachment' => json_encode(array(
	    			'access_token' => FACEBOOK_ACCESS_TOKEN,
					'message' => 'User123 a posté une nouvelle photo !',
					'name' => 'Nom du lieu',
					'caption' => 'Découvrez la photo de User123.',
					'link' => 'http://www.find-it-out.fr',
					'description' => 'Description du lieu...',
					'picture' => $urlNewImage,
					'actions' => array(
						array('name' => 'Découvrir le lieu', 'link' => 'http://www.find-it-out.fr')
					)
	    		))
	    	);

			$sql->prepare('INSERT INTO api_facebook (type,attachment) VALUES (:type,:attachment)');
			$sql->bindValue('type',$facebook['type'],PDO::PARAM_STR);
			$sql->bindValue('attachment',$facebook['attachment'],PDO::PARAM_STR);
			$sql->execute();
	    }else{
	    	echo($erreur);
	    }
	}


	if (isset($_FILES['videoFile']) && $_FILES["videoFile"]["error"] == 0){

		unset($erreur);

		$destinationDirectory   = '/var/www/illio.fr/web/projet_html/tests_erwan/uploads/';
		$destinationURL   		= 'http://www.find-it-out.fr/tests_erwan/uploads/';

		$typesValides = ['video/webm','video/mp4','video/ogg'];

		$videoName      = str_replace(' ','-',strtolower($_FILES['videoFile']['name']));
	    $videoSize      = filesize($_FILES['videoFile']['tmp_name']);
	    $tempVideo      = $_FILES['videoFile']['tmp_name'];
	    $videoType      = $_FILES['videoFile']['type'];

	    $videoName = preg_replace('/([^.a-z0-9]+)/i', '-', $videoName);

	    if(intval($videoSize)<10485760){ // 10Mo

		    if(in_array($videoType, $typesValides)){

		    	if(move_uploaded_file($_FILES['videoFile']['tmp_name'], $destinationDirectory.$videoName)){
		    		echo('Votre vidéo a bien été ajoutée.');
		    		echo('<br/><video controls src="'.$destinationURL.$videoName.'"></video>');
		    	}else{
		    		$erreur = 'Erreur lors de l\'upload de votre vidéo.';
		    	}

		    }else{
		    	$erreur = 'Le format de vidéo n\'est pas accepté. Votre vidéo doit être encodée aux formats .webm .mp4 ou .ogg';
		    }

		}else{
			$tailleMo = round($videoSize/1024/1024,1);
			$erreur = 'La taille de la vidéo ne doit pas dépasser 10Mo. Le fichier que vous avez envoyé fait '.$tailleMo.'Mo.';
		}

	    if(isset($erreur)){
	    	echo($erreur);
	    }
	}

	if(!(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')){

?>

<html>
<head>
	<title>Test uploads</title>
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <style type="text/css">
	    .conteneur_progress_bar{
			border: 1px solid #0099CC;
			padding: 1px; 
			position:relative;
			width:400px;
			border-radius: 3px;
			margin: 10px;
			display:none;
			text-align:left;
		}
		.progress_bar{
			height:20px;
			border-radius: 3px;
			background-color: #003333;
			width:1%;
		}
		.progress_value{
			top:3px;
			left:50%;
			position:absolute;
			display:inline-block;
			color: #000000;
		}
    </style>
</head>
<body>

	<div id="form_photo">
		<p>Photo</p>
		<form enctype="multipart/form-data" action="upload_photos_videos.php" method="post">
			<input type="file" name="imageFile" accept="image/*" id="cameraInput">
			<input type="submit" value="Upload">
		</form>
		<div class="conteneur_progress_bar">
			<div class="progress_bar"></div>
			<div class="progress_value">0%</div >
		</div>
	</div>

	<div id="form_video">
		<p>Vidéo</p>
		<form enctype="multipart/form-data" action="upload_photos_videos.php" method="post">
		  <input type="file" name="videoFile" accept="video/*" />
		  <input type="submit" value="Upload">
		</form>
		<div class="conteneur_progress_bar">
			<div class="progress_bar"></div>
			<div class="progress_value">0%</div >
		</div>
	</div>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="js/jquery.form.js"></script>
	<script type="text/javascript" src="js/upload_photos_videos.js"></script>
</body>
</html>

<?php
	}
?>