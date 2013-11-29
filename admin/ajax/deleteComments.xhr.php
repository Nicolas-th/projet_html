<?php
	require_once('../../config/config.php');
	
	if(isset($_POST['id'])){
		$id = $_POST['id'];
		
		$reqDeleteComment = $dbh->prepare("");
			$reqDeleteComment->bindValue("id", $id, PDO::PARAM_INT);
		$reqDeleteComment->execute();
		
		echo 0;
	}
	else {
		echo 1;
	}
?>