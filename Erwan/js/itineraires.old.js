$(function(){

  var map;
  var panel;
  var direction;

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      init_map(position);
    });
  }

  function init_map(position_in){
    var position = new google.maps.LatLng(position_in.coords.latitude,position_in.coords.longitude);
    map = new google.maps.Map(document.getElementById('map'), {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: position,
      zoom: 15
    });

    direction = new google.maps.DirectionsRenderer({
        map   : map, 
        panel : panel 
    });
  }

  /* Autocomplétion */
  function init_autocomplete() {
    $( "#lieux_depart" ).keypress(function(){
      var val_lieux_depart = $( "#lieux_depart" ).val();
      autocomplete_lieux(val_lieux_depart,'lieux_depart');    
    });

    $( "#lieux_arrive" ).keypress(function(){
      var val_lieux_depart = $( "#lieux_arrive" ).val();
      autocomplete_lieux(val_lieux_depart,'lieux_arrive');    
    });
  }

  function autocomplete_lieux(lieu,id_input_autocompletion){
    var resultats = null;
    var service = new google.maps.places.AutocompleteService();
    service.getQueryPredictions({ input: lieu }, function(reponse, status){
      if(status == google.maps.places.PlacesServiceStatus.OK) {
        aff_liste_resultats_autocomplete(reponse,id_input_autocompletion);
      }
    });
  }

  function aff_liste_resultats_autocomplete(resultats_in,id_input_autocompletion){
    if(resultats_in!=null){
      var html_resultats ='';
      for (var i = 0; i<resultats_in.length; i++) {
        html_resultats += '<li id="'+resultats_in[i].reference+'">' + resultats_in[i].description + '</li>';
      }
      $('#resultats_'+id_input_autocompletion).html(html_resultats);
      $('#resultats_'+id_input_autocompletion+' li').click(function(){
          $('#'+id_input_autocompletion).val($(this).html());
          $('#'+id_input_autocompletion+'+input[type="hidden"]').val($(this).attr('id'));
          $('#resultats_'+id_input_autocompletion).html('');
      });
    }
  }

  google.maps.event.addDomListener(window, 'load', init_autocomplete);


  /* Gestion du formulaire */
  $('#formulaire_itineraire').submit(function(evt){
    evt.preventDefault();
    var ref_lieux_depart = $('#ref_lieux_depart').val();
    var ref_lieux_arrive = $('#ref_lieux_arrive').val();
    if(ref_lieux_depart!='' && ref_lieux_arrive!=''){
      var service = new google.maps.places.PlacesService(document.getElementById('test'));
      service.getDetails({
        reference : ref_lieux_depart
      }, function(lieu_depart, status){
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          service.getDetails({
            reference : ref_lieux_arrive
          }, function(lieu_arrivee, status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              var latLng_depart = new google.maps.LatLng(lieu_depart.geometry.location.lb,lieu_depart.geometry.location.mb)
              var latLng_arrivee = new google.maps.LatLng(lieu_arrivee.geometry.location.lb,lieu_arrivee.geometry.location.mb)
              trace_itineraire(latLng_depart,latLng_arrivee);
            }
          });
        }
      });
      //https://maps.googleapis.com/maps/api/place/details/json?reference=CmRYAAAAciqGsTRX1mXRvuXSH2ErwW-jCINE1aLiwP64MCWDN5vkXvXoQGPKldMfmdGyqWSpm7BEYCgDm-iv7Kc2PF7QA7brMAwBbAcqMr5i1f4PwTpaovIZjysCEZTry8Ez30wpEhCNCXpynextCld2EBsDkRKsGhSLayuRyFsex6JA6NPh9dyupoTH3g&sensor=true&key=AddYourOwnKeyHere
    }else{
      alert('Vous devez choisir un lieu de départ et de destination');
    }
    return false;
  });



  /* Utilisation de la carte */
  function trace_itineraire(depart,arrivee){
    var request = {
        origin      : depart,
        destination : arrivee,
        travelMode  : google.maps.DirectionsTravelMode.TRANSIT
    }
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status){
        console.log(response.routes);
        if(status == google.maps.DirectionsStatus.OK){
            direction.setDirections(response);
            detailler_itineraire(response);
            placer_points(response);
        }
    });
  }

  function detailler_itineraire(directionService_reponse){
    var html_instructions = '';
    var etapes = directionService_reponse.routes[0].legs[0].steps;
    for (var i = 0; i<etapes.length; i++) {
      html_instructions+='<p>Etape '+(i+1)+' : '+etapes[i].distance.text+' - '+etapes[i].duration.text+' : '+etapes[i].instructions+'</p>';
    }
    $('#instructions').html(html_instructions);
  }

  function placer_points(directionService_reponse){
    var points = directionService_reponse.routes[0].overview_path;
    var str_points = "";
    for (var i = 0; i<points.length; i++) {
      str_points+=points[i].lb+','+points[i].mb+';'
    }
    console.log(str_points);
    $.ajax({
      type: "POST",
      url: 'ajax/get_lieux_by_geolocalisation.xhr.php',
      data: { 'points': str_points },
      dataType: 'json',
      success: function(data, textStatus, jqXHR){
        if(data.code=='200'){
          console.log(data.lieux);
          for(key in data.lieux) {
            lieu = data.lieux[key];
            console.log(lieu);
            var latlng = new google.maps.LatLng(lieu.latitude,lieu.longitude);
            var marker = new google.maps.Marker({
              position: latlng,
              map: map,
              title: lieu.nom
            });
            /*infowindow[key] = new google.maps.InfoWindow({
                content: '<p>'+lieu.name+'</p>'
            });
            google.maps.event.addListener(marker[key], 'click', function() {
              infowindow[key].open(map,marker[key]);
            });*/
          }
        }else{
          console.log('Erreur '+data.code);
        }
        console.log(marker);
      }
    });
    /*var latlng = new google.maps.LatLng(points[i].lb,points[i].mb);
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
    });*/
  }


});


