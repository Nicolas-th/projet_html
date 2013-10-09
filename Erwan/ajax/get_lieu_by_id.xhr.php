<?php

	$retour = array();
	$retour['code'] = 0;
	$retour['infos'] = array();

	if(isset($_POST['id_lieu'])){
		define('CHEMIN_REQUIRES','../');
		require_once(CHEMIN_REQUIRES.'includes/header.inc.php');

		$id = intval($_POST['id_lieu']);

		$sql = new SQL();
		$sql->prepare('SELECT * FROM LIEUX WHERE id=:id');
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