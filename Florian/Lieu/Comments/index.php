<?php
	$id_user = 7;
	$id_lieu = 8;
	
	include_once('config.php');
	include_once('functionPHP.php');
	
	displayComments($id_lieu);
?>
<!DOCTYPE html>
<head>
 	<meta charset="UTF-8" />
 	<meta http-equiv="X-UA-Compatible" content="IE=edge">
 	
		<title>Système de commentaires</title>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="AJAX.js"></script>
		
		<meta name="description" content="">
		
		<meta name="viewport" content="width=device-width,initial-scale=1">
		
	</head>
	<body>
		<script>
		</script>
		
   <div class="leave_comment">
    	<h3>Répondre</h3>
    		<form method="post" action="addComments.php" id="formCom">
    			<input type="hidden" name="id_user" value="<?php echo $id_user ?>"/>
    			<input type="hidden" name="id_lieu" value="<?php echo $id_lieu ?>"/>
	    		<p><textarea id="comments" name="message" placeholder="Commentaire" required></textarea></p>
	    		<p class="submit"><button>Envoyer</button></p>
	    	</form>
   </div>	
		
   </body>
</html>