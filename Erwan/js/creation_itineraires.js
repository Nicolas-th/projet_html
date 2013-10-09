$(function(){

  var map;
  var panel;
  var direction;
  var infos_itineraire = new Array();
  var tab_directionsRenderer = new Array();  // Array contenant les différents itinénaires tracés sur la carte

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
        infos_itineraire['lieu_depart'] = lieu_depart;
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          service.getDetails({
            reference : ref_lieux_arrive
          }, function(lieu_arrivee, status){
            infos_itineraire['lieu_arrivee'] = lieu_arrivee;
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
  function trace_itineraire(depart,arrivee,waypoints){

    if(typeof(waypoints)=='undefined') waypoints_in = new Array();
    else                               waypoints_in = waypoints;

    console.log('waypoints');
    console.log(waypoints_in);

    var request = {
        origin      : depart,
        destination : arrivee,
        waypoints : waypoints_in,
        optimizeWaypoints: true,
        travelMode  : google.maps.DirectionsTravelMode.TRANSIT
    }

    console.log('request');
    console.log(request);

    //if(typeof(waypoints)=='undefined') directionsService = new google.maps.DirectionsService();
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status){
        console.log(response);
        if(status == google.maps.DirectionsStatus.OK){
            /*direction.setDirections(response);
            //detailler_itineraire(response);
            if(typeof(waypoints)=='undefined')
                placer_points(response);*/

            var directionsRenderer = new google.maps.DirectionsRenderer;
            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(response);

            /* On stock l'itineraire actuel */
            tab_directionsRenderer.push(directionsRenderer);

            if(typeof(waypoints)=='undefined'){
              //vider_carte();
              placer_points(response);
            }
        }
    });
  }

  function vider_carte(){
      for(key in tab_directionsRenderer){
          tab_directionsRenderer[key].setMap(null);
          console.log(tab_directionsRenderer[key]);
      }
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
    //console.log(str_points);
    $.ajax({
      type: "POST",
      url: 'ajax/get_lieux_by_geolocalisation.xhr.php',
      data: { 'points': str_points },
      dataType: 'json',
      success: function(data, textStatus, jqXHR){
        if(data.code=='200'){
          console.log(data.lieux);

          var form_lieux = '<p>Selectionner les lieux que vous souhaitez visiter :</p>';
          form_lieux += '<form id="form_lieux">';

          for(key in data.lieux) {
            lieu = data.lieux[key];
            console.log(lieu);

            form_lieux+='<div>';
            form_lieux+=  '<input type="checkbox" name="lieux_itineraire" id="'+lieu.id+'" value="'+lieu.id+'">';
            form_lieux+=  '<label for="id="'+lieu.id+'"">'+lieu.nom+'</label>';
            form_lieux+='</div>';

          }

          form_lieux+='<input type="submit" value="Valider">';
          form_lieux+='</form>';

          $('#instructions').html(form_lieux);

          $('#instructions form').submit(function(evt){
            evt.preventDefault();
            
             var lieux_choisis = [];
             $('#instructions form input:checked').each(function() {
                lieux_choisis.push($(this).val());
             });

             vider_carte();

             console.log(lieux_choisis);

             //var waypoints = new Array();

             var trajets = [];
             for(var i=0; i<=lieux_choisis.length;i++){
                //console.log(lieux_choisis[key]);
                /*$.ajax({
                  type: "POST",
                  url: 'ajax/get_lieu_by_id.xhr.php',
                  data: { 'id_lieu': lieux_choisis[key] },
                  dataType: 'json',
                  async:false,
                  success: function(data, textStatus, jqXHR){
                    if(data.code=='200'){

                      var latlng = new google.maps.LatLng(data.infos.latitude,data.infos.longitude);
                      waypoints.push({
                          location : latlng,
                          stopover : true
                      });

                    }else{
                      console.log(data.code);
                    }
                  }
                });
                var latLng_depart = new google.maps.LatLng(infos_itineraire['lieu_depart'].geometry.location.lb,infos_itineraire['lieu_depart'].geometry.location.mb)
                var latLng_arrivee = new google.maps.LatLng(infos_itineraire['lieu_arrivee'].geometry.location.lb,infos_itineraire['lieu_arrivee'].geometry.location.mb)
                trace_itineraire(latLng_depart,latLng_arrivee,waypoints);*/
                

                /* Ici créer les différents trajets */
                if(i==0){
                    var depart_itineraire = infos_itineraire['lieu_depart'];
                    depart = {
                                adresse : depart_itineraire.address_components[0].long_name,
                                //cp : depart_itineraire.address_components[4].long_name,
                                ville : depart_itineraire.address_components[1].long_name,
                                latitude : depart_itineraire.geometry.location.lb,
                                longitude : depart_itineraire.geometry.location.mb,
                                nom : depart_itineraire.address_components[0].long_name+', '+depart_itineraire.address_components[1].long_name
                              }
                }
                if(i>=lieux_choisis.length){
                    var arrivee_itineraire = infos_itineraire['lieu_arrivee'];
                    arrivee = {
                                adresse : arrivee_itineraire.address_components[0].long_name,
                                //cp : arrivee_itineraire.address_components[4].long_name,
                                ville : arrivee_itineraire.address_components[1].long_name,
                                latitude : arrivee_itineraire.geometry.location.lb,
                                longitude : arrivee_itineraire.geometry.location.mb,
                                nom : arrivee_itineraire.address_components[0].long_name+', '+arrivee_itineraire.address_components[1].long_name
                              }
                }else{
                    var infos_lieu = null;
                    $.ajax({
                      type: "POST",
                      url: 'ajax/get_lieu_by_id.xhr.php',
                      data: { 'id_lieu': lieux_choisis[i] },
                      dataType: 'json',
                      async:false,
                      success: function(data, textStatus, jqXHR){
                        if(data.code=='200'){
                            infos_lieu = data.infos;
                        }
                      }
                    });
                    arrivee = infos_lieu;
                }

                trajets.push({depart : depart, arrivee : arrivee});
                depart = arrivee;
             }

             for(key in trajets){
                var latLng_depart = new google.maps.LatLng(trajets[key].depart.latitude,trajets[key].depart.longitude);
                var latLng_arrivee = new google.maps.LatLng(trajets[key].arrivee.latitude,trajets[key].arrivee.longitude);
                trace_itineraire(latLng_depart,latLng_arrivee);
              }

             console.log('trajets');
             console.log(trajets);

             $('#map').css('opacity','1');

            return false;
          });

        }else{
          console.log('Erreur '+data.code);
        }
      }
    });
  }


});


