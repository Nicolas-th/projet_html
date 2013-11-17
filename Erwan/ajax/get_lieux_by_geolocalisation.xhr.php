<?php

	$retour = array();
	$retour['code'] = 0;
	$retour['lieux'] = array();

	$_POST['points'] = '48.85,2.42';

	if(isset($_POST['points'])){
		require_once('../includes/config.inc.php');
		require_once('../classes/sql.class.php');
		require_once('../includes/functions.inc.php');

		$retour['test'] = $_POST['points'];


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

					/* API openweathermap -> permet de récupérer la méteo  */
					$url_meteo = 'http://api.openweathermap.org/data/2.5/weather?lat='.$lat.'&lon='.$lng.'&mode=json';
					$response_meteo = json_decode(file_get_contents($url_meteo),true);

					if($response_meteo!=false && $response_meteo!=null && is_array($response_meteo) && isset($response_meteo['weather'])){
						$meteo_lieux = array();
						$meteo_lieux['rapport'] = $response_meteo['weather'];

						$code_meteo = intval($response_meteo['weather'][0]['id']);
						/* Mauvais temps */
						if($code_meteo<800 || ($code_meteo>=900 && $code_meteo<950) || $code_meteo>954){
							$meteo_lieux['type_lieu'] = 0; // Intérieur
						}else{
							$meteo_lieux['type_lieu'] = 1; // Extérieur
						}
					}else{
						$meteo_lieux = [];
					}


					foreach($lieux as $l){
						$l['meteo'] = $meteo_lieux;
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