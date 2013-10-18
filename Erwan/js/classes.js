/* Carte */
var Carte = function() {
	this.carte = null;
	this.itineraires = [];
	this.markers = [];
	this.preferencesItineraire = {
		moyenTransport : google.maps.DirectionsTravelMode.TRANSIT,
		optimisationTrajet : true,
		couleurItineraire : '#f6de65',
		suppressionMarkers : true
	};
};

Carte.prototype = {

	initialisation : function(divCarte){
	    this.carte = new google.maps.Map(divCarte, {
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      zoom: 15
	    });
	},

	setStyle : function(style_in){
		var styleCarte = new google.maps.StyledMapType(style_in);
		this.carte.mapTypes.set('map_style', styleCarte);
	    this.carte.setMapTypeId('map_style');
	},

	setCenter : function(position_in){
		var positionCentre = new google.maps.LatLng(position_in.coords.latitude,position_in.coords.longitude);
		this.carte.setCenter(positionCentre);
	},

	setMoyenTransport : function(moyenTransport_in){
		this.preferencesItineraire.moyenTransport = moyenTransport_in;
	},

	setOptimisationTrajet : function(optimisation_in){
		this.preferencesItineraire.optimisationTrajet = optimisation_in;
	},

	tracerItineraires : function(trajets_in,key_in){
		if(typeof(trajets_in[key_in])!='undefined'){
	        var latLng_depart = new google.maps.LatLng(trajets_in[key_in].depart.latitude,trajets_in[key_in].depart.longitude);
	        var latLng_arrivee = new google.maps.LatLng(trajets_in[key_in].arrivee.latitude,trajets_in[key_in].arrivee.longitude);
	        this.traceItineraire(latLng_depart,latLng_arrivee);

	        this.ajouterMarker(latLng_depart,trajets_in[key_in].depart.nom,trajets_in[key_in].depart.categorie);
	        this.ajouterMarker(latLng_arrivee,trajets_in[key_in].arrivee.nom,trajets_in[key_in].arrivee.categorie);

	        key_in++;
	        this.tracerItineraires(trajets_in,key_in);
	    }
	},

	traceItineraire : function(latLngDepart,latLngArrivee,pointsDePassage,callback){
		var waypoints = [];
		if(typeof(pointsDePassage)!='undefined' && pointsDePassage!=null)	waypoints = pointsDePassage;

		var request = {
	        origin      : latLngDepart,
	        destination : latLngArrivee,
	        waypoints : waypoints,
	        optimizeWaypoints: this.preferencesItineraire.optimisationTrajet,
	        travelMode  : this.preferencesItineraire.moyenTransport
	    }

	    var current_object = this; // Permet d'accéder à l'instance this au sein du callback de directionsService.route
	    
	    var directionsService = new google.maps.DirectionsService();
	    directionsService.route(request, function(response, status){
	        if(status == google.maps.DirectionsStatus.OK){
	            var directionsRenderer = new google.maps.DirectionsRenderer({
	              suppressMarkers: current_object.preferencesItineraire.suppressionMarkers,
	              polylineOptions : {
	                strokeColor : current_object.preferencesItineraire.couleurItineraire
	              }
	            });
	            directionsRenderer.setMap(current_object.carte);
	            directionsRenderer.setDirections(response);

	            current_object.itineraires.push(directionsRenderer);

	            if(typeof(callback)=='function'){
            		callback(response)
            	}
	        }else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT){
	        	console.log('OVER_QUERY_LIMIT');
	        	setTimeout(
	        		function(){
	        			current_object.traceItineraire(latLngDepart,latLngArrivee,pointsDePassage,callback)
	        		},
	        		1000
	        	);
	        }
	    });
	},

	ajouterMarker : function(latLng_in,nom_in,categorie_in){
		var image = 'images/maps_icons/icon_'+categorie_in+'.png';
	    var marker = new google.maps.Marker({
	        position: latLng_in,
	        icon: image,
	        title: nom_in
	    });
	    marker.setMap(this.carte);
	    this.markers.push(marker);
	},

	nettoyer : function(){
      for(key in this.itineraires){
          this.itineraires[key].setMap(null);
      }
      for(key in this.markers){
          this.markers[key].setMap(null);
      }
	}
};

var Autocompletion = function(inputText_in,divResultats_in){
	this.inputText = inputText_in;
	this.divResultats = divResultats_in;
	
}


/* Autocomplétion */
var Autocompletion = function(inputText_in,divResultats_in){

	this.inputText = inputText_in;
	this.divResultats = divResultats_in;
}

Autocompletion.prototype = {

	rechercher : function(){
		var lieuRecherche = this.inputText.val();
		var service = new google.maps.places.AutocompleteService();
		var autocomplete = this;
	    service.getQueryPredictions({ input: lieuRecherche }, function(reponse, status){
	      if(status == google.maps.places.PlacesServiceStatus.OK) {
	        autocomplete.afficherResultats(reponse);
	      }
	    });
	},

	afficherResultats : function(resultatsRecherche){
		var htmlContent = '';
		for (var i = 0; i<resultatsRecherche.length; i++) {
			htmlContent += '<li id="'+resultatsRecherche[i].reference+'">' + resultatsRecherche[i].description + '</li>';
		}
		this.divResultats.html(htmlContent);

		var local_inputText = this.inputText;
		var local_divResultats = this.divResultats;
		this.divResultats.find('li').click(function(){
          local_inputText.val($(this).html());
          local_inputText.siblings('input[type="hidden"]').val($(this).attr('id'));
          local_divResultats.html(htmlContent);
          local_inputText.siblings('+input[type="hidden"]').val($(this).attr('id'));
          local_divResultats.empty();
      	});
	}

};