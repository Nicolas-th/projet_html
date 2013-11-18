$(function(){

  var map = new google.maps.Map(document.getElementById("map-canvas"), {
    zoom: 17,
    center: new google.maps.LatLng(48.858565, 2.347198),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false
  });

  if(typeof(stylesCarte)!='undefined'){
    map.mapTypes.set('map_style', new google.maps.StyledMapType(stylesCarte));
    map.setMapTypeId('map_style');
  }

  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        map: map,
        icon: 'assets/img/maps_icons/icon_depart.svg'
      });
    });
  }

  $('.bouton-connexion').click(function(e) {
      $('#signup').lightbox_me({
          centered: true, 
          onLoad: function() { 
              $('#signup').find('input:first').focus()
              }
          });
      e.preventDefault();
  });

});