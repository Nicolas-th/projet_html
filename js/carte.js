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
			streetViewControl : false,
			zoom : 15,
			center : {
				latitude : 48.858565,
				longitude : 2.347198
			},
			scrollwheel: true,
		    navigationControl: true,
		    mapTypeControl: true,
		    scaleControl: true,
		    draggable: true
		},
		setStyleMap : {
			url : null,
			key : null
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
			finished : function(){},
			noResults : function(){
				alert('Pas de résultats');
			},
			error : function(){
				alert('Une erreur s\'est produite...');
			},
			overQueryLimit : {
				delay : 1000,
				callback : function(){
					console.log('OVER_QUERY_LIMIT');
				}
			}
		},
		supprimerItineraire : {
			itineraire : null
		},
		ajouterMarker : {
			position : null,
			categorie : 'defaut',
			nom : '',
			infowindow : null,
			marker : {
				iconsRepertory : 'assets/img/maps_icons/',
				iconsFilePrefix : 'icon_',
				iconsExtension : '.svg',
				iconDefault : 'icon_depart',
				click	: function(){}
			}
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
		},
		getPointsItineraire : {

		},
		getInstructionsItineraire : {

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
		params = $.extend(true, {},_this.defaults.init, params);

	    _this.carte = new google.maps.Map(
	    	params.element,
	    	{
	      		mapTypeId: google.maps.MapTypeId.ROADMAP,
	     		zoom: params.zoom,
	      		streetViewControl : params.streetViewControl,
	      		center : new google.maps.LatLng(params.center.latitude,params.center.longitude),
	      		scrollwheel: params.scrollwheel,
			    navigationControl: params.navigationControl,
			    mapTypeControl: params.mapTypeControl,
			    scaleControl: params.scaleControl,
			    draggable: params.draggable
	    	}
	    );
	};

	/*
	## setStyleMap() ##
			Paramètre attendu : objet
				 {
					url : url (vers un fichier json),
					key : 
				 }
	*/
	_this.setStyleMap = function(params){
		params = $.extend(true, {},_this.defaults.setStyleMap, params);
		if(params.url!=null && params.key!=null){
			$.getJSON(params.url, function(datas) {
				var styles = datas[params.key];
				_this.carte.mapTypes.set('map_style', new google.maps.StyledMapType(styles));
		    	_this.carte.setMapTypeId('map_style');
			});
		}
	};

	/*
	## setCenter() ##
			Paramètre attendu : objet
				 {
					position : objet {latitude, longitude}
				 }
	*/
	_this.setCenter = function(params){
		params = $.extend(true, {},_this.defaults.setCenter, params);
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
		params = $.extend(true, {},_this.defaults.setZoom, params);
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
		params = $.extend(true, {},_this.defaults.setMoyenTransport, params);
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
							categorie : int,
							marker : {
								click : function (optionnelle)
							}
						},
						arrivee : {
							latitude : String,
							longitude : String,
							nom : String,
							categorie : int,
							marker : {
								click : function (optionnelle)
							}
						}
					],
					key : int
				 }
	*/
	_this.tracerItineraires = function(params){
		params = $.extend(true, {},_this.defaults.tracerItineraires, params);
		if(typeof(params.trajets[params.key])!='undefined'){

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

				if(typeof(infos.marker)=='undefined' || typeof(infos.marker.click)=='undefined'){
					if(typeof(infos.marker)=='undefined'){
						infos.marker = {};
					}
					infos.marker.click = function(){};
				}

		        _this.ajouterMarker({
		        	position : positionMarker,
		        	nom : infos.nom,
		        	categorie : infos.categorie,
		        	type : 'itineraires_lieux',
		        	click : infos.marker.click
		        });
			}

	        params.key++; // On incrémente pour le prochain itinéraire

	        _this.traceItineraire({
	        	points : {
	        		depart : positions.depart,
	        		arrivee : positions.arrivee
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
	    	/* Lorsque le chargement des itinéraires est terminé on centre la carte sur l'itinéraire */
	    	var bounds = new google.maps.LatLngBounds();
    		for(key in _this.markers){
    			if(_this.markers[key].type=="itineraires_lieux"){
    				bounds.extend(_this.markers[key].marker.position);
    			}
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
		params = $.extend(true, {},_this.defaults.traceItineraire, params);
		var request = {
	        origin      : new google.maps.LatLng(params.points.depart.latitude,params.points.depart.longitude),
	        destination : new google.maps.LatLng(params.points.arrivee.latitude,params.points.arrivee.longitude),
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
	        	params.overQueryLimit.callback.call(this);
	        	setTimeout(
	        		function(){
	        			var directionsRenderer = _this.traceItineraire(params);
	        			return directionsRenderer;
	        		},
	        		params.overQueryLimit.delay
	        	);
	        }else if(status == google.maps.DirectionsStatus.ZERO_RESULTS){
	        	params.noResults.call(this);
	        }else{
	        	params.error.call(this);
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
		params = $.extend(true, {},_this.defaults.supprimerItineraire, params);
		params.itineraire.setMap(null);
		_this.itineraires = deleteValueFromArray(_this.itineraires,params.itineraire);
	};

	/*
	## ajouterMarker() ##
			Paramètre attendu : objet
				 {
				 	position : objet {latitude, longitude}
					categorie : int,
					nom : String,
					infoWindow : (optionnel) {
						content : String (content HTML)
					}
				 }
	*/
	_this.ajouterMarker = function(params){
		params = $.extend(true, {},_this.defaults.ajouterMarker, params);
		var image = params.marker.iconsRepertory+params.marker.iconDefault+params.marker.iconsExtension;
		if(params.categorie!='defaut'){
			image = params.marker.iconsRepertory+params.marker.iconsFilePrefix+params.categorie+params.marker.iconsExtension;
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
	    	google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(_this.carte,marker);
				params.infoWindow.open = infowindow;
				params.marker.click.call(this,params);
				params.infoWindow.click.call(this,params);
			});
		}else{
			google.maps.event.addListener(marker, 'click', function() {
				params.marker.click.call(this,params);
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
		params = $.extend(true, {},_this.defaults.changePositionMarker, params);
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
		params = $.extend(true, {},_this.defaults.supprimerMarker, params);
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
		params = $.extend(true, {}, _this.defaults.ajouterInfoWindow, params);
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
		params = $.extend(true, {},_this.defaults.nettoyer, params);
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

	_this.getPointsItineraire = function(params){
		params = $.extend(true, {},_this.defaults.getPointsItineraire, params);
		var points = params.directionsServiceResponse.routes[0].overview_path;

		var tabPoints = [];
		for(key in points){
			tabPoints.push({
				latitude : points[key].lat(), 
				longitude : points[key].lng()
			});
		}
		return tabPoints;
	};

	_this.getInstructionsItineraire = function(params){
		params = $.extend(true, {},_this.defaults.getInstructionsItineraire, params);

		var instructions = [];
		if(typeof(params.directionsServiceResponse)!='undefined'){
        	if(params.directionsServiceResponse.status=='OK'){
        		if(params.directionsServiceResponse.routes.length>0){
                    var legs = params.directionsServiceResponse.routes[0].legs;
                    
                    var cpt_instructions = 0;

                    for(i in legs){
                        var steps = legs[i].steps;
                        for(j in steps){
                            if(typeof(steps[j].instructions)!='undefined'){
                            	instructions[cpt_instructions] = {
                            		type : steps[j].maneuver,
                            		texte : steps[j].instructions,
                            		sousInstructions : []
                            	}
                                if(typeof(steps[j].steps)!='undefined'){
                                	var cpt_sousInstructions = 0;
                                    var sousSteps = steps[j].steps;
                                    for(k in sousSteps){
                                        if(typeof(sousSteps[k].instructions)!='undefined'){
                                        	instructions[cpt_instructions].sousInstructions[cpt_sousInstructions] = {
                                        		type : sousSteps[k].maneuver,
                            					texte : sousSteps[k].instructions
                                        	}
                                        }
                                        cpt_sousInstructions++;
                                    }
                                }
                                cpt_instructions++;
                            }
                        }
                    }
                }
        	}
        }
        return instructions;
	}

	_this.getDureeItineraire = function(params){
		var retour = 0;
		if(typeof(params.directionsServiceResponse)!='undefined'){
			var retour = params.directionsServiceResponse.routes[0].legs[0].duration.value;
		}
		return retour;
	}
};