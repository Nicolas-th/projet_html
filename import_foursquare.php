<?php
	
	require_once('config/config.php'); 
	require_once('classes/sql.class.php'); 

	define('CLIENT_ID','BYGSXFM0KZPIK5C0DAFFNJ15T4J4SLKOMPFGYBOH5ADFNKN1');
	define('CLIENT_SECRET','1Y5D5K4JCLYULPQDKXL2ZQVJIACFDN1L4ROCG1UC4QMM11UI');
	$redirect_uri='http://www.find-it-out.fr/site/import_foursquare.php';
	$date=date("Ymd");

	//$json = file_get_contents('https://api.foursquare.com/v2/lists/LIST_ID?client_id='.CLIENT_ID.'&client_secret='.CLIENT_SECRET.'&v='.date("Ymd"));
	
	if(isset($_REQUEST['code'])){

		if(isset($_POST['venues'])){
			$venues = $_POST['venues'];

			foreach($venues as $v){
				$id = $v;
				$categorie = $_POST['categorie_'.$v];
				$inout = $_POST['in_out_'.$v];

				$json = file_get_contents('https://api.foursquare.com/v2/venues/'.$id.'?client_id='.CLIENT_ID.'&client_secret='.CLIENT_SECRET.'&v='.date("Ymd"));
				$infos_venue = json_decode($json,true);

				$venue = $infos_venue['response']['venue'];

				$name = $venue['name'];
				$description = '';
				$latitude = $venue['location']['lat'];
				$longitude = $venue['location']['lng'];
				$address = $venue['location']['address'];
				$postcode = $venue['location']['postalCode'];
				$city = $venue['location']['city'];

				$sql = new SQL($dbh);
				$sql->prepare('INSERT INTO places (`name` ,`description` ,`latitude` ,`longitude` ,`address` ,`postcode` ,`city` ,`inout` ,`valid` ,`categories_id`) VALUES (:name,:description,:latitude,:longitude,:address,:postcode,:city,:inout,0,:categories_id)');
				$sql->bindValue('name',$name,PDO::PARAM_STR);
				$sql->bindValue('description',$description,PDO::PARAM_STR);
				$sql->bindValue('latitude',$latitude,PDO::PARAM_STR);
				$sql->bindValue('longitude',$longitude,PDO::PARAM_STR);
				$sql->bindValue('address',$address,PDO::PARAM_STR);
				$sql->bindValue('postcode',$postcode,PDO::PARAM_INT);
				$sql->bindValue('city',$city,PDO::PARAM_STR);
				$sql->bindValue('inout',$inout,PDO::PARAM_INT);
				$sql->bindValue('categories_id',$categorie,PDO::PARAM_INT);
				$sql->execute();

				$sql->prepare('INSERT INTO places (`name` ,`description` ,`latitude` ,`longitude` ,`address` ,`postcode` ,`city` ,`inout` ,`valid` ,`categories_id`) VALUES ("test2s","test","0","0","adresse",93100,"PARIS",0,0,0)');
				$sql->execute();


			}

		}elseif(isset($_POST['lists'])){
			$lists = $_POST['lists'];

			foreach($lists as $list){
				$json = file_get_contents('https://api.foursquare.com/v2/lists/'.$list.'?client_id='.CLIENT_ID.'&client_secret='.CLIENT_SECRET.'&v='.date("Ymd"));
				$infos_list = json_decode($json,true);

				if(isset($infos_list['response']['list']['listItems']['items'])){

					$sql = new SQL($dbh);
					$sql->prepare('SELECT * FROM categories');
					$categories = $sql->execute(true);


					$items = $infos_list['response']['list']['listItems']['items'];
					echo('<form action="" method="POST">');
					foreach($items as $item){
						echo('<input type="checkbox" name="venues[]" value="'.$item['venue']['id'].'"><label>'.$item['venue']['name'].'</label>');
						echo('<select name="categorie_'.$item['venue']['id'].'">');
						foreach ($categories as $cat) {
							echo('	<option value="'.$cat['id'].'">'.$cat['name'].'</option>');
						}
  						echo('</select>');
  						echo('<select name="in_out_'.$item['venue']['id'].'">');
  						echo('	<option value="0">Intérieur</option>');
  						echo('	<option value="1">Extérieur</option>');
  						echo('</select>');
  						echo('<br/>');
					}
					echo('	<input type="submit" value="Importer">');
					echo('</form>');
				}
			}

		}elseif(!isset($_POST['name'])){
			echo('<form action="" method="POST">');
			echo('	<label>Compte Foursquare</label><input type="text" name="name">');
			echo('	<input type="submit" value="Rechercher">');
			echo('</form>');
		}else{
			$twitter_name = $_POST['name'];
			$code=$_REQUEST['code'];
			session_start();

			if (!isset($_SESSION['access_token'])){
				$app_token_url = "https://foursquare.com/oauth2/access_token?client_id=" . CLIENT_ID ."&client_secret=" . CLIENT_SECRET . "&grant_type=authorization_code&redirect_uri=" . $redirect_uri . "&code=" . $code ;
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, $app_token_url);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				$foursquare_token = curl_exec($ch);
				curl_close($ch);
				
				// get the token and make it a session variable
				$array_token = json_decode($foursquare_token, true); 
				$token=$array_token['access_token'];
				$access_token=$_SESSION['access_token']=$token;
			} else {
				$access_token=$_SESSION['access_token'];
			}

			$json = file_get_contents('https://api.foursquare.com/v2/users/search?twitter='.$twitter_name.'&oauth_token='.$access_token.'&client_id='.CLIENT_ID.'&client_secret='.CLIENT_SECRET.'&v='.date("Ymd"));
			$infos_user = json_decode($json,true);

			if(isset($infos_user['response']['results'][0]['id'])){
				$id_user = $infos_user['response']['results'][0]['id'];

				$json = file_get_contents('https://api.foursquare.com/v2/users/'.$id_user.'/lists?oauth_token='.$access_token.'&client_id='.CLIENT_ID.'&client_secret='.CLIENT_SECRET.'&v='.date("Ymd"));
				$lists_user = json_decode($json,true);

				if(isset($lists_user['response']['lists']['groups'][0]['items'])){
					echo('<form action="" method="POST">');
					foreach($lists_user['response']['lists']['groups'][0]['items'] as $list){
						echo('<input type="checkbox" name="lists[]" id="list_'.$list['id'].'" value="'.$list['id'].'"><label for="list_'.$list['id'].'">'.$list['name'].'</label><br/>');
					}
					echo('<input type="submit" value="Importer les listes">');
					echo('</form>');
				}else{
					var_dump($lists_user);
				}
				//var_dump($lists_user);


				//$json = file_get_contents('https://api.foursquare.com/v2/lists/LIST_ID?client_id='.CLIENT_ID.'&client_secret='.CLIENT_SECRET.'&v='.date("Ymd"));
				//$lists_user = json_decode($json,true);

			}
		}

		//var_dump($venues);
	}else{
		echo('<a href="https://foursquare.com/oauth2/authenticate?client_id='.CLIENT_ID.'&response_type=code&redirect_uri='.$redirect_uri.'">Authentification</a>');
	}

	/*if(isset($venues['meta']['code'])){
		$tab_reponse['code'] = $venues['meta']['code'];

		if(is_array($venues) && count($venues)>0 && $venues['meta']['code']=='200'){
			foreach($venues['response']['venues'] as $v){
				array_push($tab_reponse['lieux'],array('id'=>$v['id'], 'name'=>$v['name'], 'location'=>$v['location']));
			}
		}
	}else{
		$tab_reponse['code'] = 404;
	}*/

?>