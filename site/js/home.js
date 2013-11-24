$(function () {

    // Initialisation des transition
    var transition = new Transition();
    transition.init({
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

    carte.map = new Carte();
    carte.map.init({
        element: document.getElementById('map-canvas'),
        mapTypeControl: false
    });
    carte.map.setStyleMap({
        url: 'js/config.json',
        key: 'mapStyle'
    });

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            function (positionGeoc) { // success
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
                carte.rechercherLieux({
                    points: [initialPosition],
                    success: function (data, textStatus, jqXHR) {
                        if (data.code == '200') {
                            for (key in data.lieux) {
                                var current = data.lieux[key];
                                var currentPosition = {
                                    latitude: current.latitude,
                                    longitude: current.longitude
                                };
                                var infoWindowContent = $('<div></div>').append($('<p></p>').text(current.name)).html();
                                carte.map.ajouterMarker({
                                    position: currentPosition,
                                    categorie: current.categories_id,
                                    nom: current.name,
                                    infoWindow: {
                                        content: infoWindowContent,
                                        style: carte.infoWindow.style,
                                        position: currentPosition,
                                        click: function (params) {
                                            if (carte.map.infoWindow.open != null) {
                                                carte.map.infoWindow.open.close();
                                            }
                                            carte.map.infoWindow.open = params.infoWindow.open; // On enregistre l'infowindow ouverte pour pouvoir la fermer plsu tard
                                            carte.map.nettoyer({
                                                type: 'itineraire_initial',
                                                finished: function () {
                                                    carte.map.traceItineraire({
                                                        type: 'itineraire_initial',
                                                        points: {
                                                            depart: initialPosition,
                                                            arrivee: params.infoWindow.position
                                                        }
                                                    })
                                                }
                                            });
                                        }
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
            }
        );

        $('#position').on('click', function (evt) {
            evt.preventDefault();
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
    }

    $('#lieux_depart').on('keydown', function (evt) {
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
            var autocomplete = new Autocompletion();
            autocomplete.init({
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
            autocomplete.rechercher();
        }
    });

    $('#lieux_arrive').on('keydown', function (evt) {
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
            var autocomplete = new Autocompletion();
            autocomplete.init({
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
            autocomplete.rechercher();
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

                if (ref_lieux_arrive == '' && $('#resultats_lieux_arrive li').length > 0) {
                    ref_lieux_arrive = $('#resultats_lieux_arrive li').first().attr('id');
                    $('#lieux_arrive').val($('#resultats_lieux_arrive li').first().html());
                    $('#resultats_lieux_arrive').empty();
                }

                var service = new google.maps.places.PlacesService(document.getElementById('hidden'));

                var getPositionArrivee = function (lieu_depart, status) {
                    carte.points.depart = lieu_depart;
                    if (status == google.maps.places.PlacesServiceStatus.OK || status == 'OK') {
                        service.getDetails({
                            reference: ref_lieux_arrive
                        }, function (lieu_arrivee, status) {
                            carte.points.arrivee = lieu_arrivee;
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                carte.map.traceItineraire({
                                    points: {
                                        depart: {
                                        	latitude : carte.points.depart.geometry.location.lat(),
                                        	longitude : carte.points.depart.geometry.location.lng()
                                        },
                                        arrivee: {
                                        	latitude : carte.points.arrivee.geometry.location.lat(),
                                        	longitude : carte.points.arrivee.geometry.location.lng()
                                        },
                                    },
                                    type: 'itineraires_lieux',
                                    finished: function (params) {
                                        params.itinerairesTraces = function (returns) {
                                            var duree = secondesToDuree(returns.duree);
                                            if ($('.duree_itineraires').length == 0) {
                                                $('.choix_transport').after('<p class="duree_itineraires"></p>');
                                            }
                                            $('.duree_itineraires').html('Durée estimée : ' + duree);
                                            alert('Chargement terminé !');
                                        };
                                        carte.lancerRechercheLieux(params);
                                    }
                                });

                            } else {
                                alert('Lieu d\'arrivée inconnu.');
                            }
                        });
                    } else {
                        alert('Lieu de départ inconnu.');
                    }
                };

                if ($('#ref_lieux_depart').val() != 'position') {
                    service.getDetails({
                        reference: ref_lieux_depart
                    }, getPositionArrivee);
                } else {
                    var positionDepart = {
                        address_components: [{
                            long_name: 'Votre position'
                        }, {
                            long_name: ''
                        }],
                        geometry: {
                            location: new google.maps.LatLng($('input[name="latitude_position"]').val(), $('input[name="longitude_position"]').val())
                        }
                    }
                    getPositionArrivee.call(this, positionDepart, 'OK');
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