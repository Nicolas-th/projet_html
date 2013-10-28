
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

	_this.initialisation = function(params){
	    _this.carte = new google.maps.Map(params.divCarte, {
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      zoom: 15
	    });
	};

	_this.setStyleMap = function(params){
		var styleCarte = new google.maps.StyledMapType(params.mapStyle);
		_this.carte.mapTypes.set('map_style', styleCarte);
	    _this.carte.setMapTypeId('map_style');
	};

	_this.setStyleInfoWindows = function(params){
		if(typeof(params.infoWindowStyle)=='object'){
			_this.preferencesInfoWindow.style = params.infoWindowStyle;
		}
	};

	_this.setCenter = function(params){
		var positionCentre = new google.maps.LatLng(params.position.coords.latitude,params.position.coords.longitude);
		_this.carte.setCenter(positionCentre);
	};

	_this.setMoyenTransport = function(params){
		_this.preferencesItineraire.moyenTransport = params.moyenTransport;
	};

	_this.setOptimisationTrajet = function(params){
		_this.preferencesItineraire.optimisationTrajet = params.optimisation;
	};

	_this.tracerItineraires = function(params){
		if(typeof(params.trajets[params.key])!='undefined'){
	        var latLng_depart = new google.maps.LatLng(params.trajets[params.key].depart.latitude,params.trajets[params.key].depart.longitude);
	        var latLng_arrivee = new google.maps.LatLng(params.trajets[params.key].arrivee.latitude,params.trajets[params.key].arrivee.longitude);

	        _this.traceItineraire({
	        	latLngDepart : latLng_depart,
	        	latLngArrivee : latLng_arrivee,
	        	pointsDePassage : null,
	        	callback : null,
	        	type : 'itineraires_lieux'
	        });

	        _this.ajouterMarker({
	        	latLng : latLng_depart,
	        	nom : params.trajets[params.key].depart.nom,
	        	categorie : params.trajets[params.key].depart.categorie,
	        	type : 'itineraires_lieux',
	        	infoWindow : {
	        		content: '<p class="nom_lieu">'+params.trajets[params.key].depart.nom+'</p>'
	        	}
	        });
	        _this.ajouterMarker({
	        	latLng : latLng_arrivee,
	        	nom : params.trajets[params.key].arrivee.nom,
	        	categorie : params.trajets[params.key].arrivee.categorie,
	        	type : 'itineraires_lieux',
	        	infoWindow : {
	        		content: '<p class="nom_lieu">'+params.trajets[params.key].arrivee.nom+'</p>'
	        	}
	        });

	        params.key++;
	        _this.tracerItineraires({
	        	trajets : params.trajets,
	        	key : params.key
	        });
	    }
	};

	_this.traceItineraire = function(params){
		var waypoints = [];
		if(typeof(params.pointsDePassage)!='undefined' && params.pointsDePassage!=null)	waypoints = params.pointsDePassage;
		var request = {
	        origin      : params.latLngDepart,
	        destination : params.latLngArrivee,
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

	            if(typeof(params.type)=='undefined'){
			    	params.type = null;
			    }
			    _this.itineraires.push({itineraire : directionsRenderer, type : params.type});

	            if(typeof(params.callback)=='function'){
            		params.callback({
            			directionsServiceResponse : response
            		});
            	}


            	return directionsRenderer;
	        }else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT){
	        	console.log('OVER_QUERY_LIMIT');
	        	setTimeout(
	        		function(){
	        			var directionsRenderer = _this.traceItineraire(params);
	        			return directionsRenderer;
	        		},
	        		1000
	        	);
	        }
	    });
	};

	_this.supprimerItineraire = function(params){
		params.itineraire.setMap(null);
		_this.itineraires = deleteValueFromArray(_this.itineraires,params.itineraire);
	};

	_this.ajouterMarker = function(params){
		var image = 'http://maps.google.com/mapfiles/marker.png';
		if(params.categorie!=null && params.categorie!='defaut'){
			image = 'images/maps_icons/icon_'+params.categorie+'.png';
		}
	    var marker = new google.maps.Marker({
	        position: params.latLng,
	        icon: image,
	        title: params.nom
	    });
	    marker.setMap(_this.carte);

	    if(typeof(params.type)=='undefined'){
	    	params.type = null;
	    }

	    var infowindow = null;
	    if(typeof(params.infoWindow)=='object' && params.infoWindow!=null){
	    	infowindow = _this.ajouterInfoWindow({
	    		marker : marker,
	    		infoWindow : params.infoWindow
	    	});
		}

	    _this.markers.push({
	    	marker : marker,
	    	type : params.type,
	    	infowindow : params.infoWindow
	    });
	    return marker;
	};

	_this.changePositionMarker = function(params){
		params.marker.setPosition(params.position);
	};

	_this.supprimerMarker = function(params){
		params.marker.setMap(null);
		_this.markers = deleteValueFromArray(_this.markers,params.marker);
	};

	_this.ajouterInfoWindow = function(params){

		var styleInfoWindow = _this.preferencesInfoWindow.style;

		var infowindow = new InfoBox({
			content: params.infoWindow.content,
			disableAutoPan: false,
			maxWidth: 0,
			//pixelOffset: new google.maps.Size(-140, 0),
			zIndex: null,
			boxStyle: styleInfoWindow,
			//closeBoxMargin: "12px 4px 2px 2px",
			closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
			infoBoxClearance: new google.maps.Size(1, 1)
	    });

	    google.maps.event.addListener(params.marker, 'click', function() {
			infowindow.open(_this,params.marker);
		});

		return infowindow;
	};

	_this.nettoyer = function(params){
		if(typeof(params.type)!='undefined'){
			for(key_m in _this.markers){
				var current = _this.markers[key_m];
				if((typeof(params.type)!='undefined' && typeof(current.type)!='undefined' && current.type==params.type) || typeof(params.type)=='undefined' || params.type=='all'){
					carte.supprimerMarker({
						marker : current.marker
					});
				}
			}

			for(key_i in _this.itineraires){
				var current = _this.itineraires[key_i];
				if((typeof(params.type)!='undefined' && typeof(current.type)!='undefined' && current.type==params.type) || typeof(params.type)=='undefined' || params.type=='all'){
					carte.supprimerItineraire({itineraire : current.itineraire});
				}
			}
			if(typeof(params.callback)=='function'){
				params.callback();
			}
		}
	};
};


/**** Autocomplétion ****/
var Autocompletion = function(params){

	var _this = this;

	_this.inputText = params.inputText;
	_this.divResultats = params.divResultats;


	_this.rechercher = function(){
		var lieuRecherche = _this.inputText.val();
		var service = new google.maps.places.AutocompleteService();
	    service.getQueryPredictions({ input: lieuRecherche }, function(reponse, status){
	      if(status == google.maps.places.PlacesServiceStatus.OK) {
	        _this.afficherResultats({resultats : reponse});
	      }
	    });
	},

	_this.afficherResultats = function(params){
		var htmlContent = '';
		for (var i = 0; i<params.resultats.length; i++) {
			htmlContent += '<li id="'+params.resultats[i].reference+'">' + params.resultats[i].description + '</li>';
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