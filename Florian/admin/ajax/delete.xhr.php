<?php
	require_once('../../config/config.php');
	
	if(isset($_POST['id'])){
		$id = $_POST['id'];
		
		$reqDelete = $dbh->prepare("DELETE FROM users WHERE id LIKE :id");
			$reqDelete->bindValue("id", $id, PDO::PARAM_INT);
		$reqDelete->execute();
	}
?>