<?php
	//session_start();

	$tab_reponse = array();
	$tab_reponse['lieux'] = array();
	
	if(isset($_POST['lt']) && !empty($_POST['lt']) && isset($_POST['lg']) && !empty($_POST['lg'])){
		define('CLIENT_ID','BYGSXFM0KZPIK5C0DAFFNJ15T4J4SLKOMPFGYBOH5ADFNKN1');
		define('CLIENT_SECRET','1Y5D5K4JCLYULPQDKXL2ZQVJIACFDN1L4ROCG1UC4QMM11UI');

		$html='';
		$json = file_get_contents('https://api.foursquare.com/v2/venues/search?ll='.$_POST['lt'].','.$_POST['lg'].'&categoryId=4d4b7104d754a06370d81259&limit=50&radius=500&intent=browse&client_id='.CLIENT_ID.'&client_secret='.CLIENT_SECRET.'&v='.date("Ymd"));
		$venues = json_decode($json,true);

		if(isset($venues['meta']['code'])){
			$tab_reponse['code'] = $venues['meta']['code'];

			if(is_array($venues) && count($venues)>0 && $venues['meta']['code']=='200'){
				foreach($venues['response']['venues'] as $v){
					array_push($tab_reponse['lieux'],array('id'=>$v['id'], 'name'=>$v['name'], 'location'=>$v['location']));
				}
			}
		}else{
			$tab_reponse['code'] = 404;
		}
		
	}else{
		$tab_reponse['code'] = 0;
	}

	echo(json_encode($tab_reponse));

?>