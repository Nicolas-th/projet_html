<?php
	function displayUsers($dbh){
		$reqUsers = $dbh->prepare("SELECT id, name, surname, avatar, birthday, email, date_signin, facebook_key FROM users");
		$reqUsers->execute();
		
		while($result = $reqUsers->fetch()){
			echo '<div class="span3 margin-top">';
		    echo '<img src="'.getUrlAvatar($result['avatar']).'">';
		    echo '<h4>'.$result['surname'].'_'.$result['name'].'</h4><br/>';
		    echo '<strong>Prénom Nom :</strong> '.$result['surname'].' '.$result['name'].'<br/>';
		    echo '<strong>Date de Naissance :</strong> '.$result['birthday'].'<br/>';
		    echo '<strong>Mail :</strong></strong> '.$result['email'].'<br/>';
		    echo '<button class="btn btn-lg btn-danger" type="button" href="ajax/delete.xhr.php?id='.$result['id'].'" id="'.$result['id'].'">Bloquer</button>';
		    echo '</div>';
		}
	}
	
	function displayPlaces($dbh){
		$reqPlaces = $dbh->prepare("SELECT id, name, description, address, postcode, city FROM places");
		$reqPlaces->execute();
		
		while($result = $reqPlaces->fetch()){
			echo '<div class="span4 margin-top">';
	        echo '<img src="img/img-place.jpg">';
	        echo '<h4>'.$result['name'].'</h4><br/>';
	        echo '<strong>Adresse :</strong> '.$result['address'].', '.$result['postcode'].' '.$result['city'].'<br/>';
	        echo '<strong>Description :</strong> '.$result['description'].' <br/>';
	        $positif = positiverate($dbh,$result['id']);
	        $negatif = negativerate($dbh,$result['id']);
	        echo $positif.' <strong>votes positifs </strong> /';
	        echo $negatif.' <strong>votes négatifs </strong> <br/>';
	        echo '<button class="btn btn-lg btn-danger" type="button">Supprimer</button>';
	        echo '</div>';
      	}
	}
	
	// Fonction qui retourne l'url de l'avatar (Facebook ou local)
	function getUrlAvatar($chemin){
		global $src_avatar;
		global $chemin_relatif_site;
		$components = parse_url($chemin);
		if(isset($components['host'])){
			$url_complete = $chemin;
		}else{
			$url_complete = $chemin_relatif_site.$src_avatar.$chemin;
		}
		return $url_complete;
	}
	
	function positiverate($dbh,$id_lieu){
		$reqNbLike = $dbh->prepare("SELECT COUNT(*) FROM `like` WHERE id_lieu LIKE :id_lieu");
			$reqNbLike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
		$reqNbLike->execute();
		$resultNbLike = $reqNbLike->fetch();
		
		return $resultNbLike[0];
	}	
		
	function negativerate($dbh,$id_lieu){
		$reqNbDislike = $dbh->prepare("SELECT COUNT(*) FROM `dislike` WHERE id_lieu LIKE :id_lieu");
			$reqNbDislike->bindValue('id_lieu',$id_lieu,PDO::PARAM_INT);
		$reqNbDislike->execute();
		$resultNbDislike = $reqNbDislike->fetch();
		
		return $resultNbDislike[0];
	}
?>