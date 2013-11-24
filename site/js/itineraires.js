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
			padding : '5px',
			color: '#000'
		}
	},
	markers : {
		iconsRepertory : 'assets/img/maps_icons/',
		iconsFilePrefix : 'icon_',
		iconsExtension : '.svg',
		iconDefault : 'icon_depart'
	},
	defaults : {
		rechercherLieux : {
			points : [],
			success : function(){},
			error : function(){}
		},
		lancerRechercheLieux : {
			directionsServiceResponse : null,
			itinerairesTraces : function(){}
		},
		tracerItineraires : {
			itinerairesTraces : function(){}
		}
	}
};

carte.lieuxChoisis = function(){
	var lieux_choisis = [];
     $('#resultat_lieux .ajouter_lieu.actif').each(function() {
        lieux_choisis.push($(this).parents('li').first().attr('id'));
     });
     return lieux_choisis;
}

carte.rechercherLieux = function(params){
	params = $.extend({}, carte.defaults.rechercherLieux, params);
	var str_points = "";
	for (var i = 0; i<params.points.length; i++) {
	  str_points+=params.points[i].latitude+','+params.points[i].longitude+';'
	}
	$.ajax({
	  type: "POST",
	  url: 'ajax/get_lieux_by_geolocalisation.xhr.php',
	  data: { 'points': str_points },
	  dataType: 'json',
	  success: function(data, textStatus, jqXHR){
	  	params.success.call(this,data, textStatus, jqXHR);
	  },
	  error :  function(data, textStatus, jqXHR){
	  	params.error.call(this,data, textStatus, jqXHR);
	  }
	});
}

carte.lancerRechercheLieux = function(params){
	params = $.extend({}, carte.defaults.lancerRechercheLieux, params);
	if(typeof(params)=='object' && params.directionsServiceResponse!=null){
		var points = params.directionsServiceResponse.routes[0].overview_path;

		var tabPoints = [];
		for(key in points){
			tabPoints.push({
				latitude : points[key].lat(), 
				longitude : points[key].lng()
			});
		}

		carte.rechercherLieux({
			points : tabPoints,
			success: function(data, textStatus, jqXHR){
				if(data.code=='200'){

					var liste_lieux = '<p>Selectionner les lieux que vous souhaitez visiter :</p>';
					liste_lieux += '<ul>';

					for(key in data.lieux) {
						lieu = data.lieux[key];

						var image = carte.markers.iconsRepertory+carte.markers.iconsFilePrefix+lieu.categories_id+carte.markers.iconsExtension;

						liste_lieux+='<li id="'+lieu.id+'">';
						liste_lieux+=  '<img src="'+image+'" width="20" height="20">';
						liste_lieux+=  '<label for="'+lieu.id+'">'+lieu.name+'</label>';
						liste_lieux+=  '<div class="icons">';
						liste_lieux+=  '	<a href="#" class="ajouter_lieu">+</a>';
						liste_lieux+=  '	<a href="'+lieu.href+'" class="voir_lieu ajax-link">Voir</a>';
						liste_lieux+='	</div>';
						liste_lieux+='</li>';

					}

					liste_lieux+='</ul>';

					$('#resultat_lieux').html(liste_lieux);
					$('#resultat_lieux').append('<button id="demarrer_itineraire">Démarrer</button>');
					$('#resultat_lieux').append('<button id="enregistrer_itineraire">Enregistrer</button>');
				}else if(data.code=='404'){
					var message = '<p>Aucun lieu n\'a été trouvé sur votre itinéraire. </p>';
					message += '<a href="#">Vous en connaissez un ? Partagez-le !</a>';
					$('#resultat_lieux').html(message);
				}else{
					console.log('Erreur '+data.code);
				}

				carte.tracerItineraire(params);

				/* Choix du mode de transport */
				$('.choix_transport a').off('click').on('click',function(){
					if(!$(this).hasClass('actif')){

						carte.map.setMoyenTransport({
							moyenTransport : $(this).attr('id')
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
											if(distance_arrivee<=0.1){
												carte.itineraires = deleteValueFromArray(carte.itineraires,carte.itineraires[0]);
												current_itineraire = carte.itineraires[0];	// On met à jour l'itinéraire courant
											}

											// A supprimer à terme
											//var latLng_depart = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
											//var latLng_arrivee = new google.maps.LatLng(current_itineraire.arrivee.latitude,current_itineraire.arrivee.longitude);
											
											var points = {
												depart : {
													latitude : position.coords.latitude,
													longitude : position.coords.longitude
												},
												arrivee : {
													latitude : current_itineraire.arrivee.latitude,
													longitude : current_itineraire.arrivee.longitude
												}
											}

											carte.map.traceItineraire({
												points : {
													depart : points.depart,
													arrivee : points.arrivee
												},
												type : 'current_itineraire',
												finished : function(returns){
													if(typeof(returns)=='object' && typeof(returns.directionsServiceResponse)!='undefined'){
														if(returns.directionsServiceResponse.status=='OK'){
															// On centre sur la position de l'utilisateur
															carte.map.setZoom({
																zoom : 15
															});
															carte.map.setCenter({
																position: points.depart
															});

															if(returns.directionsServiceResponse.routes.length>0){
																var legs = returns.directionsServiceResponse.routes[0].legs;
																
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
																$('#resultat_lieux').hide();
																$('#guidage_itineraire').empty();

																var duree = secondesToDuree(returns.directionsServiceResponse.routes[0].legs[0].duration.value);
											        			if($('.duree_itineraires').length>0){
											        				$('.duree_itineraires').remove();
											        			}
																$('#guidage_itineraire').append('<button id="modifier_itineraire">Modifier</button>');
																$('#guidage_itineraire').append($('<p class="duree_itineraires"></p>').html('Durée estimée : '+duree));

											        			$('#guidage_itineraire').append($('<div class="instructions_itineraire"></div>').append(htmlInstructions));
																$('#guidage_itineraire').show();

																$('#modifier_itineraire').on('click',function(){
																	$('#resultat_lieux').show();
																	$('#guidage_itineraire').hide();
																});
															}
														}
													}
												}	
											});

											carte.map.ajouterMarker({
												position : points.depart,
									        	nom : 'Votre position',
									        	type : 'current_itineraire'
									        });
									        
									        carte.map.ajouterMarker({
												position : points.arrivee,
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
	                  dataType: 'json',
	                  data: { 
	                  	'depart' : depart,
	                  	'arrivee' : arrivee,
	                  	'lieux' : lieux_choisis
	                  },
	                  async:false, // Important car bloque le script
	                  success: function(data, textStatus, jqXHR){
	                  	if(data.code==200){
	                    	alert('itinéraire enregistré');
	                  	}else if(data.code==403){
	                  		alert('Vous devez être connecté.');
	                    }
	                  }
	                });
				});
		  	},
		  	error :function(){
		  		alert('Erreur interne. Veuillez recommencer.');
		  	}
		});
	}
}

carte.tracerItineraire = function(params){
	params = $.extend({}, carte.defaults.tracerItineraire, params);
    var lieux_choisis = carte.lieuxChoisis();

    $('#guidage_itineraire').empty();

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
	         	finished : function(returns){
	         		params.itinerairesTraces.call(this,returns);
	         	}
	    	});
		}
    });
}


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

function secondesToDuree(time){
	var sec_num = parseInt(time, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    return hours+'h'+minutes+'min';
}