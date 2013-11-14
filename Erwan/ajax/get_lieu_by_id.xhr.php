<?php

	$retour = array();
	$retour['code'] = 0;
	$retour['infos'] = array();

	if(isset($_POST['id_lieu'])){
		require_once('../includes/config.inc.php');
		require_once('../classes/sql.class.php');
		require_once('../includes/functions.inc.php');

		$id = intval($_POST['id_lieu']);

		$sql = new SQL();
		$sql->prepare('SELECT * FROM places WHERE id=:id');
		$sql->bindValue('id',$id,PDO::PARAM_INT);

		$infos_lieu = $sql->execute(true);

		if($infos_lieu!=false && is_array($infos_lieu)){
			$retour['infos'] = $infos_lieu[0];
			$retour['code'] = 200;
		}else{
			$retour['code'] = 404;
		}
		
	}

	echo(json_encode($retour));


?>