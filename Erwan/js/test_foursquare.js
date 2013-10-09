$(function(){
  initialize();
});

var map;

var latlng = new Array();
var marker = new Array();
var infowindow = new Array();

function initialize() {
  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      $.ajax({
        type: "POST",
        url: 'ajax/foursquare.xhr.php',
        data: { 'lt': position.coords.latitude, 'lg' : position.coords.longitude },
        dataType: 'json',
        success: function(data, textStatus, jqXHR){
          if(data.code=='200'){
            console.log(data.lieux);
            for(key in data.lieux) {
              lieu = data.lieux[key];
              console.log(lieu);
              latlng[key] = new google.maps.LatLng(lieu.location.lat,lieu.location.lng);
              marker[key] = new google.maps.Marker({
                position: latlng[key],
                map: map,
                title: lieu.name
              });
              infowindow[key] = new google.maps.InfoWindow({
                  content: '<p>'+lieu.name+'</p>'
              });
              google.maps.event.addListener(marker[key], 'click', function() {
                infowindow[key].open(map,marker[key]);
              });
            }
          }else{
            alert('Erreur '+data.code);
          }
          console.log(marker);
        }
      });
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    noGeolocation(false);
  }
}

function noGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}