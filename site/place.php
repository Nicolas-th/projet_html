<?php
	session_start();
	require_once('config/config.php');
	require_once('includes/functions.inc.php');
	require_once('classes/Mobile_Detect.class.php');

	/*-------- SÉLÉCTION DES INFORMATION DE L'UTILISATEUR -------*/
	require_once('includes/profile.inc.php');

	if(!isset($_GET['id'])){
		header("HTTP/1.1 301 Moved Permanently");
   		header('Location : '.$chemin_relatif_site.'index.php');
		exit;
	}

	//On récupère la valeur de l'id passé par l'url
	$id_lieu = $_GET['id'];

	$reqExistPlace = $dbh->prepare("SELECT * FROM places WHERE id=:id_lieu");
	$reqExistPlace->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
	$reqExistPlace->execute();
	$existPlace = $reqExistPlace->fetch();

	if($existPlace==false){
   		header('Location : '.$chemin_relatif_site.'index.php');
		exit;
	}

	$detectMobile = new Mobile_Detect();
 

	// Si un commentaire est posté
	if(isset($_POST['message']) && isset($_SESSION['id'])){
		$id_user = $_SESSION['id'];
		$message = $_POST['message'];
		$valid = 0;
	
		$reqComment = $dbh->prepare("INSERT INTO comments VALUES('',:message,NOW(),:valid,:id_user,:id_lieu)");
			$reqComment->bindValue('message',$message,PDO::PARAM_STR);
			$reqComment->bindValue('valid',$valid,PDO::PARAM_INT);
			$reqComment->bindValue('id_user',$id_user,PDO::PARAM_INT);
			$reqComment->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
		$reqComment->execute();
	}
	
	//On récupère les informations du lieu demandé
	$reqPlace = $dbh->prepare("SELECT * FROM places WHERE id=:id_lieu");
		$reqPlace->bindValue('id_lieu',$id_lieu,PDO::PARAM_STR);
	$reqPlace->execute();
	
	$result = $reqPlace->fetch();

	$reqCover = $dbh->prepare("SELECT * FROM media WHERE places_id=:id_lieu AND type='img' AND cover=1");
		$reqCover->bindValue('id_lieu',$id_lieu,PDO::PARAM_STR);
	$reqCover->execute();
	
	$infosCover = $reqCover->fetch(PDO::FETCH_ASSOC);

	$cover = $chemin_relatif_site.'assets/img/place_cover.png';
	if(isset($infosCover['url_file'])){
		$url_cover = getUrlMedia($infosCover['url_file'],$infosCover['places_id'],$infosCover['type']);
		if(is_file($chemin_absolu.$url_cover)){
			$cover = $url_cover;
		}
	}
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title><?php echo $result['name'] ?></title>
		<meta name="viewport" content="initial-scale=1.0">
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/global.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/place.css" />
		<link rel="stylesheet" type="text/css" href="<?php echo($chemin_relatif_site); ?>assets/css/simplegrid-lieu.css" />
	</head>
	<body>
		<?php if(!(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')) { ?>
			<header>
		  	<?php if(isset($_SESSION["id"])){ ?>
				<a href="logout.php"><div class="icon"></div></a>
			<?php }else{ ?>
				<a href="index.php" class="connexion">Connexion</a>
			<?php } ?>
		  	</header>
		  	<a href="index.php" id="bouton">Accueil</a> 
		<?php } ?>
		<div id="container-lieu" data-id="<?php echo $id_lieu; ?>">

			<div class="grid cover">
				<img src="<?php echo($cover) ?>" alt="photo du lieu">
			</div>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<h1><?php echo $result['name']; ?></h1>
				</div>
			</div>
			<hr/>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<div id="adresse">
						<img src="<?php echo($chemin_relatif_site); ?>assets/img/icone-lieu.png" id="icone-lieu" alt="icone du lieu"> 
						<?php echo '<h2>'.$result['address'].', '.$result['city'].'</h2>'; ?>
					</div>
				</div>
			</div>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<p id="description">
						<?php echo $result['description']; ?>
					</p>
				</div>
			</div>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<div id="votes">
						<div id="votes-positifs">
							<?php 
								if(positiverate($dbh,$id_lieu) == 0){
									echo '0 vote positif';
								}
								else if(positiverate($dbh,$id_lieu) == 1){
									echo '<strong>'. positiverate($dbh,$id_lieu).'</strong> aime ce lieu';
								}
								else {
									echo '<strong>'. positiverate($dbh,$id_lieu).'</strong> aiment ce lieu';
								}
							?>	
						</div>
						<div id="container-canvas">
							<canvas id="canvas" width="115" height="115"></canvas>
                		</div>
						<div id="votes-negatifs">
							<?php 
								if(negativerate($dbh,$id_lieu) == 0){
									echo '0 vote négatif';
								}
								else if(negativerate($dbh,$id_lieu) == 1){
									echo '<span style="color:#ff850b; font-weight:bold;">'. negativerate($dbh,$id_lieu).'</span> n\'a pas aimé';
								}
								else {
									echo '<span style="color:#ff850b; font-weight:bold;">'. negativerate($dbh,$id_lieu).'</span> n\'ont pas aimé';
								}
							?>
						</div>
					</div>
				</div>
				<div class="col-1-1">
					<?php
						///////Vérification si l'id_user a déjà voté

						if(isset($_SESSION['id'])){
							$id_user = $_SESSION['id'];
							
							$reqVoteLike = $dbh->prepare("SELECT COUNT(id_user) AS nblikes FROM `like` WHERE id_lieu=:id_lieu AND id_user=:id_user");
								$reqVoteLike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
								$reqVoteLike->bindValue('id_user',$id_user,PDO::PARAM_INT);
							$reqVoteLike->execute();
							$resultLike = $reqVoteLike->fetch(PDO::FETCH_ASSOC);
							
							$reqVoteDislike = $dbh->prepare("SELECT COUNT(id_user) AS nbdislikes FROM `dislike` WHERE id_lieu=:id_lieu AND id_user=:id_user");
								$reqVoteDislike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
								$reqVoteDislike->bindValue('id_user',$id_user,PDO::PARAM_INT);
							$reqVoteDislike->execute();
							$resultDislike = $reqVoteDislike->fetch(PDO::FETCH_ASSOC);
						
							if($resultLike['nblikes'] == 0 && $resultDislike['nbdislikes'] == 0){
					?>
							<div id="button-validate">
								<input type="button" id="buttonLike" value="Like"/> 
								<input type="button" id="buttonDislike" value="Dislike"/> 
							</div>
					<?php
							}else {
								echo '<div id="button-validate"><br>Vous avez déjà voté</div>';
							}
						}
					?>
				</div>
			</div>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<div id="photos-lieu">
						<img class="photo-lieu" src="" alt="">
						<img class="photo-lieu" src="" alt="">
						<img class="photo-lieu" src="" alt="">
						<img class="photo-lieu" src="" alt="">
						<img class="photo-lieu" src="" alt="">
						<img class="photo-lieu" src="" alt="">
					</div>
				</div>
				<div class="col-1-1">
					<img id="voir-photos" src="<?php echo($chemin_relatif_site); ?>assets/img/bouton-photos.png" alt="Bouton 'voir plus de photos'">
				</div>
			</div>

			<?php if(isset($_SESSION['id']) && $detectMobile->isMobile()){ ?>

			<div class="grid grid-pad" id="upload_medias">
				<div id="form_photo">
					<form enctype="multipart/form-data" action="<?php echo($chemin_relatif_site); ?>ajax/upload_photos_videos.xhr.php" method="post">
						<div>
							<input type="file" name="imageFile" accept="image/*">
						</div>
						<input type="hidden" name="id_lieu" value="<?php echo($id_lieu) ?>">
						<input type="submit" value="Charger une photo">
					</form>
				</div>

				<div id="form_video">
					<form enctype="multipart/form-data" action="<?php echo($chemin_relatif_site); ?>ajax/upload_photos_videos.xhr.php" method="post">
						<div>
					  		<input type="file" name="videoFile" accept="video/*" />
					  	</div>
					  	<input type="hidden" name="id_lieu" value="<?php echo($id_lieu) ?>">
					 	<input type="submit" value="Charger une vidéo">
					</form>
				</div>
				<div class="conteneur_progress_bar">
					<div class="progress_bar"></div>
					<div class="progress_value">0%</div >
				</div>
			</div>

			<?php } ?>

			<div class="grid grid-pad">

				<?php if(isset($_SESSION['id'])){ ?>
				<div id="leave-comment">
					<div>	
						<?php 
							$avatar = getUrlAvatar($profile['avatar']);
							echo('<img src="'.$avatar.'" alt="Avatar de '.$profile['nickname'].'">');
						?>
					</div>
					<div>
		        		<h3>Laisser un commentaire</h3>
		       			<form method="post" action="">
		                	<textarea name="message"></textarea>
		                	<input type="submit" value="Envoyer">
		       			</form>
		       		</div>
				</div>
				<?php }?>
			</div>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<?php 
					$reqDisplay = $dbh->prepare("SELECT comments.*, users.nickname, users.avatar FROM comments LEFT JOIN users ON comments.users_id = users.id WHERE places_id LIKE :id_lieu ORDER BY date_comment DESC LIMIT 0,6");
					$reqDisplay->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
					$reqDisplay->execute();
					
					$has_res = false;
					$cpt=0;
					while($result = $reqDisplay->fetch()){
						if($cpt<5){
							echo(structureCommentaire($result,((isset($_SESSION['id'])?true:false)),$cpt));
							$has_res = true;	
						}
						$cpt++;
					}
					if(!$has_res){
						echo 'Il n\'y a pas de commentaires sur ce lieu';
					}
					$reqDisplay->closeCursor();
					?>
				</div>
				<?php 
					if($cpt>5){ 
						echo('<a id="voir-commentaires">Plus de commentaires</a');
					}
				?>
			</div>
		</div><!-- #container-lieu -->
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
		<script type="text/javascript" src="<?php echo($chemin_relatif_site); ?>js/jquery.form.js"></script>
		<script type="text/javascript" src="<?php echo($chemin_relatif_site); ?>js/chart.js"></script>
		<script type="text/javascript" src="<?php echo($chemin_relatif_site); ?>js/place.js"></script>
		<script>
			  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			  ga('create', 'UA-46020182-1', 'find-it-out.fr');
			  ga('send', 'pageview');

		</script>
	</body>
</html>			