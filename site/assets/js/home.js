var stylesCarte =[
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      { "visibility": "on" },
      { "color": "#83d0af" }
    ]
  },{
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road.arterial",
    "stylers": [
      { "visibility": "on" },
      { "weight": 3 },
      { "color": "#ffffff" }
    ]
  },{
    "featureType": "road.arterial",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "on" },
      { "color": "#a7a7a7" },
      { "weight": 0.1 }
    ]
  },{
    "featureType": "landscape.man_made",
    "stylers": [
      { "visibility": "simplified" },
      { "color": "#f4f5f5" }
    ]
  },{
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "simplified" },
      { "color": "#ffffff" },
      { "weight": 7 }
    ]
  },{
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "simplified" },
      { "saturation": 40 },
      { "lightness": 52 },
      { "color": "#afe0f9" }
    ]
  },{
  },{
    "featureType": "poi.place_of_worship",
    "stylers": [
      { "visibility": "off" },
      { "color": "#ffffff" }
    ]
  },{
    "featureType": "poi.business",
    "elementType": "geometry",
    "stylers": [
      { "color": "#ffffff" },
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "poi.medical",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "off" },
    ]
  },{
    "featureType": "transit.station.rail",
    "stylers": [
      { "visibility": "simplified" },
      { "saturation": -100 },
      { "lightness": 35 }
    ]
  },{
    "featureType": "poi.business",
    "stylers": [
      { "color": "#000000" },
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi.school",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi.government",
    "stylers": [
      { "color": "#ffffff" },
      { "visibility": "off" }
    ]
  },{
}];

$(function(){

  $('.bouton-connexion').click(function(e) {
    $('#signup').lightbox_me({
        centered: true, 
        onLoad: function() { 
            $('#signup').find('input:first').focus()
        }
    });
    e.preventDefault();
  });

  redimentionnerMap();

  $(window).on('resize', function(){
    redimentionnerMap();
  });

  if(navigator.geolocation) {

    carte.map = new Carte();
    carte.map.init({
      element : document.getElementById('map-canvas')
    });
    carte.map.setStyleMap({
      style : stylesCarte
    });
    carte.map.setStyleInfoWindows({
      style : carte.infoWindow.style
    });

    navigator.geolocation.getCurrentPosition(function(currentPosition) {
      var initialPosition = new google.maps.LatLng(currentPosition.coords.latitude,currentPosition.coords.longitude);
      carte.map.setCenter({
        position : initialPosition
      });
      carte.map.ajouterMarker({
        position : initialPosition,
        nom : 'Votre position'
      });
      carte.rechercherLieux({
        points : [initialPosition],
        success : function(data, textStatus, jqXHR){
          if(data.code=='200'){
            for(key in data.lieux) {
              var current = data.lieux[key];
              var latLng = new google.maps.LatLng(current.latitude,current.longitude);
              var infoWindowContent = $('<div></div>').append($('<p></p>').text(current.name)).html();
              carte.map.ajouterMarker({
                position : latLng,
                categorie : current.categories_id,
                nom : current.name,
                infoWindow : {
                  content : infoWindowContent,
                  position : latLng,
                  click : function(params){
                    if(carte.infoWindow.open!=null){
                      carte.infoWindow.open.close();
                    }
                    carte.infoWindow.open = params.infoWindow.open; // On enregistre l'infowindow ouverte pour pouvoir la fermer plsu tard
                    carte.map.nettoyer({
                      type : 'itineraire_initial',
                      finished : function(){
                        carte.map.traceItineraire({
                          type : 'itineraire_initial',
                          points : {
                            depart : initialPosition,
                            arrivee : params.infoWindow.position
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
      });

      $('#position').on('click',function(evt){
        evt.preventDefault();
        navigator.geolocation.getCurrentPosition(function(currentPosition) {
          $('input[name="latitude_position"]').val(currentPosition.coords.latitude);
          $('input[name="longitude_position"]').val(currentPosition.coords.longitude);
          $('#lieux_depart').val('Ma position');
          $('#ref_lieux_depart').val('position');
        });
      });

      $('#lieux_depart').keypress(function(){
        $('input[name="latitude_position"]','input[name="longitude_position"]').val('');
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
            //carte.tracerItineraire(params);
          }
        });

        /* Gestion du formulaire */
        $('#formulaire_itineraire').on('submit',function(evt){
          evt.preventDefault();

          $('#choix_lieux').remove();
          $('#guidage_itineraire').empty();
          carte.map.nettoyer('all');

          var ref_lieux_depart = $('#ref_lieux_depart').val();
          var ref_lieux_arrive = $('#ref_lieux_arrive').val();
          if(ref_lieux_depart!='' && ref_lieux_arrive!=''){
            var service = new google.maps.places.PlacesService(document.getElementById('hidden'));

            var getPositionArrivee = function(lieu_depart, status){
              carte.points.depart = lieu_depart;
              if (status == google.maps.places.PlacesServiceStatus.OK || status=='OK') {
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
                        params.itinerairesTraces = function(returns){
                          var duree = secondesToDuree(returns.duree);
                          if($('.duree_itineraires').length==0){
                        $('.choix_transport').after('<p class="duree_itineraires"></p>');
                          }
                          $('.duree_itineraires').html('Durée estimée : '+duree);
                          alert('Chargement terminé !');
                        };
                        carte.lancerRechercheLieux(params);
                      }
                      });          

                  }else{
                    alert('Lieu d\'arrivée inconnu.');
                  }
                });
              }else{
                alert('Lieu de départ inconnu.');
              }
            };  

            if($('#ref_lieux_depart').val()!='position'){
              service.getDetails({
                reference : ref_lieux_depart
              }, getPositionArrivee);
            }else{
              var positionDepart = {
                address_components : [
                  {
                    long_name : 'Votre position'
                  },
                  {
                    long_name : ''
                  }
                ],
                geometry : {
                  location : new google.maps.LatLng($('input[name="latitude_position"]').val(),$('input[name="longitude_position"]').val())
                }
              }
              getPositionArrivee.call(this,positionDepart,'OK');
            }
          }else{
            alert('Vous devez choisir un lieu de départ et de destination');
          }
          return false;
        });

   }else{
    alert('Votre navigateur ne permet pas de vous géolocaliser.');
   }

});

function redimentionnerMap(){
  $('#map-canvas').css({
    width : window.innerWidth,
    height : window.innerHeight,
  });
}