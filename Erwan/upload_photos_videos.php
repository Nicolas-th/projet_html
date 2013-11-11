<?php
	session_start();
	if (isset($_FILES["media"]) && $_FILES["media"]["error"] == 0){
		$uploaddir = '/var/www/illio.fr/web/projet_html/tests_erwan/uploads/';
		$uploadfile = $uploaddir . basename($_FILES['media']['name']);

		if (move_uploaded_file($_FILES['media']['tmp_name'], $uploadfile)) {
			$_SESSION['upload_flickr'] = $uploadfile;
			$_SESSION['upload_twitter'] = $uploadfile;
			//$_SESSION['upload_twitter'] = 'http://www.find-id-out.fr/tests_erwan/uploads/'.basename($_FILES['media']['name']);
		} else {
		    echo('Une erreur s\'est produite. Veuillez recommencer.');
		   	//print_r($_FILES);
		}
	}
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
			'consumer_key' => TWITTER_ACCESS_TOKEN,
			'consumer_secret' => TWITTER_ACCESS_TOKEN_SECRET,
			'user_token' => TWITTER_CONSUMER_KEY,
			'user_secret' => TWITTER_CONSUMER_KEY_SECRET
		));

		$response_code = $connection->request( 'POST','https://api.twitter.com/1.1/statuses/update_with_media.json',
	       array(
	            'media[]'  => "@{$_SESSION['upload_twitter']};type=image/jpeg;filename={$_SESSION['upload_twitter']}",
	            'status'   => 'test image',
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
</head>
<body>

	<p>Photo</p>
	<form enctype="multipart/form-data" action="upload_photos_videos_new.php" method="post">
		<input type="file" name="media" capture="camera" accept="image/*" id="cameraInput">
		<input type="submit" value="Upload">
	</form>


	<p>Vidéo</p>
	<form enctype="multipart/form-data" action="upload_photos_videos.php" method="post">
	  <input type="file" name="media" accept="video/*" capture />
	  <input type="submit" value="Upload">
	</form>
</body>
</html>