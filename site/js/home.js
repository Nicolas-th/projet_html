var carte = {
    map : null, // classe
    itineraire : null,  // classe
    autocompletion : null,  // classe
    transition : null,  // classe
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
    }
};

$(function () {

    // Initialisation des transition
    carte.transition = new Transition();
    carte.transition.init({
        conteneur: 'body',
        pages: [{
            element: '#navigation-ajax',
            links: {
                open: '.ajax-link',
                close: '.close-ajax-page,.overlay'
            }
        }]
    });

    redimentionnerMap();

    $(window).on('resize', function () {
        redimentionnerMap();
    });


    /* Instantiation de la classe Carte */
    carte.map = new Carte();
    carte.map.init({
        element: document.getElementById('map-canvas'),
        mapTypeControl: false
    });
    carte.map.setStyleMap({
        url: 'js/config.json',
        key: 'mapStyle'
    });

    /* Instantiation de la classe Itineraire */
    carte.itineraire = new Itineraire();

    /* Instantiation de la classe Autocompletion */
    carte.autocompletion = new Autocompletion();

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            function (positionGeoc) { // success


                carte.autocompletion.init({
                       location : {
                            latitude: positionGeoc.coords.latitude,
                            longitude: positionGeoc.coords.longitude
                       },
                       retriction : {country: 'fr'},
                       rankBy : 'distance'
                });


                var initialPosition = {
                    latitude: positionGeoc.coords.latitude,
                    longitude: positionGeoc.coords.longitude
                };
                carte.map.setCenter({
                    position: initialPosition
                });
                carte.map.ajouterMarker({
                    position: initialPosition,
                    nom: 'Votre position'
                });
               carte.itineraire.rechercherLieux({
                    points: [initialPosition],
                    success: function (data, textStatus, jqXHR) {
                        if (data.code == '200') {
                            for (key in data.lieux) {
                                var current = data.lieux[key];
                                var currentPosition = {
                                    latitude: current.latitude,
                                    longitude: current.longitude
                                };
                                carte.map.ajouterMarker({
                                    position: currentPosition,
                                    categorie: current.categories_id,
                                    nom: current.name,
                                    href: current.href,
                                    click : function(params){
                                    	carte.transition.open({
                                        	element: '#navigation-ajax'
                                      },params.href);
                                    }
                                });
                            }
                        }
                    }
                })
            },
            function () { // error
                $('#position').remove();
                carte.map.setCenter({
                    position: {
                        latitude: 48.857713,
                        longitude: 2.347271,
                    }
                });

                carte.autocompletion.init({
                       location : {
                            latitude: positionGeoc.coords.latitude,
                            longitude: positionGeoc.coords.longitude
                       },
                       retriction : {country: 'fr'},
                       rankBy : 'distance'
                });
            }
        );

        $('#position').on('click', function (evt) {
            evt.preventDefault();
            $('#resultats_lieux_depart').empty();
            navigator.geolocation.getCurrentPosition(function (currentPosition) {
                $('input[name="latitude_position"]').val(currentPosition.coords.latitude);
                $('input[name="longitude_position"]').val(currentPosition.coords.longitude);
                $('#lieux_depart').val('Ma position');
                $('#ref_lieux_depart').val('position');
            });
        });

    } else {
        $('#position').remove();
        carte.map.setCenter({
            position: {
                latitude: 48.857713,
                longitude: 2.347271,
            }
        });
        carte.autocompletion.init({
               location : {
                    latitude: positionGeoc.coords.latitude,
                    longitude: positionGeoc.coords.longitude
               },
               retriction : {country: 'fr'},
               rankBy : 'distance'
        });
    }

    $('#lieux_depart').on('keyup', function (evt) {
        var keyCode = evt.keyCode || evt.which;
        if (keyCode == 9) { // Touche Tab
            if ($('#ref_lieux_depart').val() == '') {
                evt.preventDefault();
                $('#ref_lieux_depart').val($('#resultats_lieux_depart li').first().attr('id'));
                $('#lieux_depart').val($('#resultats_lieux_depart li').first().html());
                $('#resultats_lieux_depart').empty();
            }

        } else if (keyCode != 13) { // Touche entrée
            $('input[name="latitude_position"]', 'input[name="longitude_position"]').val('');
            $('#ref_lieux_depart').val('');
            carte.autocompletion.rechercher({
                value: $('#lieux_depart').val(),
                finished: function (params) {
                    var divResultats = $('#resultats_lieux_depart');
                    var htmlContent = '';
                    for (var i = 0; i < params.resultats.length; i++) {
                        htmlContent += '<li id="' + params.resultats[i].reference + '">' + params.resultats[i].description + '</li>';
                    }
                    divResultats.html(htmlContent);

                    divResultats.find('li').on('click', function () {
                        $('#lieux_depart').val($(this).html());
                        $('#lieux_depart').nextAll('input[type="hidden"].ref_lieu').val($(this).attr('id'));
                        divResultats.html(htmlContent);
                        divResultats.empty();
                    });
                }
            });
        }
    });

    $('#lieux_arrive').on('keyup', function (evt) {
        var keyCode = evt.keyCode || evt.which;
        if (keyCode == 9) {
            if ($('#ref_lieux_arrive').val() == '') {
                evt.preventDefault();
                $('#ref_lieux_arrive').val($('#resultats_lieux_arrive li').first().attr('id'));
                $('#lieux_arrive').val($('#resultats_lieux_arrive li').first().html());
                $('#resultats_lieux_arrive').empty();
            }

        } else if (keyCode != 13) { // Touche entrée
            $('#ref_lieux_arrive').val('');
            carte.autocompletion.rechercher({
                value: $('#lieux_arrive').val(),
                finished: function (params) {
                    var divResultats = $('#resultats_lieux_arrive');
                    var htmlContent = '';
                    for (var i = 0; i < params.resultats.length; i++) {
                        htmlContent += '<li id="' + params.resultats[i].reference + '">' + params.resultats[i].description + '</li>';
                    }
                    divResultats.html(htmlContent);

                    divResultats.find('li').on('click', function () {
                        $('#lieux_arrive').val($(this).html());
                        $('#lieux_arrive').nextAll('input[type="hidden"].ref_lieu').val($(this).attr('id'));
                        divResultats.html(htmlContent);
                        divResultats.empty();
                    });
                }
            });
        } else {
            $('#formulaire_itineraire').submit();
        }
    });

    /* Choix du mode de transport */
    $('.choix_transport a').on('click', function () {
        if (!$(this).hasClass('actif')) {

            carte.map.setMoyenTransport({
                moyenTransport: $(this).attr('id')
            });

            $('.choix_transport a').removeClass('actif');
            $(this).addClass('actif');
            //carte.tracerItineraire(params);
        }
    });

    /* Gestion du formulaire */
    $('#formulaire_itineraire').on('submit', function (evt) {
        evt.preventDefault();

        $('#choix_lieux').remove();
        $('#guidage_itineraire').empty();
        carte.map.nettoyer('all');

        var ref_lieux_depart = $('#ref_lieux_depart').val();
        var ref_lieux_arrive = $('#ref_lieux_arrive').val();
        if (ref_lieux_depart != '') {
            if (ref_lieux_arrive != '' || (ref_lieux_arrive == '' && $('#resultats_lieux_arrive li').length > 0)) {

                 lancerLoader();

                if (ref_lieux_arrive == '' && $('#resultats_lieux_arrive li').length > 0) {
                    ref_lieux_arrive = $('#resultats_lieux_arrive li').first().attr('id');
                    $('#lieux_arrive').val($('#resultats_lieux_arrive li').first().html());
                    $('#resultats_lieux_arrive').empty();
                }

                if ($('#ref_lieux_depart').val() != 'position') {
                   carte.autocompletion.getPosition({
                        reference : ref_lieux_depart,
                        success : function(place_depart,status){
                            carte.points.depart = place_depart;
                            carte.autocompletion.getPosition({
                                reference : ref_lieux_arrive,
                                success : function(place_arrivee,status){
                                    carte.points.arrivee = place_arrivee;

                                    carte.map.traceItineraire({
                                        points: {
                                            depart:  carte.points.depart.position,
                                            arrivee: carte.points.arrivee.position
                                        },
                                        type: 'itineraires_lieux',
                                        finished: function (params) {
                                            var duree = secondesToDuree(params.duree);
                                            if ($('.duree_itineraires').length == 0) {
                                                $('.choix_transport').after('<p class="duree_itineraires"></p>');
                                            }
                                            $('.duree_itineraires').html('Durée estimée : ' + duree);

                                            var points = carte.map.getPointsItineraire(params);
                                            lancerRechercheLieux({
                                                points : points,
                                                finished : function(){
                                                    arreterLoader();
                                                }
                                            });
                                        },
                                        noResults : function(){
                                            arreterLoader();
                                            alert('Pas de résultats');
                                            arreterLoader();
                                        },
                                        error : function(){
                                            arreterLoader();
                                            alert('Une erreur s\'est produite...');
                                        }
                                    });
                                },
                                error : function(){
                                    arreterLoader();
                                    alert('Lieu d\'arrivée inconnu.');
                                }
                            });
                        },
                        error : function(){
                            arreterLoader();
                            alert('Lieu de départ inconnu.');
                        }
                    });
                } else {
                    var positionDepart = {
                        position : {
                            latitude : $('input[name="latitude_position"]').val(),
                            longitude : $('input[name="longitude_position"]').val()
                        },
                        adresse : 'Votre position',
                        ville : ''
                    }
                    carte.points.depart = positionDepart;
                    carte.autocompletion.getPosition({
                        reference : ref_lieux_arrive,
                        success : function(place_arrivee,status){
                            carte.points.arrivee = place_arrivee;

                            carte.map.traceItineraire({
                                points: {
                                    depart:  carte.points.depart.position,
                                    arrivee: carte.points.arrivee.position
                                },
                                type: 'itineraires_lieux',
                                finished: function (params) {
                                    var duree = secondesToDuree(carte.map.getDureeItineraire(params));
                                    if ($('.duree_itineraires').length == 0) {
                                        $('.choix_transport').after('<p class="duree_itineraires"></p>');
                                    }
                                    $('.duree_itineraires').html('Durée estimée : ' + duree);

                                    var points = carte.map.getPointsItineraire(params);
                                    lancerRechercheLieux({
                                        points : points,
                                        finished : function(){
                                            arreterLoader();
                                        }
                                    });
                                },
                                noResults : function(){
                                    arreterLoader();
                                    alert('Pas de résultats');
                                    arreterLoader();
                                },
                                error : function(){
                                    arreterLoader();
                                    alert('Une erreur s\'est produite...');
                                }
                            });
                        },
                        error : function(){
                            arreterLoader();
                            alert('Lieu d\'arrivée inconnu.');
                        }
                    });
                }
            } else {
                alert('Vous devez choisir un lieu de destination');
            }
        } else {
            alert('Vous devez choisir un lieu de départ et de destination');
        }
        return false;
    });

});

function redimentionnerMap() {
    $('#map-canvas').css({
        width: window.innerWidth,
        height: window.innerHeight,
    });
}

function getLieuxChoisis(){
    var lieux_choisis = [];
     $('#resultat_lieux .ajouter_lieu.actif').each(function() {
        lieux_choisis.push($(this).parents('li').first().attr('id'));
     });
     return lieux_choisis;
}

function lancerRechercheLieux(params){
    carte.itineraire.rechercherLieux({
        points : params.points,
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
                    liste_lieux+=  '    <a href="#" class="ajouter_lieu">+</a>';
                    liste_lieux+=  '    <a href="'+lieu.href+'" class="voir_lieu ajax-link">Voir</a>';
                    liste_lieux+='  </div>';
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

            if(typeof(params.finished)=='function'){
                tracerItineraires({
                    itinerairesTraces : params.finished
                });
            }

            /* Choix du mode de transport */
            $('.choix_transport a').off('click').on('click',function(){
                if(!$(this).hasClass('actif')){

                    carte.map.setMoyenTransport({
                        moyenTransport : $(this).attr('id')
                    });

                    $('.choix_transport a').removeClass('actif');
                    $(this).addClass('actif');
                    tracerItineraires();
                }
            });

            /* Choix des lieux */

            $('#resultat_lieux li').on('click',function(evt){
                evt.preventDefault();
                var href = $(this).find('.voir_lieu').first().attr('href');
                carte.transition.open({
                    element: '#navigation-ajax'
                },href);
            });

            $('.ajouter_lieu').on('click',function(evt){
                evt.preventDefault();
                $(this).toggleClass('actif');
                tracerItineraires();
            });

            /* On démarrer le guidage et l'itineraire */
            $('#demarrer_itineraire').on('click',function(evt){
                evt.preventDefault();

                lancerLoader();

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
                                            current_itineraire = carte.itineraires[0];  // On met à jour l'itinéraire courant
                                        }
           
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

                                                // On centre sur la position de l'utilisateur
                                                carte.map.setZoom({
                                                    zoom : 15
                                                });
                                                carte.map.setCenter({
                                                    position: points.depart
                                                });

                                                var instructions = carte.map.getInstructionsItineraire(returns);

                                                var htmlInstructions = '<ul>';

                                                for(i in instructions){
                                                     htmlInstructions+='<li class="'+instructions[i].type+'">'+instructions[i].texte;
                                                     if(instructions[i].sousInstructions.length>0){
                                                        htmlInstructions += '<ul>';
                                                        for(j in instructions[i].sousInstructions){
                                                            htmlInstructions+='<li class="'+instructions[i].sousInstructions[j].type+'">'+instructions[i].sousInstructions[j].texte+'</li>';
                                                        }
                                                        htmlInstructions += '</ul>';
                                                     }
                                                     htmlInstructions += '</li>';
                                                }
                                                htmlInstructions += '</ul>';

                                                $('#resultat_lieux').hide();
                                                $('#guidage_itineraire').empty();


                                                var duree = secondesToDuree(carte.map.getDureeItineraire(returns));
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

                                                arreterLoader();
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
            });

            $('#enregistrer_itineraire').on('click',function(evt){
                evt.preventDefault();

                $('#save-itineraire-modal .md-content').empty().append('<p>Enregistrement de l\'itinéraire</p>');
                $('#save-itineraire-modal .md-content').append('<a href="#" class="md-close"><img src="assets/img/close.png" alt="close"></a>');
                $('#save-itineraire-modal .md-content').append($('<form method="post" action=""></form>').append('<input type="text" name="name" placeholder="Nom de l\'itinéraire" id="name" required><br>').append('<input type="submit" name="submit_signin" value="Enregistrer">'));

                $('#save-itineraire-modal').addClass('md-show');
                $('.md-overlay').addClass('show');

                $('.md-overlay, #save-itineraire-modal .md-close').on('click',function(){
                     $('#save-itineraire-modal').removeClass('md-show');
                    $('.md-overlay').removeClass('show');
                });

                $('#save-itineraire-modal form').on('submit',function(evt){
                    evt.preventDefault();
                    if($('#save-itineraire-modal form input[name=name]').val().length>0){
                        var lieux_choisis = JSON.stringify(getLieuxChoisis());
                        var depart = JSON.stringify(carte.points.depart);
                        var arrivee = JSON.stringify(carte.points.arrivee);
                        var name = $('#save-itineraire-modal form input[name=name]').val();
                        $.ajax({
                          type: "POST",
                          url: 'ajax/save_itineraire.xhr.php',
                          dataType: 'json',
                          data: { 
                            'depart' : depart,
                            'arrivee' : arrivee,
                            'lieux' : lieux_choisis,
                            'name' : name
                          },
                          async:false, // Important car bloque le script
                          success: function(data, textStatus, jqXHR){
                            if(data.code==200){
                                $('#save-itineraire-modal form').replaceWith($('<p></p>').addClass('confirmation').html('L\'itinéraire a bien été enregistré.'));
                            }else if(data.code==403){
                                $('#save-itineraire-modal form').prepend($('<p></p>').addClass('error').html('Vous devez être connecté.'));
                            }else{
                                $('#save-itineraire-modal form').prepend($('<p></p>').addClass('error').html('Une erreur s\'est produite... Veuillez recommencer.'));
                            }
                          }
                        });
                    }else{
                        $('#save-itineraire-modal form').prepend($('<p></p>').addClass('error').html('Vous devez indiquer un nom pour cet itinéraire'));
                    }
                });
            });
        },
        error :function(){
            alert('Erreur interne. Veuillez recommencer.');
        }
    });
}

function tracerItineraires(params){
    var lieux_choisis = getLieuxChoisis();

    $('#guidage_itineraire').empty();

    carte.map.nettoyer({
        type : 'all',
        finished : function(){

             carte.itineraires = []; // On supprime les itinéraires en mémoire
             for(var i=0; i<=lieux_choisis.length;i++){


                /* Ici créer les différents trajets */
                if(i==0){
                    depart = {
                                adresse : carte.points.depart.adresse,
                                ville : carte.points.depart.ville,
                                latitude : carte.points.depart.position.latitude,
                                longitude : carte.points.depart.position.longitude,
                                nom : carte.points.depart.adresse+', '+carte.points.depart.ville,
                                categorie : 'depart',
                                type : 'borne'
                              }
                }
                if(i>=lieux_choisis.length){;
                    arrivee = {
                                adresse : carte.points.arrivee.adresse,
                                ville : carte.points.arrivee.ville,
                                latitude : carte.points.arrivee.position.latitude,
                                longitude : carte.points.arrivee.position.longitude,
                                nom : carte.points.arrivee.adresse+', '+carte.points.arrivee.ville,
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
                    if(typeof(params)!='undefined' && typeof(params.itinerairesTraces)=='function'){
                        params.itinerairesTraces.call(this,returns);
                    }
                }
            });
        }
    });
}

function lancerLoader(){
    $('.md-overlay,.loader').addClass('show');
    var loader = new canvasLoader();
    loader.init();
}

function arreterLoader(){
    $('.md-overlay,.loader').removeClass('show');
}