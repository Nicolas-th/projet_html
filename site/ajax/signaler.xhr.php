<?php
	require_once('../config/config.php');
	
	if(isset($_POST['id'])){
		$id = $_POST['id'];
		
		$reqSignalComment = $dbh->prepare("UPDATE comments SET valid = 1 WHERE id LIKE :id");
		$reqSignalComment->bindValue('id',$id,PDO::PARAM_INT);
		$reqSignalComment->execute();
	}
?>