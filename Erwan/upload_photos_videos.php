<?php
	if (isset($_FILES["media"]) && $_FILES["media"]["error"] == 0){
		$uploaddir = '/var/www/illio.fr/web/projet_html/tests_erwan/uploads/';
		$uploadfile = $uploaddir . basename($_FILES['media']['name']);

		echo '<pre>';
		if (move_uploaded_file($_FILES['media']['tmp_name'], $uploadfile)) {
		    echo "Le fichier est valide, et a été téléchargé
		           avec succès. Voici plus d'informations :\n";
		} else {
		    echo "Attaque potentielle par téléchargement de fichiers.
		          Voici plus d'informations :\n";
		}

		echo 'Voici quelques informations de débogage :';
		print_r($_FILES);
	}

?>

<html>
<head>
	<title>Test uploads</title>
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
</head>
<body>

	<p>Test1</p>
	<form enctype="multipart/form-data" action="upload_photos_videos.php" method="post">
		<input type="file" name="media" capture="camera" accept="image/*" id="cameraInput">
		<input type="submit" value="Upload">
	</form>


	<p>Test 2</p>
	<form enctype="multipart/form-data" action="upload_photos_videos.php" method="post">
	  <input type="file" name="media" accept="video/*" capture />
	  <input type="submit" value="Upload">
	</form>
</body>
</html>