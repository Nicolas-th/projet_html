<?php

	session_start();

	require_once('includes/config.inc.php');
	require_once('includes/functions.inc.php');

	if (isset($_FILES['imageFile']) && $_FILES["imageFile"]["error"] == 0){

		$destinationDirectory   = '/var/www/illio.fr/web/projet_html/tests_erwan/uploads/';
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

		    if(resizeImage($currentWidth,$currentHeight,$imageMaxSize,$destNewImage,$createdImage,$quality,'image/jpeg')){
				echo('OK');
		    }else{
		        $erreur = 'Resize Error';
		    }

	    }

	    if(!isset($erreur)){
	    	$_SESSION['upload_flickr'] = $destNewImage;
			$_SESSION['upload_twitter'] = $destNewImage;
	    }else{
	    	echo($erreur);
	    }
	}


	/* Réseaux sociaux */

	if(isset($_SESSION['upload_flickr'])){
		require_once('lib/flickr/phpFlickr.php');
		$flickr = new phpFlickr(FLICKR_APP_KEY, FLICKR_APP_KEY_SECRET);
		$flickr->setToken(FLICKR_USER_TOKEN);

		if(empty($_GET['frob'])) {
			$flickr->auth('write');

			$result = $flickr->sync_upload($_SESSION['upload_flickr'], 'test', 'Test', 'test1, test2');
			unset($_SESSION['upload_flickr']);
			//var_dump($result);
			echo('Votre photo a bien été sauvegardé ! <a href="http://www.flickr.com/photos/108169855@N05/" target="_blank">Flickr</a>');
		}
		else {
			//$flickr->auth_getToken($_GET['frob']);
			//header('Location: upload_photos_videos.php');
			//exit();
		}
	}

	if(isset($_SESSION['upload_twitter'])){

		require_once('lib/tmhOAuth/tmhOAuth.php');

		$connection = new tmhOAuth(array(
			'consumer_key' => TWITTER_CONSUMER_KEY,
			'consumer_secret' => TWITTER_CONSUMER_KEY_SECRET,
			'user_token' => TWITTER_ACCESS_TOKEN,
			'user_secret' => TWITTER_ACCESS_TOKEN_SECRET
		));


		$response_code = $connection->request( 'POST','https://api.twitter.com/1.1/statuses/update_with_media.json',
	       array(
	            'media[]'  => "@{$_SESSION['upload_twitter']};type=image/jpeg;filename={$_SESSION['upload_twitter']}",
	            'status'   => 'test3 image',
	       ),
	        true,
	        true
	    );
		 
		if ($response_code == 200) {
			echo('<br/>Tweet bien envoyé : <a href="https://twitter.com/Find_It_Out" target="_blank">Voir</a>');
		} else {
			echo('Erreur :'.$response_code.'');
		}

		unset($_SESSION['upload_twitter']);
	}

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
			<input type="file" name="imageFile" capture="camera" accept="image/*" id="cameraInput">
			<input type="submit" value="Upload">
		</form>
		<div class="conteneur_progress_bar">
			<div class="progress_bar"></div>
			<div class="progress_value">0%</div >
		</div>
	</div>


	<p>Vidéo</p>
	<form enctype="multipart/form-data" action="upload_photos_videos.php" method="post">
	  <input type="file" name="media" accept="video/*" capture />
	  <input type="submit" value="Upload">
	</form>

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="js/jquery.form.js"></script>
	<script type="text/javascript" src="js/upload_photos_videos.js"></script>
</body>
</html>