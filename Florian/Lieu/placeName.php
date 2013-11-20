<?php
	include_once('config.php');
	
	//On récupère la valeur de l'id passé par l'url
	$id_lieu = $_GET['id'];
	
	$id_user = 19;
	
	//On récupère les informations du lieu demandé
	$reqPlace = $dbh->prepare("SELECT * FROM places WHERE id LIKE :id_lieu");
		$reqPlace->bindValue('id_lieu',$id_lieu,PDO::PARAM_STR);
	$reqPlace->execute();
	
	$result = $reqPlace->fetch();
	
	print_r($result);
	
	echo '<h1>'.$result['name'].'</h1>';
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="../Chart.js"></script>
	<script src="../AJAX.js"></script>
	
	<style>
		canvas{
		}
		body {
			background-color: A8A8A8;
		}
	</style>
</head>
<body>
	<div name="graph">
		<canvas id="canvas" height="200" width="200"></canvas>
	</div>
	<?php
		/////Affichage du  nombre de like et de dislike
		$null = 0;
		$reqNbLike = $dbh->prepare("SELECT COUNT(*) FROM `like` WHERE id_lieu LIKE :id_lieu");
			$reqNbLike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
		$reqNbLike->execute();
		$resultNbLike = $reqNbLike->fetch();
		
		if($resultNbLike[0] == 0){
			$null = $null + 1;
		}
		else if($resultNbLike[0] == 1){
			echo  $resultNbLike[0].' utilisateur aime ce lieu';
		}
		else {
			echo $resultNbLike[0].' utilisateurs aiment ce lieu<br/>';
		}
		
		$reqNbDislike = $dbh->prepare("SELECT COUNT(*) FROM `dislike` WHERE id_lieu LIKE :id_lieu");
			$reqNbDislike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
		$reqNbDislike->execute();
		$resultNbDislike = $reqNbDislike->fetch();
		
		if($resultNbDislike[0] == 0){
			$null = $null + 1;
		}
		else if($resultNbDislike[0] == 1){
			echo $resultNbDislike[0].' utilisateur n\'aime pas ce lieu';
		}
		else {
			echo $resultNbDislike[0].' utilisateurs n\'aiment pas ce lieu<br/>';
		}
		
		if($null == 2  ){
			echo '<div id="result">Ce lieu n\'a pas encore de vote. Soyez le premier à voter</div>';
		}
		
		
		////FIN de la gestion de l'affichage des like et dislike
	
	
		///////Vérification si l'id_user a déjà voté
		
		$reqVoteLike = $dbh->prepare("SELECT COUNT(id_user) FROM `like` WHERE id_lieu LIKE :id_lieu AND id_user LIKE :id_user");
			$reqVoteLike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
			$reqVoteLike->bindValue('id_user',$id_user,PDO::PARAM_INT);
		$reqVoteLike->execute();
		$resultLike = $reqVoteLike->fetch();
		
		$reqVoteDislike = $dbh->prepare("SELECT COUNT(id_user) FROM `dislike` WHERE id_lieu LIKE :id_lieu AND id_user LIKE :id_user");
			$reqVoteDislike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
			$reqVoteDislike->bindValue('id_user',$id_user,PDO::PARAM_INT);
		$reqVoteDislike->execute();
		$resultDislike = $reqVoteDislike->fetch();
		
		if($resultLike[0] == 0 && $resultDislike[0] == 0){
	?>
		<div id="buttonValidate">
			<input type="button" id="buttonLike" value="Like" onclick="envoyerLike(lieu,user)"/>
			<input type="button" id="buttonDislike" value="Dislike" onclick="envoyerDislike(lieu,user)"/>
		</div>
	<?php
		}
		else {
			echo '<br>vous avez déjà voté';
		}
		
		////FIN de gestion du système de vote
	?>
		
	
	<script>
	
	////FONCTION AJAX qui gère l'affichage du dougnhnut de vote
	
	var lieu = <?php echo $id_lieu; ?>;
	var user = <?php echo $id_user; ?>;
	$(function() {
		$.post('../PHP.php',
			{
				lieu : lieu,
			},
			function(reponse) { 
				var string = reponse.split('-');
				var nblike = parseInt(string[0]);
				var nbdislike = parseInt(string[1]);
				var doughnutData = [
			{
				value: nblike,
				color:"white"
			},
			{
				value : nbdislike,
				color : "#FF8E00"
			}			
		];

		var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData);
			}
			
		);	
	});
	////////FIN de la fonction AJAX
	</script>

	
<?php	
	//////FONCTION upload de photo
	
	///////FIN de la fonction d'upload
	
	
	//////FONCTION qui gère l'ajout de commentaire
	echo '<h2>Commentaires</h2>';
	
	function displayComments($dbh, $lieu){
		$reqDisplay = $dbh->prepare("SELECT comments.*, users.nickname FROM comments LEFT JOIN users ON comments.users_id = users.id WHERE places_id LIKE :id_lieu AND valid = 1 ORDER BY date_comment ASC");
			$reqDisplay->bindValue('id_lieu',$lieu,PDO::PARAM_INT);
		$reqDisplay->execute();
		
		$has_res = false;
		while($result = $reqDisplay->fetch()){
			echo($result['nickname'].' : ');	
			echo($result['content'] . ' ');
			echo('<a href="../Comments/signaler.php?id=' . $result['id'] . '">Signaler</a>');
			echo('<br/>');
			$has_res = true;		
		}
		if(!$has_res){
			echo 'il n\'y a pas de commentaires sur ce lieu';
		}
		$reqDisplay->closeCursor();
	}
	
	displayComments($dbh, $id_lieu);
	///FIN de la fonction commentaire
?>
	<div class="leave_comment">
	<h3>Répondre</h3>
	<form method="post" action="../Comments/addComments.php" id="formCom">
		<input type="hidden" name="id_user" value="<?php echo $id_user; ?>"/>
		<input type="hidden" name="id_lieu" value="<?php echo $id_lieu; ?>"/>
		<p><textarea id="comments" name="message" placeholder="Commentaire" required></textarea></p>
		<p class="submit"><button>Envoyer</button></p>
	</form>
</div>	
</body>
</html>