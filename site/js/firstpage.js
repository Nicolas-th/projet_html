$(function(){

  var map = new Carte();
  map.init({
    element : document.getElementById('map-canvas'),
    zoom: 17,
    center: {
      latitude : 48.858565,
      longitude : 2.347198
    },
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false
  });
  map.setStyleMap({
    url : 'js/config.json',
    key : 'mapStyle'
  });
  map.ajouterMarker({
    position : {
      latitude : 48.858565,
      longitude : 2.347198
    },
    nom : 'Votre position !',
    categorie : 'depart'
  });

  /*
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      map.ajouterMarker({
        position : {
          latitude : position.coords.latitude,
          longitude : position.coords.longitude
        },
        nom : 'Votre position !',
        categorie : 'depart'
      });
      map.setCenter(position.coords.latitude, position.coords.longitude);
    });
  }
  */
});