<?php
	session_start();
	require_once('../config/config.php');
	require_once('../includes/functions.inc.php');

	if(isset($_POST['id']) && isset($_POST['limit']) && isset($_POST['lieu'])){

		$id_last = intval($_POST['id']);
		$limit = intval($_POST['limit']);
		$id_lieu = intval($_POST['lieu']);

		$retour = [];
		$retour['comments'] = '';

		$reqDisplay = $dbh->prepare("SELECT comments.*, users.nickname, users.avatar FROM comments LEFT JOIN users ON comments.users_id = users.id WHERE places_id LIKE :id_lieu ORDER BY date_comment DESC LIMIT :id_last,:limit");
		$reqDisplay->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
		$reqDisplay->bindValue('limit',$limit+1,PDO::PARAM_INT);
		$reqDisplay->bindValue('id_last',$id_last,PDO::PARAM_INT);
		$reqDisplay->execute();
		
		$has_res = false;
		$cpt=0;
		while($result = $reqDisplay->fetch()){
			$cpt++;
			if($cpt<=$limit){
				$retour['comments'] .= structureCommentaire($result,(isset($_SESSION['id'])?true:false),($id_last+$cpt));
			}
		}
		$retour['hasNext'] = (($cpt>$limit)?'1':'0');
	
		echo json_encode($retour);
	}
?>