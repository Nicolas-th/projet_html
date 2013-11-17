 function initialize() {

        var styles = [
                     
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
  }


                      
];

        var styledMap = new google.maps.StyledMapType(styles, {name: "MyGmap"});


        var mapOptions = {
          center: new google.maps.LatLng(45.75, 4.85),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');

      }

      google.maps.event.addDomListener(window, 'load', initialize);    