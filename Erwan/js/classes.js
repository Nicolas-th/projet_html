
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
		var defauts = {
			element : '#carte'
		}
		params = $.extend(defauts, params);

	    _this.carte = new google.maps.Map(params.element, {
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      zoom: 15
	    });
	};

	_this.setStyleMap = function(params){
		var defauts = {
			style : {}
		}
		params = $.extend(defauts, params);

		_this.carte.mapTypes.set('map_style', new google.maps.StyledMapType(params.style));
	    _this.carte.setMapTypeId('map_style');
	};

	_this.setStyleInfoWindows = function(params){
		var defauts = {
			style : {}
		}
		params = $.extend(defauts, params);

		_this.preferencesInfoWindow.style = params.style;
	};

	_this.setCenter = function(params){
		var defauts = {
			position : new google.maps.LatLng(48.851861,2.420284) // Hetic
		}
		params = $.extend(defauts, params);

		_this.carte.setCenter(params.position);
	};

	_this.setMoyenTransport = function(params){
		_this.preferencesItineraire.moyenTransport = params.moyenTransport;
	};

	_this.setOptimisationTrajet = function(params){
		var defauts = {
			optimisation : true
		}
		params = $.extend(defauts, params);

		_this.preferencesItineraire.optimisationTrajet = params.optimisation;
	};

	_this.tracerItineraires = function(params){
		var defauts = {
			key : 0,
			trajets : [],
			finished : function(){}
		}
		params = $.extend(defauts, params);

		if(typeof(params.trajets[params.key])!='undefined'){
	        var latLng_depart = new google.maps.LatLng(params.trajets[params.key].depart.latitude,params.trajets[params.key].depart.longitude);
	        var latLng_arrivee = new google.maps.LatLng(params.trajets[params.key].arrivee.latitude,params.trajets[params.key].arrivee.longitude);

	        _this.ajouterMarker({
	        	position : latLng_depart,
	        	nom : params.trajets[params.key].depart.nom,
	        	categorie : params.trajets[params.key].depart.categorie,
	        	type : 'itineraires_lieux',
	        	infoWindow : {
	        		content: '<p class="nom_lieu">'+params.trajets[params.key].depart.nom+'</p>'
	        	}
	        });
	        _this.ajouterMarker({
	        	position : latLng_arrivee,
	        	nom : params.trajets[params.key].arrivee.nom,
	        	categorie : params.trajets[params.key].arrivee.categorie,
	        	type : 'itineraires_lieux',
	        	infoWindow : {
	        		content: '<p class="nom_lieu">'+params.trajets[params.key].arrivee.nom+'</p>'
	        	}
	        });

	        params.key++; // On incrémente pour le prochain itinéraire

	        _this.traceItineraire({
	        	points : {
	        		depart : latLng_depart,
	        		arrivee : latLng_arrivee
	        	},
	        	type : 'itineraires_lieux',
	        	callback : function(){
			        _this.tracerItineraires(params);
	        	}
	        });
	    }else{
	    	/* Lorsque le chargement des itinéraires est terminé */
	    	params.finished.call(this);
	    }
	};

	_this.traceItineraire = function(params){
		var defauts = {
			waypoints : [],
			points : {
				depart : null,
				arrivee : null,
			}
		}
		params = $.extend(defauts, params);

		var request = {
	        origin      : params.points.depart,
	        destination : params.points.arrivee,
	        waypoints : params.waypoints,
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
            		params.callback.call(this,{
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
	        }else if(status == google.maps.DirectionsStatus.ZERO_RESULTS){
	        	alert('Pas de résultats');	// Possibilité à améliorer
	        }else{
	        	alert('Une erreur s\'est produite...');	// Possibilité à améliorer
	        }
	    });
	};

	_this.supprimerItineraire = function(params){
		var defauts = {
			itineraire : null
		}
		params = $.extend(defauts, params);

		params.itineraire.setMap(null);
		_this.itineraires = deleteValueFromArray(_this.itineraires,params.itineraire);
	};

	_this.ajouterMarker = function(params){
		var defauts = {
			categorie : 'defaut',
			nom : '',
		}
		params = $.extend(defauts, params);

		var image = 'http://maps.google.com/mapfiles/marker.png';
		if(params.categorie!='defaut'){
			image = 'images/maps_icons/icon_'+params.categorie+'.png';
		}
	    var marker = new google.maps.Marker({
	        position: params.position,
	        icon: image,
	        title: params.nom
	    });
	    marker.setMap(_this.carte);

	    var infowindow = null;
	    if(typeof(params.infoWindow)=='object'){
	    	infowindow = _this.ajouterInfoWindow({
	    		marker : marker,
	    		infoWindow : params.infoWindow
	    	});
		}

	    _this.markers.push({
	    	marker : marker,
	    	type : params.type,
	    	infowindow : infowindow
	    });
	    return marker;
	};

	_this.changePositionMarker = function(params){
		var defauts = {
			position : null
		}
		params = $.extend(defauts, params);

		params.marker.setPosition(params.position);
	};

	_this.supprimerMarker = function(params){
		var defauts = {
			marker : null
		}
		params = $.extend(defauts, params);

		params.marker.setMap(null);
		_this.markers = deleteValueFromArray(_this.markers,params.marker);
	};

	_this.ajouterInfoWindow = function(params){
		var defauts = {
			marker : null,
			infoWindow : {
				content : ''
			}
		}
		params = $.extend(defauts, params);

		var infowindow = new InfoBox({
			content: params.infoWindow.content,
			disableAutoPan: false,
			maxWidth: 0,
			//pixelOffset: new google.maps.Size(-140, 0),
			zIndex: null,
			boxStyle: _this.preferencesInfoWindow.style,
			//closeBoxMargin: "12px 4px 2px 2px",
			closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
			infoBoxClearance: new google.maps.Size(1, 1)
	    });

	    google.maps.event.addListener(params.marker, 'click', function() {
			infowindow.open(_this.carte,params.marker);
		});

		return infowindow;
	};

	_this.nettoyer = function(params){
		var defauts = {
			type : null,
			finished : function(){}
		}
		params = $.extend(defauts, params);

		for(key_m in _this.markers){
			var current = _this.markers[key_m];
			if((typeof(current.type)!='undefined' && current.type==params.type) || params.type==null || params.type=='all'){
				_this.supprimerMarker({
					marker : current.marker
				});
			}
		}

		for(key_i in _this.itineraires){
			var current = _this.itineraires[key_i];
			if((typeof(current.type)!='undefined' && current.type==params.type) || params.type==null || params.type=='all'){
				_this.supprimerItineraire({itineraire : current.itineraire});
			}
		}
		params.finished.call(this);
	};
};


/**** Autocomplétion ****/
var Autocompletion = function(params){

	var _this = this;
	var defauts = {
		inputText : '#autocomplete',
		divResultats : '#resultats_autocompletion'
	}
	params = $.extend(defauts, params);

	_this.inputText = $(params.inputText);
	_this.divResultats = $(params.divResultats);


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
		var defauts = {
			resultats : []
		}
		params = $.extend(defauts, params);

		var htmlContent = '';
		for (var i = 0; i<params.resultats.length; i++) {
			htmlContent += '<li id="'+params.resultats[i].reference+'">' + params.resultats[i].description + '</li>';
		}
		_this.divResultats.html(htmlContent);

		_this.divResultats.find('li').click(function(){
          _this.inputText.val($(this).html());
          _this.inputText.siblings('input[type="hidden"]').val($(this).attr('id'));
          _this.divResultats.html(htmlContent);
          _this.inputText.siblings('+input[type="hidden"]').val($(this).attr('id'));
          _this.divResultats.empty();
      	});
	}

};