<!DOCTYPE html>
<html>
  <head>
  	<meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    
    <link rel="stylesheet" type="text/css" href="css/home.css">
   
    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA1HpcMfIYTfqx8XfYENLIFDfMHWK-0-IY&sensor=true">
    </script>
    <script src="http://code.jquery.com/jquery-1.9.1.js"></script>
    <script type="text/javascript" src="js/map_style.Js"></script>
  </head>
  
  <body>
  
  <header>
	  <div class="icon"></div>
	  <div class="icon"></div>
	  <div class="icon"></div>
  </header>
  
  <div id="bouton2"></div>
  
  <div id="popup"> <!-- début barre latérale gauche -->
	  <div id="bouton"></div>
	  
	  <p>Indiquez votre trajet :</p>
	  
	<form id="formulaire_itineraire">
	    <input type="text" name="lieux_depart" id="lieux_depart" autocomplete="off" placeholder="Point de départ"/>
	    <input type="hidden" name="latitude_position" />
	    <input type="hidden" name="longitude_position" />
	    
	    <button id="position">Ma position</button>
	    
	    <input type="hidden" name="ref_lieux_depart" id="ref_lieux_depart" class="ref_lieu" />
	    <ul id="resultats_lieux_depart"></ul>
	    <input type="text" name="lieux_arrive" id="lieux_arrive"  autocomplete="off" placeholder="Lieu de destination"/>
	    <input type="hidden" name="ref_lieux_arrive" id="ref_lieux_arrive" class="ref_lieu"/>
    
	    <ul id="resultats_lieux_arrive"></ul>
	    <div class="choix_transport">
		    <a href="#" id="marche" class="actif">A pied</a>
		    <a href="#" id="velo">En vélo</a>
		    <a href="#" id="metro">En métro</a>
		</div>
		
		<input type="submit" value="Rechercher"/>
		
   </form>
   
   
  <div id="resultat_lieux">

	  <ul>
	  	<li>
		 	<img src="img/yellow_marker.svg" width="20" height="20"/>
		 	<label id="place" for="nombre">Nom du lieu</label>
		 	<div id="icons">
			 	<a href="#" class="ajouter_lieu"><div id="add_place"></div></a>
			 	<a href="#" class="ajouter_lieu"><div id="see_place"></div></a>
		 	</div>
	  	</li>
	  </ul> 
	  
	  <ul>
	  	<li>
		 	<img src="img/yellow_marker.svg" width="20" height="20"/>
		 	<label id="place" for="nombre">Nom du lieu</label>
		 	<div id="icons">
			 	<a href="#" class="ajouter_lieu"><div id="add_place"></div></a>
			 	<a href="#" class="ajouter_lieu"><div id="see_place"></div></a>
		 	</div>
	  	</li>
	  </ul>  
	  
	  <ul>
	  	<li>
		 	<img src="img/yellow_marker.svg" width="20" height="20"/>
		 	<label id="place" for="nombre">Nom du lieu</label>
		 	<div id="icons">
			 	<a href="#" class="ajouter_lieu"><div id="add_place"></div></a>
			 	<a href="#" class="ajouter_lieu"><div id="see_place"></div></a>
		 	</div>
	  	</li>
	  </ul>   
	  
  </div>
	  
  </div> <!-- fin barre latérale gauche -->
  
  

  <div id="map-canvas"></div>
  
  
  
  
  
  
  
  
  
  
  
  <script type="text/javascript">
  
  $("#bouton").click(function(){
  	  $("#popup").animate({
  	  left:"-280px"
  	  },400);

	  
	 /*
 $("#map-canvas").animate({
		  marginLeft:"-280px",
		  opacity:"1"
	  },600);
	 */
	 
	   $("#bouton2").css("display","block");
	       
  });
  
  $("#bouton2").click(function(){
	  $("#popup").animate({
	  left:"0px"
	  },400);
	  
	  /*
$("#map-canvas").animate({
		  marginLeft:"280px",
		  opacity:"0.5"
	  },600);
*/
	  
	  $("#bouton2").css("display","none");
  });
 
  </script>
  
 
    
  </body>
  
</html>

