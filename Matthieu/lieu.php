<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="assets/css/lieu.css" />
		<link rel="stylesheet" type="text/css" href="assets/css/simplegrid-lieu.css" />
	</head>
	<body>
		<div id="container-lieu">
			<div class="grid">
				<img src="assets/img/place_cover.png" id="photo-lieu" alt="photo du lieu">
			</div>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<h1>Rue des Frigos</h1>
				</div>
			</div>
			<hr/>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<div id="adresse">
						<img src="assets/img/icone-lieu.png" id="icone-lieu" alt="icone du lieu"> 
						<h2>27 rue des Frigos, Paris</h2>
					</div>
				</div>
			</div>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<p id="description">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>
			</div>

			<div class="grid grid-pad">
				<div class="col-1-1">
					<div id="votes">
						<div id="votes-positifs"><strong>75</strong> aiment ce lieu</div>
						<div id="container-canvas">
                			<img id="canvas" src="assets/img/canvas.png" alt="#">
                		</div>
						<div id="votes-negatifs"><span style="color:#ff850b; font-weight:bold;">25</span> n'ont pas aimé.</div>
					</div>
				</div>
				<div class="col-1-1">
					<div id="button-validate">
							<input type="button" id="buttonLike" value="Like" onclick="envoyerLike(lieu,user)"/> 
							<input type="button" id="buttonDislike" value="Dislike" onclick="envoyerDislike(lieu,user)"/> 
					</div>
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
					<img id="voir-photos" src="assets/img/bouton-photos.png" alt="Bouton 'voir plus de photos'">
				</div>
			</div>

			<div class="grid grid-pad">
				<p id="voir-commentaires">Voir les commentaires</p>
			</div>

			<div class="grid grid-pad">
				<div id="leave-comment">
	        		<h3>Répondre</h3>
	       			<form method="post" action="../Comments/addComments.php" id="formCom">
	                	<input type="hidden" name="id_user" value="<?php echo $id_user; ?>"/>
	                	<input type="hidden" name="id_lieu" value="<?php echo $id_lieu; ?>"/>
	                	<p><textarea id="comments" name="message" placeholder="Commentaire" required></textarea></p>
	                	<p class="submit"><button>Envoyer</button></p>
	       			</form>
				</div>
			</div>

		</div><!-- #container-lieu -->			