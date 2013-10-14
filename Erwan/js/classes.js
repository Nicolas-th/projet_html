/* Carte */
var Carte = function() {
	var carte;
	var itineraires = [];
	var markers = [];
	var preferencesItineraire = {
		moyenTransport : google.maps.DirectionsTravelMode.TRANSIT,
		optimisationTrajet : true,
		couleurItineraire : '#f6de65',
		suppressionMarkers : true
	};

	this.initialisation = function(divCarte){
	    carte = new google.maps.Map(divCarte, {
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      zoom: 15
	    });

	    /*direction = new google.maps.DirectionsRenderer({
	        map   : map, 
	        panel : panel
	    });*/
	}

	this.setStyle = function(style_in){
		var styleCarte = new google.maps.StyledMapType(style_in);
		carte.mapTypes.set('map_style', styleCarte);
	    carte.setMapTypeId('map_style');
	}

	this.setCenter = function(position_in){
		var positionCentre = new google.maps.LatLng(position_in.coords.latitude,position_in.coords.longitude);
		carte.setCenter(positionCentre);
	}

	this.setMoyenTransport = function(moyenTransport_in){
		preferencesItineraire.moyenTransport = moyenTransport_in;
	}

	this.setOptimisationTrajet = function(optimisation_in){
		preferencesItineraire.optimisationTrajet = optimisation_in;
	}

	this.traceItineraire = function(latLngDepart,latLngArrivee,pointsDePassage,callback){
		var waypoints = [];
		if(typeof(pointsDePassage)!='undefined' && pointsDePassage!=null)	waypoints = pointsDePassage;

		var request = {
	        origin      : latLngDepart,
	        destination : latLngArrivee,
	        waypoints : waypoints,
	        optimizeWaypoints: preferencesItineraire.optimisationTrajet,
	        travelMode  : preferencesItineraire.moyenTransport
	    }

	    var directionsService = new google.maps.DirectionsService();
	    directionsService.route(request, function(response, status){
	        if(status == google.maps.DirectionsStatus.OK){
	            var directionsRenderer = new google.maps.DirectionsRenderer({
	              suppressMarkers: preferencesItineraire.suppressionMarkers,
	              polylineOptions : {
	                strokeColor : preferencesItineraire.couleurItineraire
	              }
	            });
	            directionsRenderer.setMap(carte);
	            directionsRenderer.setDirections(response);

	            itineraires.push(directionsRenderer);

	            if(typeof(callback)=='function'){
            		callback(response)
            	}
	        }
	    });
	}

	this.ajouterMarker = function(latLng_in,nom_in,categorie_in){
		var image = 'images/maps_icons/icon_'+categorie_in+'.png';
	    var marker = new google.maps.Marker({
	        position: latLng_in,
	        icon: image,
	        title: nom_in
	    });
	    marker.setMap(carte);
	    markers.push(marker);
	}

	this.nettoyer = function(){
      for(key in itineraires){
          itineraires[key].setMap(null);
      }
      for(key in markers){
          markers[key].setMap(null);
      }
	}
};


/* Autocomplétion */
var Autocompletion = function(inputText_in,divResultats_in){

	var inputText = $('#'+idInputText);
	var divResultats = $('#'+idDivResultats);

	/*this.setInputText = function(idInputText){
		inputText = $('#'+idInputText);
	}

	this.setDivResultats = function(idDivResultats){
		divResultats = $('#'+idDivResultats);
	}*/
	// Arguments passés en paramètres de la classe

	this.rechercher = function(lieuRecherche){
		var service = new google.maps.places.AutocompleteService();
	    service.getQueryPredictions({ input: lieuRecherche }, function(reponse, status){
	      if(status == google.maps.places.PlacesServiceStatus.OK) {
	        this.afficherResultats(reponse);
	      }
	    });
	}

	this.afficherResultats = function(resultatsRecherche){
		var htmlContent = '';
		for (var i = 0; i<resultatsRecherche.length; i++) {
			htmlContent += '<li id="'+resultatsRecherche[i].reference+'">' + resultatsRecherche[i].description + '</li>';
		}
		divResultats.html(htmlContent);
		divResultats.find('li').click(function(){
          inputText.val($(this).html());
          inputText.siblings('input[type="hidden"]').val($(this).attr('id'));
          divResultats.html(htmlContent);
          $('#'+id_input_autocompletion+'+input[type="hidden"]').val($(this).attr('id'));
          $('#resultats_'+id_input_autocompletion).empty();
      	});
	}
};