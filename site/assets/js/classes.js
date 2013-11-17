
/**** Carte ****/
var Carte = function() {

	var _this = this;

	_this.carte = null;
	_this.itineraires = [];
	_this.markers = [];
	_this.preferencesItineraire = {
		moyenTransport : google.maps.DirectionsTravelMode.WALKING,
		couleurItineraire : '#f6de65',
		suppressionMarkers : true
	};
	_this.preferencesInfoWindow = {
		style : {}
	};

	/*
	## init() ##
			Paramètre attendu : objet
				 {
					element : String (selector CSS3)
				 }
	*/
	_this.init = function(params){
		var defauts = {
			element : '#carte',
			streetViewControl : false
		}
		params = $.extend(defauts, params);

	    _this.carte = new google.maps.Map(
	    	params.element,
	    	{
	      		mapTypeId: google.maps.MapTypeId.ROADMAP,
	     		zoom: 15,
	      		streetViewControl : params.streetViewControl
	    	}
	    );
	};

	/*
	## setStyleMap() ##
			Paramètre attendu : objet
				 {
					style : Array (type StyledMapType)
				 }
	*/
	_this.setStyleMap = function(params){
		var defauts = {
			style : {}
		}
		params = $.extend(defauts, params);

		_this.carte.mapTypes.set('map_style', new google.maps.StyledMapType(params.style));
	    _this.carte.setMapTypeId('map_style');
	};

	/*
	## setStyleInfoWindows() ##
			Paramètre attendu : objet
				 {
					style : String
				 }
	*/
	_this.setStyleInfoWindows = function(params){
		var defauts = {
			style : {}
		}
		params = $.extend(defauts, params);

		_this.preferencesInfoWindow.style = params.style;
	};

	/*
	## setCenter() ##
			Paramètre attendu : objet
				 {
					position : objet google.maps.LatLng
				 }
	*/
	_this.setCenter = function(params){
		var defauts = {
			position : new google.maps.LatLng(48.851861,2.420284) // Hetic
		}
		params = $.extend(defauts, params);

		_this.carte.setCenter(params.position);
	};

	/*
	## setZoom() ##
			Paramètre attendu : objet
				 {
					zoom : int
				 }
	*/
	_this.setZoom = function(params){
		var defauts = {
			zoom : 5
		}
		params = $.extend(defauts, params);

		_this.carte.setZoom(params.zoom);
	};

	/*
	## setMoyenTransport() ##
			Paramètre attendu : objet
				 {
					moyenTransport : objet google.maps.DirectionsTravelMode
				 }
	*/
	_this.setMoyenTransport = function(params){
		var defauts = {
			moyenTransport : google.maps.DirectionsTravelMode.TRANSIT
		}
		params = $.extend(defauts, params);

		_this.preferencesItineraire.moyenTransport = params.moyenTransport;
	};


	/*
	## tracerItineraires() ##
			Paramètre attendu : objet
				 {
					trajets : [
						depart : {
							latitude : String,
							longitude : String,
							nom : String,
							categorie : int
						},
						arrivee : {
							latitude : String,
							longitude : String,
							nom : String,
							categorie : int
						}
					],
					key : int
				 }
	*/
	_this.tracerItineraires = function(params){
		var defauts = {
			key : 0,
			trajets : [],
			duree : 0,
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
	        	finished : function(returns){
	        		if(returns.directionsServiceResponse.status==google.maps.DirectionsStatus.OK){
	         			var duree_itineraire = returns.directionsServiceResponse.routes[0].legs[0].duration.value;
	         			params.duree += duree_itineraire;
	         		}
			        _this.tracerItineraires(params);
	        	}
	        });
	    }else{
	    	/* Lorsque le chargement des itinéraires est terminé */
	    	var bounds = new google.maps.LatLngBounds();
    		for(key in _this.markers){
    			bounds.extend(_this.markers[key].marker.position);
    		}
    		_this.carte.fitBounds(bounds);
	    	params.finished.call(this,{
	    		duree : params.duree
	    	});
	    }
	};

	/*
	## traceItineraire() ##
			Paramètre attendu : objet
				 {
					points : {
						depart : objet google.maps.LatLng
						arrivee : objet google.maps.LatLng
					},
					type : String (optionnel : permet de nettoyer des groupes d'itinéraires et de points)
					finished : function({directionsServiceResponse : objet (retour de directionsService.route)})
				 }
	*/
	_this.traceItineraire = function(params){
		var defauts = {
			points : {
				depart : null,
				arrivee : null,
			},
			type : null,
			preserveViewport : true,
			finished : function(){}
		}
		params = $.extend(defauts, params);

		var request = {
	        origin      : params.points.depart,
	        destination : params.points.arrivee,
	        travelMode  : _this.preferencesItineraire.moyenTransport
	    }
	    var directionsService = new google.maps.DirectionsService();
	    directionsService.route(request, function(response, status){
	        if(status == google.maps.DirectionsStatus.OK){
	            var directionsRenderer = new google.maps.DirectionsRenderer({
	              suppressMarkers: _this.preferencesItineraire.suppressionMarkers,
	              polylineOptions : {
	                strokeColor : _this.preferencesItineraire.couleurItineraire
	              },
	              preserveViewport: params.preserveViewport
	            });
	            directionsRenderer.setMap(_this.carte);
	            directionsRenderer.setDirections(response);

			    _this.itineraires.push({
			    	itineraire : directionsRenderer,
			    	type : params.type
			    });

            	params.finished.call(this,{
            		directionsServiceResponse : response
            	});


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

	/*
	## supprimerItineraire() ##
			Paramètre attendu : objet
				 {
					itineraire : objet directionsRenderer
				 }
	*/
	_this.supprimerItineraire = function(params){
		var defauts = {
			itineraire : null
		}
		params = $.extend(defauts, params);

		params.itineraire.setMap(null);
		_this.itineraires = deleteValueFromArray(_this.itineraires,params.itineraire);
	};

	/*
	## ajouterMarker() ##
			Paramètre attendu : objet
				 {
				 	position : objet google.maps.LatLng
					categorie : int,
					nom : String,
					infoWindow : (optionnel) {
						content : String (content HTML)
					}
				 }
	*/
	_this.ajouterMarker = function(params){
		var defauts = {
			position : null,
			categorie : 'defaut',
			nom : '',
			infowindow : null,
			iconsRepertory : 'assets/img/maps_icons/',
			iconsFilePrefix : 'icon_',
			iconsExtension : '.svg',
			iconDefault : 'icon_depart'
			//iconDefault : 'http://maps.google.com/mapfiles/marker.png'
		}
		params = $.extend(defauts, params);

		var image = params.iconsRepertory+params.iconDefault+params.iconsExtension;
		if(params.categorie!='defaut'){
			image = params.iconsRepertory+params.iconsFilePrefix+params.categorie+params.iconsExtension;
		}
	    var marker = new google.maps.Marker({
	        position: params.position,
	        icon: image,
	        title: params.nom
	    });
	    marker.setMap(_this.carte);

	    if(params.infoWindow!=null){
	    	infowindow = _this.ajouterInfoWindow({
	    		marker : marker,
	    		infoWindow : params.infoWindow
	    	});
		}

	    _this.markers.push({
	    	marker : marker,
	    	type : params.type,
	    	infowindow : params.infowindow
	    });
	    return marker;
	};

	/*
	## changePositionMarker() ##
			Paramètre attendu : objet
				 {
				 	marker : objet google.maps.Marker
				 	position : objet google.maps.LatLng
				 }
	*/
	_this.changePositionMarker = function(params){
		var defauts = {
			position : null
		}
		params = $.extend(defauts, params);

		params.marker.setPosition(params.position);
	};

	/*
	## supprimerMarker() ##
			Paramètre attendu : objet
				 {
				 	marker : objet google.maps.Marker
				 }
	*/
	_this.supprimerMarker = function(params){
		var defauts = {
			marker : null
		}
		params = $.extend(defauts, params);

		params.marker.setMap(null);
		_this.markers = deleteValueFromArray(_this.markers,params.marker);
	};

	/*
	## ajouterInfoWindow() ##
			Paramètre attendu : objet
				 {
				 	marker : objet google.maps.Marker
				 	infoWindow : {
				 		content : String (content HTML)
				 	}
				 }
	*/
	_this.ajouterInfoWindow = function(params){
		var defauts = {
			infoWindow : {
				content : '',
				click : function(){}
			}
		}
		params = $.extend(defauts, params);

		var infowindow = new InfoBox({
			content: params.infoWindow.content,
			disableAutoPan: false,
			maxWidth: 0,
			pixelOffset: new google.maps.Size(0, -100),
			zIndex: null,
			boxStyle: _this.preferencesInfoWindow.style,
			//closeBoxMargin: "12px 4px 2px 2px",
			closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
			infoBoxClearance: new google.maps.Size(1, 1)
	    });

	    google.maps.event.addListener(params.marker, 'click', function() {
			infowindow.open(_this.carte,params.marker);
			params.infoWindow.open = infowindow;
			params.infoWindow.click.call(this,params);
		});

		return infowindow;
	};

	/*
	## nettoyer() ##
			Paramètre attendu : objet
				 {
				 	type : (facultatif) String
				 	finished : (facultatif) function
				 }
	*/
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
var Autocompletion = function(){

	var _this = this;
	var defauts = {
		inputText : '#autocomplete',
		divResultats : '#resultats_autocompletion'
	}

	/*
	## init() ##
	Paramètre attendu : objet
		 {
		 	inputText : String (selector)
		 	divResultats : String (selector)
		 }
	*/	
	_this.init = function(params){
		params = $.extend(defauts, params);

		_this.inputText = $(params.inputText);
		_this.divResultats = $(params.divResultats);
	}

	/*
	## rechercher() ##
			Paramètre attendu : aucun
	*/
	_this.rechercher = function(){
		var lieuRecherche = _this.inputText.val();
		var service = new google.maps.places.AutocompleteService();
	    service.getQueryPredictions({ input: lieuRecherche }, function(reponse, status){
	      if(status == google.maps.places.PlacesServiceStatus.OK) {
	        _this.afficherResultats({resultats : reponse});
	      }
	    });
	},

	/*
	## afficherResultats() ##
			Paramètre attendu : objet
				 {
				 	resultats : Array (résultatgoogle.maps.places.AutocompleteService)
				 }
	*/	
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

		_this.divResultats.find('li').on('click',function(){
          _this.inputText.val($(this).html());
          _this.inputText.nextAll('input[type="hidden"].ref_lieu').val($(this).attr('id'));
          _this.divResultats.html(htmlContent);
          //_this.inputText.siblings('input[type="hidden"].ref_lieu').val($(this).attr('id'));
          _this.divResultats.empty();
      	});
	}

};