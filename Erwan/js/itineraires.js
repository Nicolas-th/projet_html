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

var carte = {
	map : null,
	itineraires : [],
	points : {
		depart : null,
		arrivee : null,
		position : null
	},
	suivi : {
		position : null
	},
	infoWindow : {
		style : {
			background : '#FFF',
			width : '200px',
			padding : '5px'
		}
	}
};

carte.lieuxChoisis = function(){
	var lieux_choisis = [];
     $('#choix_lieux .ajouter_lieu.actif').each(function() {
        lieux_choisis.push($(this).parent('li').attr('id'));
     });
     return lieux_choisis;
}

carte.placerPoints = function(params){
	var defauts = {
		directionsServiceResponse : null,
		itinerairesTraces : function(){}
	}
	params = $.extend(defauts, params);

	if(typeof(params)=='object' && params.directionsServiceResponse!=null){
		var points = params.directionsServiceResponse.routes[0].overview_path;
		var str_points = "";
		for (var i = 0; i<points.length; i++) {
		  str_points+=points[i].lat()+','+points[i].lng()+';'
		}
		$.ajax({
		  type: "POST",
		  url: 'ajax/get_lieux_by_geolocalisation.xhr.php',
		  data: { 'points': str_points },
		  dataType: 'json',
		  success: function(data, textStatus, jqXHR){
		    if(data.code=='200'){

				var liste_lieux = '<div id="liste_lieux">';
				liste_lieux += '<p>Selectionner les lieux que vous souhaitez visiter :</p>';
				liste_lieux += '	<ul class="liste_lieux">';

				for(key in data.lieux) {
				lieu = data.lieux[key];

				liste_lieux+='<li id="'+lieu.id+'">';
				liste_lieux+=  '<label for="'+lieu.id+'">'+lieu.name+'</label>';
				liste_lieux+=  '<a href="#" class="ajouter_lieu">+</a>';
				liste_lieux+=  '<a href="#" class="voir_lieu">Voir</a>';
				liste_lieux+='</li>';

				}

				liste_lieux+='	</ul>';
				liste_lieux+='</div>';

				$('#choix_lieux').html(liste_lieux);

				var choix_transport = '<div class="choix_transport">';
				choix_transport += '	<a href="#" id="marche">A pieds</a>';
				choix_transport += '	<a href="#" id="velo">En vélo</a>';
				choix_transport += '	<a href="#" id="metro" class="actif">En métro</a>';
				choix_transport += '	<a href="#" id="voiture">En voiture</a>';
				choix_transport += '</div>';

				$('#liste_lieux').append(choix_transport);
				$('#liste_lieux').append('<button id="demarrer_itineraire">Démarrer l\'itinéraire</button>');
				$('#liste_lieux').append('<button id="enregistrer_itineraire">Enregistrer l\'itinéraire</button>');


				carte.tracerItineraire(params);

				/* Choix du mode de transport */
				$('.choix_transport a').on('click',function(){
					if(!$(this).hasClass('actif')){
						switch($(this).attr('id')){
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
						carte.map.setMoyenTransport({
							moyenTransport : transport
						});

						$('.choix_transport a').removeClass('actif');
						$(this).addClass('actif');
						carte.tracerItineraire(params);
					}
				});

				/* Choix des lieux */
				$('.ajouter_lieu').on('click',function(evt){
					evt.preventDefault();

					$(this).toggleClass('actif');

					carte.tracerItineraire(params);

				return false;
				});

				/* On démarrer le guidage et l'itineraire */
				$('#demarrer_itineraire').on('click',function(evt){
					evt.preventDefault();

					carte.map.nettoyer({ 
						type :'all',
						finished : function(){

							if(carte.suivi.position!=null){
								carte.points.position = null;
								navigator.geolocation.clearWatch(carte.suivi.position);
							}
							carte.suivi.position = navigator.geolocation.watchPosition(function(position) {

								var current_itineraire = carte.itineraires[0];
								var distance_arrivee = calculerDistancePoints(position.coords.latitude,position.coords.longitude,current_itineraire.arrivee.latitude,current_itineraire.arrivee.longitude);
								// Si l'itinéraire vient de démarrer ou que l'utilisateur s'est déplacé de plus de 10 mètres ou que l'arrivée est à moins de 50 mètres
								if(typeof(carte.points.position)==undefined || carte.points.position==null || (calculerDistancePoints(carte.points.position.coords.latitude,carte.points.position.coords.longitude,position.coords.latitude,position.coords.longitude)>0.01) || distance_arrivee<=0.05){

									carte.points.position = position; // On met à jour la position

									carte.map.nettoyer({ 
										type : 'all',
										finished : function(){
											//console.log(distance_arrivee+'km');
											if(distance_arrivee<=0.1){
												carte.itineraires = deleteValueFromArray(carte.itineraires,carte.itineraires[0]);
												current_itineraire = carte.itineraires[0];	// On met à jour l'itinéraire courant
											}

											var latLng_depart = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
											var latLng_arrivee = new google.maps.LatLng(current_itineraire.arrivee.latitude,current_itineraire.arrivee.longitude);
											carte.map.traceItineraire({
												points : {
													depart : latLng_depart,
													arrivee : latLng_arrivee
												},
												type : 'current_itineraire',
												finished : function(params){
													if(typeof(params)=='object' && typeof(params.directionsServiceResponse)!='undefined'){
														if(params.directionsServiceResponse.status=='OK'){
															if(params.directionsServiceResponse.routes.length>0){
																var legs = params.directionsServiceResponse.routes[0].legs;
																
																var htmlInstructions = '<ul>';

																for(i in legs){
																	var steps = legs[i].steps;
																	for(j in steps){
																		if(typeof(steps[j].instructions)!='undefined'){
																			htmlInstructions+='<li class="'+steps[j].maneuver+'">'+steps[j].instructions;
																			if(typeof(steps[j].steps)!='undefined'){
																				htmlInstructions += '<ul>';
																				var sousSteps = steps[j].steps;
																				for(k in sousSteps){
																					if(typeof(sousSteps[k].instructions)!='undefined'){
																						htmlInstructions+='<li class="'+sousSteps[k].maneuver+'">'+sousSteps[k].instructions+'</li>';
																					}
																				}
																				htmlInstructions += '</ul>';
																			}
																			htmlInstructions+='</li>';
																		}
																	}
																}
																htmlInstructions+='</ul>';
																$('#instructions_itineraire').empty().html(htmlInstructions);
															}
														}
													}
												}	
											});

											carte.map.ajouterMarker({
												position : latLng_depart,
									        	nom : 'Votre position',
									        	type : 'current_itineraire'
									        });
									        
									        carte.map.ajouterMarker({
												position : latLng_arrivee,
									        	nom : current_itineraire.arrivee.name,
									        	categorie : current_itineraire.arrivee.categorie,
									        	type : 'current_itineraire'
									        });
										}
									});	
								}
							});	
						}
					});


					return false;
				});

				$('#enregistrer_itineraire').on('click',function(evt){
					evt.preventDefault();
					var lieux_choisis = JSON.stringify(carte.lieuxChoisis());
					var depart = JSON.stringify({
						latitude : carte.points.depart.geometry.location.lat(),
						longitude : carte.points.depart.geometry.location.lng()
					});
					var arrivee = JSON.stringify({
						latitude : carte.points.arrivee.geometry.location.lat(),
						longitude : carte.points.arrivee.geometry.location.lng()
					});
    				$.ajax({
	                  type: "POST",
	                  url: 'ajax/save_itineraire.xhr.php',
	                  data: { 
	                  	'depart' : depart,
	                  	'arrivee' : arrivee,
	                  	'lieux' : lieux_choisis
	                  },
	                  async:false, // Important car bloque le script
	                  success: function(data, textStatus, jqXHR){
	                  	if(data=='connexion'){
	                  		alert('Vous devez être connecté.');
	                  	}else{
	                    	alert('itinéraire enregistré');
	                    }
	                  }
	                });
				});

		    }else{
		      console.log('Erreur '+data.code);
		    }
		  }
		});
	}
}

carte.tracerItineraire = function(params){
    var lieux_choisis = carte.lieuxChoisis();

	carte.map.nettoyer({
		type : 'all',
		finished : function(){

	         carte.itineraires = []; // On supprime les itinéraires en mémoire
	         for(var i=0; i<=lieux_choisis.length;i++){


	            /* Ici créer les différents trajets */
	            if(i==0){
	                depart = {
	                            adresse : carte.points.depart.address_components[0].long_name,
	                            ville : carte.points.depart.address_components[1].long_name,
	                            latitude : carte.points.depart.geometry.location.lat(),
	                            longitude : carte.points.depart.geometry.location.lng(),
	                            nom : carte.points.depart.address_components[0].long_name+', '+carte.points.depart.address_components[1].long_name,
	                            categorie : 'depart',
	                            type : 'borne'
	                          }
	            }
	            if(i>=lieux_choisis.length){;
	                arrivee = {
	                            adresse : carte.points.arrivee.address_components[0].long_name,
	                            ville : carte.points.arrivee.address_components[1].long_name,
	                            latitude : carte.points.arrivee.geometry.location.lat(),
	                            longitude : carte.points.arrivee.geometry.location.lng(),
	                            nom : carte.points.arrivee.address_components[0].long_name+', '+carte.points.arrivee.address_components[1].long_name,
	                            categorie : 'arrivee',
	                            type : 'borne'
	                          }
	            }else{
	                var infos_lieu = null;
	                $.ajax({
	                  type: "POST",
	                  url: 'ajax/get_lieu_by_id.xhr.php',
	                  data: { 'id_lieu': lieux_choisis[i] },
	                  dataType: 'json',
	                  async:false, // Important car bloque le script
	                  success: function(data, textStatus, jqXHR){
	                    if(data.code=='200'){
	                        infos_lieu = data.infos;
	                        infos_lieu['categorie'] = infos_lieu['categories_id'];
	                        infos_lieu['adresse'] = infos_lieu['adress'];
	                        infos_lieu['ville'] = infos_lieu['city'];
	                        infos_lieu['type'] = 'lieu';
	                    }
	                  }
	                });
	                arrivee = infos_lieu;
	            }

	            carte.itineraires.push({depart : depart, arrivee : arrivee});
	            depart = arrivee;
	         }
	         carte.map.tracerItineraires({
	         	trajets : carte.itineraires,
	         	key : 0,
	         	finished : function(){

	         		params.itinerairesTraces.call(this);

	         	}
	    	});
		}
    });
}

$(function(){

	 if(navigator.geolocation) {

	 	carte.map = new Carte();
		carte.map.init({
			element : document.getElementById('map')
		});
		carte.map.setStyleMap({
			style : stylesCarte
		});
		carte.map.setStyleInfoWindows({
			style : carte.infoWindow.style
		});
		//carte.map.setMoyenTransport({moyenTransport : google.maps.DirectionsTravelMode.WALKING});
	    navigator.geolocation.getCurrentPosition(function(currentPosition) {
	      carte.map.setCenter({
	      	position : new google.maps.LatLng(currentPosition.coords.latitude,currentPosition.coords.longitude)
	      });
	    });


	    $('#lieux_depart').keypress(function(){
      		var autocomplete = new Autocompletion();
      		autocomplete.init({ 
      			inputText : '#lieux_depart',
      			divResultats : '#resultats_lieux_depart'
      		});
      		autocomplete.rechercher();
      	});

      	$('#lieux_arrive').keypress(function(){
      		var autocomplete =  new Autocompletion();
      		autocomplete.init({  
      			inputText : '#lieux_arrive',
      			divResultats : '#resultats_lieux_arrive'
      		});
      		autocomplete.rechercher();
      	});

      	/* Gestion du formulaire */
		$('#formulaire_itineraire').on('submit',function(evt){
			evt.preventDefault();

			$('#choix_lieux, #instructions_itineraire').empty();
			$('#map').css('opacity','0');
			carte.map.nettoyer('all');

			var ref_lieux_depart = $('#ref_lieux_depart').val();
			var ref_lieux_arrive = $('#ref_lieux_arrive').val();
			if(ref_lieux_depart!='' && ref_lieux_arrive!=''){
				var service = new google.maps.places.PlacesService(document.getElementById('test'));
				service.getDetails({
				reference : ref_lieux_depart
				}, function(lieu_depart, status){
					carte.points.depart = lieu_depart;
					if (status == google.maps.places.PlacesServiceStatus.OK) {
					  service.getDetails({
					    reference : ref_lieux_arrive
					  }, function(lieu_arrivee, status){
					    carte.points.arrivee = lieu_arrivee;
					    if (status == google.maps.places.PlacesServiceStatus.OK) {
					      carte.map.traceItineraire({
					      	points : {
					      		depart : carte.points.depart.geometry.location,
					      		arrivee : carte.points.arrivee.geometry.location
					      	},
					      	type : 'itineraires_lieux',
				        	finished : function(params){
				        		params.itinerairesTraces = function(){
				        			alert('Chargement terminé !');
				         			$('#map').css('opacity','1');
				        		};
				        		carte.placerPoints(params);
				        	}
				          });  		     

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



/* Source originale : http://goo.gl/bWiu72 */
/* Retourne la distance en Km */
function calculerDistancePoints(lat1,lon1,lat2,lon2){
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	dist = dist * 1.609344;
	return Math.abs(dist);
}
