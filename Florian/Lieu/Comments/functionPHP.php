<?php
	function displayComments($lieu){

		require_once('../config.php');
		
		$reqDisplay = $dbh->prepare("SELECT * FROM comments WHERE places_id LIKE :id_lieu");
			$reqDisplay->bindValue('id_lieu',$lieu,PDO::PARAM_INT);
		$reqDisplay->execute();
		
		while($result = $reqDisplay->fetch()){
			var_dump($result['content']);	
		}
	}
	
?>