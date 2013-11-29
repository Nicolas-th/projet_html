<?php

	session_start();
	
	require_once('../config/config.php');
	require_once('../classes/sql.class.php');
	require_once('../includes/functions.inc.php');

	if(isset($_POST['id_lieu']) && isset($_SESSION['id'])){

		$id_lieu = intval($_POST['id_lieu']);
		$id_user = intval($_SESSION['id']);

		if (isset($_FILES['imageFile']) && $_FILES["imageFile"]["error"] == 0){

			$destinationDirectory   = $chemin_absolu.$chemin_relatif_site.$src_media.$id_lieu.'/'.$dir_images;
			$destinationURL   		= $host.$chemin_relatif_site.$src_media.$id_lieu.'/'.$dir_images;
			$imageMaxSize       	= 500;
			$quality           		= 90;

			$imageName      = str_replace(' ','-',strtolower($_FILES['imageFile']['name']));
		    $imageSize      = $_FILES['imageFile']['size'];
		    $tempImage      = $_FILES['imageFile']['tmp_name'];
		    $imageType      = $_FILES['imageFile']['type'];

		    if (!file_exists($destinationDirectory)) {
			    mkdir($destinationDirectory, 0777, true);
			}

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

		    	$newImageName = $id_user.'-'.time().'.jpeg';
			    $destNewImage = $destinationDirectory.$newImageName;
			    $urlNewImage = $destinationURL.$newImageName;

			    if(resizeImage($currentWidth,$currentHeight,$imageMaxSize,$destNewImage,$createdImage,$quality,'image/jpeg')){
					//echo('OK');
			    }else{
			        $erreur = 'Resize Error';
			    }

			    $profile = $dbh -> query("SELECT * FROM users WHERE id='$id_user'")->fetch();
			    $infos_lieu = $dbh -> query("SELECT * FROM places WHERE id='$id_lieu'")->fetch();

			    $retour = 'Votre image a bien été ajoutée.';

		    }

		    if(!isset($erreur)){

		    	$sql = new SQL($dbh);

		    	$is_cover = $dbh -> query("SELECT * FROM media WHERE places_id='$id_lieu' AND cover=1")->fetch();

		    	if($is_cover==false){
		    		$cover = 1;
		    	}else{
		    		$cover = 0;
		    	}

		    	$sql->prepare('INSERT INTO media (type, url_file, users_id, places_id, cover) VALUES (:type, :url_file, :users_id, :places_id, :cover)');
				$sql->bindValue('type','img',PDO::PARAM_STR);
				$sql->bindValue('url_file',$newImageName,PDO::PARAM_STR);
				$sql->bindValue('users_id',$id_user,PDO::PARAM_INT);
				$sql->bindValue('places_id',$id_lieu,PDO::PARAM_INT);
				$sql->bindValue('cover',$cover,PDO::PARAM_INT);
				$sql->execute();

				$url_lieu = $host.$chemin_relatif_site.getRewrite($infos_lieu['name'],$infos_lieu['id']);
				$message_reseaux_sociaux = $profile['nickname'].' vient d\'ajouter une photo de '.$infos_lieu['name'].'. Visitez ce lieu : '.$url_lieu;

		    	/* Flickr */

		    	$flickr = array(
		    		'type' => 'uploadPhoto',
		    		'attachment' => json_encode(array('path_image' => $destNewImage, 'title' => $infos_lieu['name'], 'description' => $message_reseaux_sociaux, 'keywords' => ''))
		    	);

		    	$sql->prepare('INSERT INTO api_flickr (type,attachment) VALUES (:type,:attachment)');
				$sql->bindValue('type',$flickr['type'],PDO::PARAM_STR);
				$sql->bindValue('attachment',$flickr['attachment'],PDO::PARAM_STR);
				$sql->execute();


				/* Twitter */

				$image = $destNewImage;
				$name  = basename($image);

				$twitter = array(
		    		'type' => 'https://api.twitter.com/1.1/statuses/update_with_media.json',
		    		'attachment' => json_encode(array(
		    			//'media[]'  => '@{'.$destNewImage.'};type=image/jpeg;filename={'.$destNewImage.'}',
		    			'media[]'  => "@{$image};type=image/jpeg;filename={$name}",
		            	'status'   => $message_reseaux_sociaux,
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
						'message' => $message_reseaux_sociaux,
						'name' => $infos_lieu['name'],
						'caption' => 'Découvrez la photo de '.$profile['nickname'],
						'link' => $url_lieu,
						'description' => $message_reseaux_sociaux,
						'picture' => $urlNewImage,
						'actions' => array(
							array('name' => 'Découvrir le lieu', 'link' => $url_lieu)
						)
		    		))
		    	);

				$sql->prepare('INSERT INTO api_facebook (type,attachment) VALUES (:type,:attachment)');
				$sql->bindValue('type',$facebook['type'],PDO::PARAM_STR);
				$sql->bindValue('attachment',$facebook['attachment'],PDO::PARAM_STR);
				$sql->execute();



				/* Publication chez les membres */

				$sql->prepare('SELECT * from users WHERE id=:id');
				$sql->bindValue('id',$id_user,PDO::PARAM_INT);
				$infos = $sql->execute(true);

				$infos_profile = $infos[0];

				if(is_array($infos_profile) && count($infos_profile)>0){

					$message_personnel = 'Je viens de poster une nouvelle photo de '.$infos_lieu['name'].'. Découvrez ce lieu :'.$url_lieu;

					/* Facebook */

					if(intval($infos_profile['facebook_post'])==1){

						$facebook = array(
				    		'type' => '/'.$infos_profile['facebook_id'].'/feed/',
				    		'attachment' => json_encode(array(
				    			'access_token' => $infos_profile['facebook_key'],
								'message' => $message_reseaux_sociaux,
								'name' => $infos_lieu['name'],
								'caption' => 'Photo partagée par '.$infos_profile['nickname'],
								'link' => $url_lieu,
								'description' => $infos_lieu['description'],
								'picture' => $urlNewImage,
								'actions' => array(
									array('name' => 'Découvrir le lieu', 'link' => $url_lieu)
								)
				    		)),
				    		'type_post' => 'user'
				    	);


						$sql->prepare('INSERT INTO api_facebook (type,attachment,type_post) VALUES (:type,:attachment,:type_post)');
						$sql->bindValue('type',$facebook['type'],PDO::PARAM_STR);
						$sql->bindValue('attachment',$facebook['attachment'],PDO::PARAM_STR);
						$sql->bindValue('type_post',$facebook['type_post'],PDO::PARAM_STR);
						$sql->execute();

					}

				}
		    }
		}


		if (isset($_FILES['videoFile']) && $_FILES["videoFile"]["error"] == 0){

			unset($erreur);

			$destinationDirectory   = $chemin_absolu.$chemin_relatif_site.$src_media.$id_lieu.'/'.$dir_videos;
			$destinationURL   		= $host.$chemin_relatif_site.$src_media.$id_lieu.'/'.$dir_videos;

			$typesValides = ['video/webm','video/mp4','video/ogg','video/quicktime'];

			$videoName      = str_replace(' ','-',strtolower($_FILES['videoFile']['name']));
		    $videoSize      = filesize($_FILES['videoFile']['tmp_name']);
		    $tempVideo      = $_FILES['videoFile']['tmp_name'];
		    $videoType      = $_FILES['videoFile']['type'];

		    $extention = end(explode(".", $videoName));

		    $videoName = $id_user.'-'.time().'.'.$extention;

		    //$videoName = preg_replace('/([^.a-z0-9]+)/i', '-', $videoName);

		    if(intval($videoSize)<10485760){ // 10Mo

			    if(in_array($videoType, $typesValides)){

			    	if (!file_exists($destinationDirectory)) {
					    mkdir($destinationDirectory, 0777, true);
					}

			    	if(move_uploaded_file($_FILES['videoFile']['tmp_name'], $destinationDirectory.$videoName)){

			    		$sql = new SQL($dbh);

			    		$sql->prepare('INSERT INTO media (type, url_file, users_id, places_id, cover) VALUES (:type, :url_file, :users_id, :places_id, :cover)');
						$sql->bindValue('type','video',PDO::PARAM_STR);
						$sql->bindValue('url_file',$videoName,PDO::PARAM_STR);
						$sql->bindValue('users_id',$id_user,PDO::PARAM_INT);
						$sql->bindValue('places_id',$id_lieu,PDO::PARAM_INT);
						$sql->bindValue('cover',0,PDO::PARAM_INT);
						$sql->execute();

			    		$retour = 'Votre vidéo a bien été ajoutée.';
			    		//echo('<br/><video controls src="'.$destinationURL.$videoName.'"></video>');
			    	}else{
			    		$erreur = 'Erreur lors de l\'upload de votre vidéo.';
			    	}

			    }else{
			    	$erreur = 'Le format de vidéo n\'est pas accepté. Votre vidéo doit être encodée aux formats .webm .mp4, .ogg ou .mov. Votre fichier vidéo est actuellement au format '.$videoType.'.';
			    }

			}else{
				$tailleMo = round($videoSize/1024/1024,1);
				$erreur = 'La taille de la vidéo ne doit pas dépasser 10Mo. Le fichier que vous avez envoyé fait '.$tailleMo.'Mo.';
			}

		}
	}

	if(isset($erreur)){
		echo($erreur);
	}else if($retour){
		echo($retour);
	}


	if(!(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')){
		header("HTTP/1.1 301 Moved Permanently");
   		header('Location : '.$chemin_relatif_site.'index.php');
		exit;
	}

?>