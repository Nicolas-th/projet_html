function initialize() {
  map = new google.maps.Map(document.getElementById("map-canvas"), {
        zoom: 17,
        center: new google.maps.LatLng(48.858565, 2.347198),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });  
}
 
if (navigator.geolocation)
  var watchId = navigator.geolocation.watchPosition(successCallback,
                            null,
                            {enableHighAccuracy:true});
else
  alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");   
 
function successCallback(position){
  map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
    map: map
  });
}


$(document).ready(function() {

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