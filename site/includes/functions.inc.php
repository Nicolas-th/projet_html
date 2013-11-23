<?php

	/**
	 ## Fonctions sur les réseaux sociaux ##
	**/



	/**
	 ## Fonctions sur les images ##
	**/


	// Fonction redimmentionnant une immage en concervant les propotions originales
	// Source : http://www.saaraan.com/2012/05/ajax-image-upload-with-progressbar-with-jquery-and-php
	function resizeImage($CurWidth,$CurHeight,$MaxSize,$DestFolder,$SrcImage,$Quality,$ImageType){
	    //Check Image size is not 0
	    if($CurWidth <= 0 || $CurHeight <= 0)
	    {
	        return false;
	    }

	    //Construct a proportional size of new image
	    $ImageScale         = min($MaxSize/$CurWidth, $MaxSize/$CurHeight);
	    $NewWidth           = ceil($ImageScale*$CurWidth);
	    $NewHeight          = ceil($ImageScale*$CurHeight);

	    if($CurWidth < $NewWidth || $CurHeight < $NewHeight)
	    {
	        $NewWidth = $CurWidth;
	        $NewHeight = $CurHeight;
	    }
	    $NewCanves  = imagecreatetruecolor($NewWidth, $NewHeight);
	    // Resize Image
	    if(imagecopyresampled($NewCanves, $SrcImage,0, 0, 0, 0, $NewWidth, $NewHeight, $CurWidth, $CurHeight))
	    {
	        switch(strtolower($ImageType))
	        {
	            case 'image/png':
	                imagepng($NewCanves,$DestFolder);
	                break;
	            case 'image/gif':
	                imagegif($NewCanves,$DestFolder);
	                break;
	            case 'image/jpeg':
	            case 'image/pjpeg':
	                imagejpeg($NewCanves,$DestFolder,$Quality);
	                break;
	            default:
	                return false;
	        }
	    //Destroy image, frees up memory
	    if(is_resource($NewCanves)) {imagedestroy($NewCanves);}
	    return true;
	    }

	}

	// Fonction recadrant une image
	// Source : http://www.saaraan.com/2012/05/ajax-image-upload-with-progressbar-with-jquery-and-php
	function cropImage($CurWidth,$CurHeight,$iSize,$DestFolder,$SrcImage,$Quality,$ImageType){
	    //Check Image size is not 0
	    if($CurWidth <= 0 || $CurHeight <= 0)
	    {
	        return false;
	    }

	    //abeautifulsite.net has excellent article about "Cropping an Image to Make Square"
	    //http://www.abeautifulsite.net/blog/2009/08/cropping-an-image-to-make-square-thumbnails-in-php/
	    if($CurWidth>$CurHeight)
	    {
	        $y_offset = 0;
	        $x_offset = ($CurWidth - $CurHeight) / 2;
	        $square_size    = $CurWidth - ($x_offset * 2);
	    }else{
	        $x_offset = 0;
	        $y_offset = ($CurHeight - $CurWidth) / 2;
	        $square_size = $CurHeight - ($y_offset * 2);
	    }

	    $NewCanves  = imagecreatetruecolor($iSize, $iSize);
	    if(imagecopyresampled($NewCanves, $SrcImage,0, 0, $x_offset, $y_offset, $iSize, $iSize, $square_size, $square_size))
	    {
	        switch(strtolower($ImageType))
	        {
	            case 'image/png':
	                imagepng($NewCanves,$DestFolder);
	                break;
	            case 'image/gif':
	                imagegif($NewCanves,$DestFolder);
	                break;
	            case 'image/jpeg':
	            case 'image/pjpeg':
	                imagejpeg($NewCanves,$DestFolder,$Quality);
	                break;
	            default:
	                return false;
	        }
	    //Destroy image, frees up memory
	    if(is_resource($NewCanves)) {imagedestroy($NewCanves);}
	    return true;

	    }

	}

	// Création d'une nouvelle image aux dimensions identiques en remplaçant la transparence par une couleur blanche
	// Source : http://www.shesek.info/php/transform-a-transparent-png-to-white-background-jpg-using-php-gd
	function imagetranstowhite($trans) {
	    // Create a new true color image with the same size
	    $w = imagesx($trans);
	    $h = imagesy($trans);
	    $white = imagecreatetruecolor($w, $h);
	 
	    // Fill the new image with white background
	    $bg = imagecolorallocate($white, 255, 255, 255);
	    imagefill($white, 0, 0, $bg);
	 
	    // Copy original transparent image onto the new image
	    imagecopy($white, $trans, 0, 0, 0, 0, $w, $h);
	    return $white;
	}
	
	/**
	 ## Fonctions sur les pages lieux ##
	**/
	
	//Fonction qui permet de nettoyer les url
	function getRewrite($title,$id){
		global $dir_lieux;
		$title = str_replace(' ', "-", $title);
		$title = strtolower($title);
		$title .='-'.$id.'.html';
		$title = $dir_lieux.$title;
		return $title;
	}
	
	//Fonction pour afficher les commentaires en fonction du lieu
	function displayComments($dbh, $lieu){
		global $chemin_relatif_site;
		$reqDisplay = $dbh->prepare("SELECT comments.*, users.nickname FROM comments LEFT JOIN users ON comments.users_id = users.id WHERE places_id LIKE :id_lieu AND valid = 1 ORDER BY date_comment ASC");
			$reqDisplay->bindValue('id_lieu',$lieu,PDO::PARAM_INT);
		$reqDisplay->execute();
		
		$has_res = false;
		while($result = $reqDisplay->fetch()){
			echo($result['nickname'].' : ');	
			echo($result['content'] . ' ');
			echo('<a href="'.$chemin_relatif_site.'ajax/signaler.xhr.php?id=' . $result['id'] . '" class="signaler" id="'.$result['id'].'">Signaler</a>');
			echo('<br/>');
			$has_res = true;		
		}
		if(!$has_res){
			echo 'il n\'y a pas de commentaires sur ce lieu';
		}
		$reqDisplay->closeCursor();
	}
	
	//Fonction pour afficher les votes des utilisateurs sur le lieu 
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
		/*if($null == 2  ){
			echo '<div id="resultLike"></div><div id="resultDislike"></div>';
			echo '<div id="result">Ce lieu n\'a pas encore de vote. Soyez le premier à voter</div>';
		}
		else {
			if($resultNbLike[0] == 1){
				echo  '<div id="resultLike">'.$resultNbLike[0].' utilisateur aime ce lieu</div>';
			}
			else {
				echo '<div id="resultLike">'.$resultNbLike[0].' utilisateurs aiment ce lieu</div>';
			}
			if($resultNbDislike[0] == 1){
				echo '<div id="resultDislike">'.$resultNbDislike[0].' utilisateur n\'aime pas ce lieu</div>';
			}
			else {
				echo '<div id="resultDislike">'.$resultNbDislike[0].' utilisateurs n\'aiment pas ce lieu</div>';
			}
			echo '<div id="result"></div>';
		}*/
?>