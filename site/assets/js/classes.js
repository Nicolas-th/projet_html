
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
	_this.infoWindow = {
		open : null
	};
	_this.defaults = {
		init : {
			element : '#carte',
			streetViewControl : false
		},
		setStyleMap : {
			style : {}
		},
		setStyleInfoWindows : {
			style : {}
		},
		setCenter : {
			position : {
				latitude : 48.851861,
				longitude : 2.420284
			}
		},
		setZoom : {
			zoom : 5
		},
		setMoyenTransport : {
			moyenTransport : 'metro'
		},
		tracerItineraires : {
			key : 0,
			trajets : [],
			duree : 0,
			finished : function(){}
		},
		traceItineraire : {
			points : {
				depart : null,
				arrivee : null,
			},
			type : null,
			preserveViewport : true,
			finished : function(){}
		},
		supprimerItineraire : {
			itineraire : null
		},
		ajouterMarker : {
			position : null,
			categorie : 'defaut',
			nom : '',
			infowindow : null,
			markers : {
				iconsRepertory : 'assets/img/maps_icons/',
				iconsFilePrefix : 'icon_',
				iconsExtension : '.svg',
				iconDefault : 'icon_depart'
			}
			//iconDefault : 'http://maps.google.com/mapfiles/marker.png'
		},
		changePositionMarker : {
			position : null
		},
		supprimerMarker : {
			marker : null
		},
		ajouterInfoWindow : {
			infoWindow : {
				content : '',
				disableAutoPan : false,
				maxWidth : 0,
				pixelOffset : {
					width : 0,
					height : -100
				},
				zIndex : null,
				style : '',
				closeBoxMargin : '2px',
				closeBoxURL : 'http://www.google.com/intl/en_us/mapfiles/close.gif',
				infoBoxClearance : {
					width : 1,
					height : 1
				},
				nettoyer : {
					type : null,
					finished : function(){}
				},
				click : function(){}
			}
		},
		nettoyer : {
			 type : null,
             finished : function(){}
		}

	}

	/*
	## init() ##
			Paramètre attendu : objet
				 {
					element : String (selector CSS3)
				 }
	*/
	_this.init = function(params){
		params = $.extend({},_this.defaults.init, params);

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
		params = $.extend({},_this.defaults.setStyleMap, params);
		_this.carte.mapTypes.set('map_style', new google.maps.StyledMapType(params.style));
	    _this.carte.setMapTypeId('map_style');
	};

	/*
	## setCenter() ##
			Paramètre attendu : objet
				 {
					position : objet google.maps.LatLng
				 }
	*/
	_this.setCenter = function(params){
		params = $.extend({},_this.defaults.setCenter, params);
		_this.carte.setCenter(new google.maps.LatLng(params.position.latitude,params.position.longitude));
	};

	/*
	## setZoom() ##
			Paramètre attendu : objet
				 {
					zoom : int
				 }
	*/
	_this.setZoom = function(params){
		params = $.extend({},_this.defaults.setZoom, params);
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
		params = $.extend({},_this.defaults.setMoyenTransport, params);
		switch(params.moyenTransport){
			case 'marche':
				var transport = google.maps.DirectionsTravelMode.WALKING;
				break;
			case 'velo':
				var transport = google.maps.DirectionsTravelMode.BICYCLING;
				break;
			case 'voiture':
				var transport = google.maps.DirectionsTravelMode.DRIVING;
				break;
			default :
				var transport = google.maps.DirectionsTravelMode.TRANSIT;
		}
		_this.preferencesItineraire.moyenTransport = transport;
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
		params = $.extend({},_this.defaults.tracerItineraires, params);
		if(typeof(params.trajets[params.key])!='undefined'){
	        var latLng_depart = new google.maps.LatLng(params.trajets[params.key].depart.latitude,params.trajets[params.key].depart.longitude);
	        var latLng_arrivee = new google.maps.LatLng(params.trajets[params.key].arrivee.latitude,params.trajets[params.key].arrivee.longitude);

	        var positions = {
	        	depart :{
					latitude : params.trajets[params.key].depart.latitude,
					longitude : params.trajets[params.key].depart.longitude
				},
				arrivee : {
					latitude : params.trajets[params.key].arrivee.latitude,
					longitude : params.trajets[params.key].arrivee.longitude
				}
			}

			for(var i=0;i<2;i++){
				if(i==0){
					var positionMarker = positions.depart;
					var infos = params.trajets[params.key].depart;
				}else{
					var positionMarker = positions.arrivee;
					var infos = params.trajets[params.key].arrivee;
				}
		        _this.ajouterMarker({
		        	position : positionMarker,
		        	nom : infos.nom,
		        	categorie : infos.categorie,
		        	type : 'itineraires_lieux',
		        	infoWindow : {
		        		content: '<p class="nom_lieu">'+infos.name+'</p>',
		        		click : function(params){
		                    if(_this.infoWindow.open!=null){
			                      _this.infoWindow.open.close();
			                }
			                _this.infoWindow.open = params.infoWindow.open; // On enregistre l'infowindow ouverte pour pouvoir la fermer plsu tard
	                  	}
		        	}
		        });
			}

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
		params = $.extend({},_this.defaults.traceItineraire, params);
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
		params = $.extend({},_this.defaults.supprimerItineraire, params);
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
		params = $.extend({},_this.defaults.ajouterMarker, params);
		var image = params.markers.iconsRepertory+params.markers.iconDefault+params.markers.iconsExtension;
		if(params.categorie!='defaut'){
			image = params.markers.iconsRepertory+params.markers.iconsFilePrefix+params.categorie+params.markers.iconsExtension;
		}
	    var marker = new google.maps.Marker({
	        position: new google.maps.LatLng(params.position.latitude,params.position.longitude),
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
		params = $.extend({},_this.defaults.changePositionMarker, params);
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
		params = $.extend({},_this.defaults.supprimerMarker, params);
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
		$.extend(params,_this.defaults.ajouterInfoWindow);
		var infowindow = new InfoBox({
			content: params.infoWindow.content,
			disableAutoPan: params.infoWindow.disableAutoPan,
			maxWidth: params.infoWindow.maxWidth,
			pixelOffset: new google.maps.Size(params.infoWindow.pixelOffset.width, params.infoWindow.pixelOffset.height),
			zIndex: params.infoWindow.zIndex,
			boxStyle: params.infoWindow.style,
			closeBoxMargin: params.infoWindow.closeBoxMargin,
			closeBoxURL: params.infoWindow.closeBoxURL,
			infoBoxClearance: new google.maps.Size(params.infoWindow.infoBoxClearance.width, params.infoWindow.infoBoxClearance.height)
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
		params = $.extend({},_this.defaults.nettoyer, params);
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
		params = $.extend({},defauts, params);

		_this.inputText = $(params.inputText);
		_this.divResultats = $(params.divResultats);
		_this.defaults = {
			afficherResultats : {
				resultats : []
			}
		}
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
		params = $.extend({},_this.defaults.afficherResultats, params);
		var htmlContent = '';
		for (var i = 0; i<params.resultats.length; i++) {
			htmlContent += '<li id="'+params.resultats[i].reference+'">' + params.resultats[i].description + '</li>';
		}
		_this.divResultats.html(htmlContent);

		_this.divResultats.find('li').on('click',function(){
          _this.inputText.val($(this).html());
          _this.inputText.nextAll('input[type="hidden"].ref_lieu').val($(this).attr('id'));
          _this.divResultats.html(htmlContent);
          _this.divResultats.empty();
      	});
	}

};