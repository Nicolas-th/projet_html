/* Déclaration des variables globales */
var carte = null;
var infos_itineraire = new Array(); // A supprimer dans un futur proche car pas très "propre" -> utiliser la classe Carte pour ça
var suiviPosition = null;
var markerPosition = null;
var itinerairePosition = null;
var stylesCarte = [
  {
    "featureType": "landscape",
    "stylers": [
      { "color": "#808080" }
    ]
  },{
    "featureType": "road.highway",
    "stylers": [
      { "color": "#4a4c4c" }
    ]
  },{
    "featureType": "road.arterial",
    "stylers": [
      { "color": "#4a4f52" }
    ]
  },{
    "featureType": "road.local",
    "stylers": [
      { "color": "#999899" }
    ]
  },{
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      { "color": "#9c9c9c" }
    ]
  },{
    "elementType": "labels.text",
    "stylers": [
      { "weight": 0.2 },
      { "color": "#000000" }
    ]
  },{
    "featureType": "transit",
    "elementType": "labels.icon",
    "stylers": [
      { "hue": "#1100ff" }
    ]
  },{
  }
];

var stylesInfoWindow = {
	background : '#FFF',
	width : '200px',
	padding : '5px'
}

$(function(){

	 if(navigator.geolocation) {

	 	carte = new Carte();
		carte.initialisation(document.getElementById('map'));
		carte.setStyleMap(stylesCarte);
		carte.setStyleInfoWindows(stylesInfoWindow);
		//carte.setMoyenTransport(google.maps.DirectionsTravelMode.WALKING);
	    navigator.geolocation.getCurrentPosition(function(position) {
	      carte.setCenter(position);
	    });


	    $('#lieux_depart').keypress(function(){
      		//var val_lieux_depart = $( "#lieux_depart" ).val();
      		var autocomplete = new Autocompletion($('#lieux_depart'),$('#resultats_lieux_depart'));
      		autocomplete.rechercher();
      	});

      	$('#lieux_arrive').keypress(function(){
      		//var val_lieux_depart = $( "#lieux_arrive" ).val();
      		new Autocompletion($('#lieux_arrive'),$('#resultats_lieux_arrive'));
      		autocomplete.rechercher();
      	});

      	/* Gestion du formulaire */
		$('#formulaire_itineraire').submit(function(evt){
			evt.preventDefault();
			var ref_lieux_depart = $('#ref_lieux_depart').val();
			var ref_lieux_arrive = $('#ref_lieux_arrive').val();
			if(ref_lieux_depart!='' && ref_lieux_arrive!=''){
				var service = new google.maps.places.PlacesService(document.getElementById('test'));
				service.getDetails({
				reference : ref_lieux_depart
				}, function(lieu_depart, status){
					infos_itineraire['lieu_depart'] = lieu_depart;
					if (status == google.maps.places.PlacesServiceStatus.OK) {
					  service.getDetails({
					    reference : ref_lieux_arrive
					  }, function(lieu_arrivee, status){
					    infos_itineraire['lieu_arrivee'] = lieu_arrivee;
					    if (status == google.maps.places.PlacesServiceStatus.OK) {
					      var latLng_depart = new google.maps.LatLng(lieu_depart.geometry.location.lb,lieu_depart.geometry.location.mb)
					      var latLng_arrivee = new google.maps.LatLng(lieu_arrivee.geometry.location.lb,lieu_arrivee.geometry.location.mb)
					      carte.traceItineraire(latLng_depart,latLng_arrivee,null,placer_points,'itineraires_lieux');
					      
					     

					    }
					  });
					}
				});	
			}else{
				alert('Vous devez choisir un lieu de départ et de destination');
			}
			return false;
		});

	 }else{
	 	alert('Votre navigateur ne permet pas de vous géolocaliser.');
	 }

});

function placer_points(directionService_reponse){
	var points = directionService_reponse.routes[0].overview_path;
	var str_points = "";
	for (var i = 0; i<points.length; i++) {
	  str_points+=points[i].lb+','+points[i].mb+';'
	}
	$.ajax({
	  type: "POST",
	  url: 'ajax/get_lieux_by_geolocalisation.xhr.php',
	  data: { 'points': str_points },
	  dataType: 'json',
	  success: function(data, textStatus, jqXHR){
	    if(data.code=='200'){
	      //console.log(data.lieux);

	      var form_lieux = '<p>Selectionner les lieux que vous souhaitez visiter :</p>';
	      form_lieux += '<form id="form_lieux">';

	      for(key in data.lieux) {
	        lieu = data.lieux[key];
	        //console.log(lieu);

	        form_lieux+='<div>';
	        form_lieux+=  '<input type="checkbox" name="lieux_itineraire" id="'+lieu.id+'" value="'+lieu.id+'">';
	        form_lieux+=  '<label for="id="'+lieu.id+'"">'+lieu.nom+'</label>';
	        form_lieux+='</div>';

	      }

	      form_lieux+='<input type="submit" value="Valider">';
	      form_lieux+='</form>';

	      $('#instructions').html(form_lieux);

	      $('#instructions form').submit(function(evt){
	        evt.preventDefault();
	        
	         var lieux_choisis = [];
	         $('#instructions form input:checked').each(function() {
	            lieux_choisis.push($(this).val());
	         });

			carte.nettoyer('all',function(){

				if(suiviPosition!=null){
					navigator.geolocation.clearWatch(suiviPosition);
				}
				suiviPosition = navigator.geolocation.watchPosition(function(position) {
					suivi_position(position);
				});

		         var trajets = [];
		         for(var i=0; i<=lieux_choisis.length;i++){
		            

		            /* Ici créer les différents trajets */
		            if(i==0){
		                var depart_itineraire = infos_itineraire['lieu_depart'];
		                depart = {
		                            adresse : depart_itineraire.address_components[0].long_name,
		                            ville : depart_itineraire.address_components[1].long_name,
		                            latitude : depart_itineraire.geometry.location.lb,
		                            longitude : depart_itineraire.geometry.location.mb,
		                            nom : depart_itineraire.address_components[0].long_name+', '+depart_itineraire.address_components[1].long_name,
		                            categorie : 'depart'
		                          }
		            }
		            if(i>=lieux_choisis.length){
		                var arrivee_itineraire = infos_itineraire['lieu_arrivee'];
		                arrivee = {
		                            adresse : arrivee_itineraire.address_components[0].long_name,
		                            ville : arrivee_itineraire.address_components[1].long_name,
		                            latitude : arrivee_itineraire.geometry.location.lb,
		                            longitude : arrivee_itineraire.geometry.location.mb,
		                            nom : arrivee_itineraire.address_components[0].long_name+', '+arrivee_itineraire.address_components[1].long_name,
		                            categorie : 'arrivee'
		                          }
		            }else{
		                var infos_lieu = null;
		                $.ajax({
		                  type: "POST",
		                  url: 'ajax/get_lieu_by_id.xhr.php',
		                  data: { 'id_lieu': lieux_choisis[i] },
		                  dataType: 'json',
		                  async:false,
		                  success: function(data, textStatus, jqXHR){
		                    if(data.code=='200'){
		                        infos_lieu = data.infos;
		                        infos_lieu['categorie'] = infos_lieu['id_categorie']; // Temporairement
		                    }
		                  }
		                });
		                arrivee = infos_lieu;
		            }

		            trajets.push({depart : depart, arrivee : arrivee});
		            depart = arrivee;
		         }
		         carte.tracerItineraires(trajets,0);
		    });

	        $('#map').css('opacity','1');

	        return false;
	      });

	    }else{
	      console.log('Erreur '+data.code);
	    }
	  }
	});
}

function suivi_position(position){
	if(carte!=null && typeof(infos_itineraire['lieu_depart'])!='undefined'){
		carte.setCenter(position);

		carte.nettoyer('current_position');

		var latlngPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		/*if(markerPosition==null){*/
			markerPosition = carte.ajouterMarker(latlngPosition,'Vous êtes ici !',null,'current_position');
		/*}else{
			carte.changePositionMarker(markerPosition,latlngPosition);
		}*/

		var latlngDepart = new google.maps.LatLng(infos_itineraire['lieu_depart'].geometry.location.lb, infos_itineraire['lieu_depart'].geometry.location.mb);
		itinerairePosition = carte.traceItineraire(latlngPosition,latlngDepart,null,null,'current_position');
	}
}
