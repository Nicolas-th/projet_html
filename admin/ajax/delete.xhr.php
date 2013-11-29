<?php
	require_once('../../config/config.php');
	
	if(isset($_POST['id'])){
		$id = $_POST['id'];
		
		$reqDelete1 = $dbh->prepare("DELETE FROM comments WHERE users_id LIKE :id");
			$reqDelete1->bindValue("id", $id, PDO::PARAM_INT);
		$reqDelete1->execute();
		
		$reqDelete2 = $dbh->prepare("DELETE FROM like WHERE id_user LIKE :id");
			$reqDelete2->bindValue("id", $id, PDO::PARAM_INT);
		$reqDelete2->execute();
		
		$reqDelete3 = $dbh->prepare("DELETE FROM dislike WHERE id_user LIKE :id");
			$reqDelete3->bindValue("id", $id, PDO::PARAM_INT);
		$reqDelete3->execute();
		
		$reqDelete4 = $dbh->prepare("DELETE FROM media WHERE users_id LIKE :id");
			$reqDelete4->bindValue("id", $id, PDO::PARAM_INT);
		$reqDelete4->execute();
		
		$reqDelete5 = $dbh->prepare("DELETE FROM place WHERE id_user LIKE :id");
			$reqDelete5->bindValue("id", $id, PDO::PARAM_INT);
		$reqDelete5->execute();
		
		$reqDelete = $dbh->prepare("DELETE FROM users WHERE id LIKE :id");
			$reqDelete->bindValue("id", $id, PDO::PARAM_INT);
		$reqDelete->execute();
		
		echo 0;
	}
	else {
		echo 1;
	}
?>