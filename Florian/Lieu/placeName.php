<?php
	include_once('config.php');
	
	//On récupère la valeur de l'id passé par l'url
	$id_lieu = $_GET['id'];
	$id_user = 13;
	
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
	</style>
</head>
<body>
	<canvas id="canvas" height="200" width="200"></canvas>
	<?php
		///////Vérification si l'id_user a déjà voté
		
		$reqVote = $dbh->prepare("SELECT COUNT(like.id_user), COUNT(dislike.id_user) FROM `like`, `dislike` WHERE like.id_lieu LIKE :id_lieu AND like.id_user LIKE :id_user AND dislike.id_lieu LIKE :id_lieu AND dislike.id_user LIKE :id_user");
			$reqVote->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
			$reqVote->bindValue('id_user',$id_user,PDO::PARAM_INT);
		$reqVote->execute();
		$resultLike = $reqVote->fetch();
		
		if($resultLike[0] == 0 && $resultLike[1] == 0){
	?>
	<input type="button" id="buttonLike" value="Like" onclick="envoyerLike(lieu,user)"/>
	<input type="button" id="buttonDislike" value="Dislike" onclick="envoyerDislike(lieu,user)"/>
	<?php
		}
		else {
			echo 'vous avez déjà voté';
		}
	?>
	
	<script>
	
	var lieu = <?php echo $id_lieu; ?>;
	var user = <?php echo $id_user; ?>;
	$(function() {
		$.post('../PHP.php',
			{
				lieu : lieu
			},
			function(reponse) { 
				var string = reponse.split('-');
				var nblike = parseInt(string[0]);
				var nbdislike = parseInt(string[1]);
				var doughnutData = [
			{
				value: nblike,
				color:"blue"
			},
			{
				value : nbdislike,
				color : "red"
			}			
		];

		var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData);
			}
			
		);	
	});
	
	</script>

	
<?php	
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
?>
	<div class="leave_comment">
	<h3>Répondre</h3>
	<form method="post" action="../Comments/addComments.php" id="formCom">
		<input type="hidden" name="id_user" value="<?php echo $id_user ?>"/>
		<input type="hidden" name="id_lieu" value="<?php echo $id_lieu ?>"/>
		<p><textarea id="comments" name="message" placeholder="Commentaire" required></textarea></p>
		<p class="submit"><button>Envoyer</button></p>
	</form>
</div>	
</body>
</html>