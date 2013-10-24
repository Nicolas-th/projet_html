
/**** Carte ****/
var Carte = function() {

	var _this = this;

	_this.carte = null;
	_this.itineraires = [];
	_this.markers = [];
	_this.preferencesItineraire = {
		moyenTransport : google.maps.DirectionsTravelMode.TRANSIT,
		optimisationTrajet : true,
		couleurItineraire : '#f6de65',
		suppressionMarkers : true
	};
	_this.preferencesInfoWindow = {
		style : {}
	};

	_this.initialisation = function(divCarte){
	    _this.carte = new google.maps.Map(divCarte, {
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      zoom: 15
	    });
	},

	_this.setStyleMap = function(style_in){
		var styleCarte = new google.maps.StyledMapType(style_in);
		_this.carte.mapTypes.set('map_style', styleCarte);
	    _this.carte.setMapTypeId('map_style');
	},

	_this.setStyleInfoWindows = function(style_in){
		if(typeof(style_in)=='object'){
			_this.preferencesInfoWindow.style = style_in;
		}
	},

	_this.setCenter = function(position_in){
		var positionCentre = new google.maps.LatLng(position_in.coords.latitude,position_in.coords.longitude);
		_this.carte.setCenter(positionCentre);
	},

	_this.setMoyenTransport = function(moyenTransport_in){
		_this.preferencesItineraire.moyenTransport = moyenTransport_in;
	},

	_this.setOptimisationTrajet = function(optimisation_in){
		_this.preferencesItineraire.optimisationTrajet = optimisation_in;
	},

	_this.tracerItineraires = function(trajets_in,key_in){
		if(typeof(trajets_in[key_in])!='undefined'){
	        var latLng_depart = new google.maps.LatLng(trajets_in[key_in].depart.latitude,trajets_in[key_in].depart.longitude);
	        var latLng_arrivee = new google.maps.LatLng(trajets_in[key_in].arrivee.latitude,trajets_in[key_in].arrivee.longitude);
	        _this.traceItineraire(latLng_depart,latLng_arrivee,null,null,'itineraires_lieux');

	        _this.ajouterMarker(latLng_depart,trajets_in[key_in].depart.nom,trajets_in[key_in].depart.categorie,'itineraires_lieux',{
	        	content: '<p class="nom_lieu">'+trajets_in[key_in].depart.nom+'</p>'
	        });
	        _this.ajouterMarker(latLng_arrivee,trajets_in[key_in].arrivee.nom,trajets_in[key_in].arrivee.categorie,'itineraires_lieux',{
	        	content: '<p class="nom_lieu">'+trajets_in[key_in].arrivee.nom+'</p>'
	        });

	        key_in++;
	        _this.tracerItineraires(trajets_in,key_in);
	    }
	},

	_this.traceItineraire = function(latLngDepart,latLngArrivee,pointsDePassage,callback,type_itineraire){
		var waypoints = [];
		if(typeof(pointsDePassage)!='undefined' && pointsDePassage!=null)	waypoints = pointsDePassage;

		var request = {
	        origin      : latLngDepart,
	        destination : latLngArrivee,
	        waypoints : waypoints,
	        optimizeWaypoints: _this.preferencesItineraire.optimisationTrajet,
	        travelMode  : _this.preferencesItineraire.moyenTransport
	    }
	    
	    var directionsService = new google.maps.DirectionsService();
	    directionsService.route(request, function(response, status){
	        if(status == google.maps.DirectionsStatus.OK){
	            var directionsRenderer = new google.maps.DirectionsRenderer({
	              suppressMarkers: _this.preferencesItineraire.suppressionMarkers,
	              polylineOptions : {
	                strokeColor : _this.preferencesItineraire.couleurItineraire
	              }
	            });
	            directionsRenderer.setMap(_this.carte);
	            directionsRenderer.setDirections(response);

	            if(typeof(type_itineraire)=='undefined'){
			    	type_itineraire = null;
			    }
			    _this.itineraires.push({itineraire : directionsRenderer, type : type_itineraire});

	            if(typeof(callback)=='function'){
            		callback(response);
            	}

            	return directionsRenderer;
	        }else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT){
	        	console.log('OVER_QUERY_LIMIT');
	        	setTimeout(
	        		function(){
	        			var directionsRenderer = _this.traceItineraire(latLngDepart,latLngArrivee,pointsDePassage,callback,type_itineraire);
	        			return directionsRenderer;
	        		},
	        		1000
	        	);
	        }
	    });
	},

	_this.supprimerItineraire = function(itineraire_in){
		itineraire_in.setMap(null);
		_this.itineraires = deleteValueFromArray(_this.itineraires,itineraire_in);
	},

	_this.ajouterMarker = function(latLng_in,nom_in,categorie_in,type_marker,infos_infoWindow){
		var image = 'http://maps.google.com/mapfiles/marker.png';
		if(categorie_in!=null && categorie_in!='defaut'){
			image = 'images/maps_icons/icon_'+categorie_in+'.png';
		}
	    var marker = new google.maps.Marker({
	        position: latLng_in,
	        icon: image,
	        title: nom_in
	    });
	    marker.setMap(_this.carte);

	    if(typeof(type_marker)=='undefined'){
	    	type_marker = null;
	    }

	    var infowindow = null;
	    if(typeof(infos_infoWindow)=='object'){
	    	infowindow = _this.ajouterInfoWindow(marker,infos_infoWindow);
		}

	    _this.markers.push({marker : marker, type : type_marker, infowindow : infowindow});
	    return marker;
	},

	_this.changePositionMarker = function(marker_in,latLngPosition){
		marker_in.setPosition(latLngPosition);
	},

	_this.supprimerMarker = function(marker_in){
		marker_in.setMap(null);
		_this.markers = deleteValueFromArray(_this.markers,marker_in);
	},

	_this.ajouterInfoWindow = function(marker_in,infos_infoWindow_in){

		var styleInfoWindow = _this.preferencesInfoWindow.style;

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

	    google.maps.event.addListener(marker_in, 'click', function() {
			infowindow.open(_this,marker_in);
		});

		return infowindow;
	},

	_this.nettoyer = function(type,callback){
		for(key_m in _this.markers){
			var current = _this.markers[key_m];
			if((typeof(type)!='undefined' && typeof(current.type)!='undefined' && current.type==type) || typeof(type)=='undefined' || type=='all'){
				carte.supprimerMarker(current.marker);
			}
		}

		for(key_i in _this.itineraires){
			var current = _this.itineraires[key_i];
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

	var _this = this;

	_this.inputText = inputText_in;
	_this.divResultats = divResultats_in;


	_this.rechercher = function(){
		var lieuRecherche = _this.inputText.val();
		var service = new google.maps.places.AutocompleteService();
		var autocomplete = _this;
	    service.getQueryPredictions({ input: lieuRecherche }, function(reponse, status){
	      if(status == google.maps.places.PlacesServiceStatus.OK) {
	        autocomplete.afficherResultats(reponse);
	      }
	    });
	},

	_this.afficherResultats = function(resultatsRecherche){
		var htmlContent = '';
		for (var i = 0; i<resultatsRecherche.length; i++) {
			htmlContent += '<li id="'+resultatsRecherche[i].reference+'">' + resultatsRecherche[i].description + '</li>';
		}
		_this.divResultats.html(htmlContent);

		var local_inputText = _this.inputText;
		var local_divResultats = _this.divResultats;
		_this.divResultats.find('li').click(function(){
          local_inputText.val($(this).html());
          local_inputText.siblings('input[type="hidden"]').val($(this).attr('id'));
          local_divResultats.html(htmlContent);
          local_inputText.siblings('+input[type="hidden"]').val($(this).attr('id'));
          local_divResultats.empty();
      	});
	}

};