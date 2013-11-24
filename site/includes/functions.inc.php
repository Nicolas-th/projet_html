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

	function getUrlMedia($url_file,$id_lieu,$type='img'){
		global $chemin_relatif_site;
		global $src_media;
		global $dir_images;
		global $dir_videos;
		if($type!='video')		$type='img';

		$url = $chemin_relatif_site.$src_media.$id_lieu.'/'.(($type=='img')?$dir_images:$dir_videos).$url_file;
		return $url;
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
	

	//Fonction pour afficher les commentaires en fonction du lieu
	function structureCommentaire($commentaire,$user_connecte=true,$cpt=null){
		global $chemin_relatif_site;

		$avatar = getUrlAvatar($commentaire['avatar']);

		$html = '';
		$html.='<div class="commentaire" '.(($cpt==null)?'':'id="comment_'.$cpt.'"').'>';
		$html.='	<div>';
		$html.='		<img src="'.$avatar.'" alt="Avatar de '.$commentaire['nickname'].'">';
		$html.='	</div>';
		$html.='	<div>';
		$html.='		<div class="commentaire-header"><p>'.$commentaire['nickname'].'</p><p>Le '.date('d/m/Y', $commentaire['date_comment']).' à '.date('H\hi', $commentaire['date_comment']).'</p></div>';	
		$html.='		<p class="commentaire-content">'.$commentaire['content'].'</p>';
		if($user_connecte){
			if($commentaire['valid']==0){
				$html.='<a class="signaler" href="'.$chemin_relatif_site.'ajax/signaler.xhr.php?id=' . $commentaire['id'] . '" class="signaler" id="'.$commentaire['id'].'">Signaler</a>';
			}else{
				$html.='<p class="signalement">Ce commentaire a été signalé par un membre.</p>';
			}
		}
		$html.='	</div>';
		$html.='</div>';

		return $html;
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
?>