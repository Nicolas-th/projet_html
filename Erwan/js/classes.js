
/**** Utils *****/

/* Fonction permettant de retourner une copie de tab_in, sans la case correspondantà à value_in  */
function deleteValueFromArray(tab_in,value_in){
	return tab_out = $.grep(tab_in, function(current_val) {
	  return current_val != value_in;
	});
}

/**** Carte ****/
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
	this.preferencesInfoWindow = {
		style : {}
	};
};

Carte.prototype = {

	initialisation : function(divCarte){
	    this.carte = new google.maps.Map(divCarte, {
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      zoom: 15
	    });
	},

	setStyleMap : function(style_in){
		var styleCarte = new google.maps.StyledMapType(style_in);
		this.carte.mapTypes.set('map_style', styleCarte);
	    this.carte.setMapTypeId('map_style');
	},

	setStyleInfoWindows : function(style_in){
		if(typeof(style_in)=='object'){
			this.preferencesInfoWindow.style = style_in;
		}
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
	        this.traceItineraire(latLng_depart,latLng_arrivee,null,null,'itineraires_lieux');

	        this.ajouterMarker(latLng_depart,trajets_in[key_in].depart.nom,trajets_in[key_in].depart.categorie,'itineraires_lieux',{
	        	content: '<p class="nom_lieu">'+trajets_in[key_in].depart.nom+'</p>'
	        });
	        this.ajouterMarker(latLng_arrivee,trajets_in[key_in].arrivee.nom,trajets_in[key_in].arrivee.categorie,'itineraires_lieux',{
	        	content: '<p class="nom_lieu">'+trajets_in[key_in].arrivee.nom+'</p>'
	        });

	        key_in++;
	        this.tracerItineraires(trajets_in,key_in);
	    }
	},

	traceItineraire : function(latLngDepart,latLngArrivee,pointsDePassage,callback,type_itineraire){
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

	            if(typeof(type_itineraire)=='undefined'){
			    	type_itineraire = null;
			    }
			    current_object.itineraires.push({itineraire : directionsRenderer, type : type_itineraire});

	            if(typeof(callback)=='function'){
            		callback(response);
            	}

            	return directionsRenderer;
	        }else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT){
	        	console.log('OVER_QUERY_LIMIT');
	        	setTimeout(
	        		function(){
	        			var directionsRenderer = current_object.traceItineraire(latLngDepart,latLngArrivee,pointsDePassage,callback,type_itineraire);
	        			return directionsRenderer;
	        		},
	        		1000
	        	);
	        }
	    });
	},

	supprimerItineraire : function(itineraire_in){
		itineraire_in.setMap(null);
		this.itineraires = deleteValueFromArray(this.itineraires,itineraire_in);
	},

	ajouterMarker : function(latLng_in,nom_in,categorie_in,type_marker,infos_infoWindow){
		var image = 'http://maps.google.com/mapfiles/marker.png';
		if(categorie_in!=null && categorie_in!='defaut'){
			image = 'images/maps_icons/icon_'+categorie_in+'.png';
		}
	    var marker = new google.maps.Marker({
	        position: latLng_in,
	        icon: image,
	        title: nom_in
	    });
	    marker.setMap(this.carte);

	    if(typeof(type_marker)=='undefined'){
	    	type_marker = null;
	    }

	    var infowindow = null;
	    if(typeof(infos_infoWindow)=='object'){
	    	infowindow = this.ajouterInfoWindow(marker,infos_infoWindow);
		}

	    this.markers.push({marker : marker, type : type_marker, infowindow : infowindow});
	    return marker;
	},

	changePositionMarker : function(marker_in,latLngPosition){
		marker_in.setPosition(latLngPosition);
	},

	supprimerMarker : function(marker_in){
		marker_in.setMap(null);
		this.markers = deleteValueFromArray(this.markers,marker_in);
	},

	ajouterInfoWindow : function(marker_in,infos_infoWindow_in){

		var styleInfoWindow = this.preferencesInfoWindow.style;

		var infowindow = new InfoBox({
			content: infos_infoWindow_in.content,
			disableAutoPan: false,
			maxWidth: 0,
			//pixelOffset: new google.maps.Size(-140, 0),
			zIndex: null,
			boxStyle: styleInfoWindow,
			//closeBoxMargin: "12px 4px 2px 2px",
			closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
			infoBoxClearance: new google.maps.Size(1, 1)
	    });

		var map_local = this.carte;
	    google.maps.event.addListener(marker_in, 'click', function() {
			infowindow.open(map_local,marker_in);
		});

		return infowindow;
	},

	nettoyer : function(type,callback){
		for(key_m in this.markers){
			var current = this.markers[key_m];
			if((typeof(type)!='undefined' && typeof(current.type)!='undefined' && current.type==type) || typeof(type)=='undefined' || type=='all'){
				carte.supprimerMarker(current.marker);
			}
		}

		for(key_i in this.itineraires){
			var current = this.itineraires[key_i];
			if((typeof(type)!='undefined' && typeof(current.type)!='undefined' && current.type==type) || typeof(type)=='undefined' || type=='all'){
				carte.supprimerItineraire(current.itineraire);
			}
		}

		if(typeof(callback)=='function'){
			callback();
		}
	}
};


/**** Autocomplétion ****/
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