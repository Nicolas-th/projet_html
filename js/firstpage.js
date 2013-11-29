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

  /* Modals */

  $('.md-modal').addClass('load');

  $('.modal-connexion').on('click',function(){
    $('#connexion-modal').addClass('md-show');
  });

  $('.modal-inscription').on('click',function(){
    $('#inscription-modal').addClass('md-show');
  });

  $('.md-close,.md-overlay').on('click',function(){
    $('.md-modal').removeClass('md-show');
  });
});