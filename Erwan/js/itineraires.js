/* Déclaration des variables globales */
var carte = null;
var infos_itineraire = new Array(); // A supprimer dans un futur proche car pas très "propre"
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

$(function(){

	 if(navigator.geolocation) {

	 	carte = new Carte();
		carte.initialisation(document.getElementById('map'));
		carte.setStyle(stylesCarte);
		carte.setMoyenTransport(google.maps.DirectionsTravelMode.WALKING);
	    navigator.geolocation.getCurrentPosition(function(position) {
	      carte.setCenter(position);
	    });


	    $( "#lieux_depart" ).keypress(function(){
      		var val_lieux_depart = $( "#lieux_depart" ).val();
      		new Autocompletion('lieux_depart','resultats_lieux_depart');
      	});

      	$( "#lieux_arrive" ).keypress(function(){
      		var val_lieux_depart = $( "#lieux_arrive" ).val();
      		new Autocompletion('lieux_arrive','resultats_lieux_arrive');
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
					      carte.traceItineraire(latLng_depart,latLng_arrivee,null,placer_points);
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
	      console.log(data.lieux);

	      var form_lieux = '<p>Selectionner les lieux que vous souhaitez visiter :</p>';
	      form_lieux += '<form id="form_lieux">';

	      for(key in data.lieux) {
	        lieu = data.lieux[key];
	        console.log(lieu);

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

	         carte.nettoyer();

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
	         console.log(trajets);
	         for(key in trajets){
	            var latLng_depart = new google.maps.LatLng(trajets[key].depart.latitude,trajets[key].depart.longitude);
	            var latLng_arrivee = new google.maps.LatLng(trajets[key].arrivee.latitude,trajets[key].arrivee.longitude);
	            carte.traceItineraire(latLng_depart,latLng_arrivee);

	            carte.ajouterMarker(latLng_depart,trajets[key].depart.nom,trajets[key].depart.categorie);
	            carte.ajouterMarker(latLng_arrivee,trajets[key].arrivee.nom,trajets[key].arrivee.categorie);
	          }

	         $('#map').css('opacity','1');

	        return false;
	      });

	    }else{
	      console.log('Erreur '+data.code);
	    }
	  }
	});
}