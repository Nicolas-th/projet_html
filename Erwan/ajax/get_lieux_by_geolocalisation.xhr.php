<?php

	$retour = array();
	$retour['code'] = 0;
	$retour['lieux'] = array();

	if(isset($_POST['points'])){
		require_once('../includes/config.inc.php');
		require_once('../classes/sql.class.php');
		require_once('../includes/functions.inc.php');


		$tab_lieux = explode(';',$_POST['points']);

		foreach($tab_lieux as $lieu){

			$infos_lieu = explode(',',$lieu);

			if(is_array($infos_lieu) && !empty($infos_lieu[0]) && !empty($infos_lieu[1])){

				$lat = floatval($infos_lieu[0]);
				$lng = floatval($infos_lieu[1]);

				$sql = new SQL();
				$sql->prepare('SELECT *,( 6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(latitude)))) AS distance FROM places HAVING distance < 100 ORDER BY distance LIMIT 0 , 20');
				$sql->bindValue('lat',$lat,PDO::PARAM_STR);
				$sql->bindValue('lng',$lng,PDO::PARAM_STR);

				$lieux = $sql->execute(true);

				if($lieux!=false){
					foreach($lieux as $l){
						$retour['lieux'][$l['id']] = $l;
					}
				}
			}

			if(count($retour['lieux'])>0){
				$retour['code'] = 200;
			}else{
				$retour['code'] = 404;
			}
		}
		
	}

	echo(json_encode($retour));


?>