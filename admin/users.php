<?php
	require_once('../config/config.php');
	
	$reqUsers = $dbh->prepare("SELECT id, name, surname, nickname, birthday, email, date_signin, facebook_key FROM users");
	$reqUsers->execute();
	
	while($result = $reqUsers->fetch()){
		echo $result['id'].' '.$result['name'];
		echo '<a class="delete" href="ajax/delete.xhr.php?id='.$result['id'].'" id="'.$result['id'].'">Supprimer</a><br>';
	}
?>
		
<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>		
<script type="text/javascript" src="js/place.js"></script>
