/**** Autocomplétion ****/
var Autocompletion = function(){

	var _this = this;

	_this.defaults = {
		rechercher : {
			value : '',
			restrictions : {},
			location : null,
			rankBy : 'pertinence',
			radius : 50000,
			finished : function(){}
		},
		getPosition : {
			element : '#hidden',
			success : function(){},
			error : function(){}
		}
	}

	_this.init = function(params){
		_this.defaults.rechercher = $.extend(true,{}, _this.defaults.rechercher, params);
	}

	/*
	## rechercher() ##
			Paramètre attendu : aucun
	*/
	_this.rechercher = function(params){
		params = $.extend(true, {},_this.defaults.rechercher, params);

		var service = new google.maps.places.AutocompleteService();

		var options = {
			input: params.value,
			componentRestrictions: params.restrictions
		};

		if(params.location!=null){
			var locationLatLng = new google.maps.LatLng(params.location.latitude,params.location.longitude);
			options['location'] = locationLatLng;
			options['radius'] = params.radius;
		}

		if(params.rankBy!=='pertinence'){
			options['rankBy'] = google.maps.places.RankBy.PROMINENCE;
		}else{
			options['rankBy'] = google.maps.places.RankBy.DISTANCE;
		}

	    service.getQueryPredictions(options, function(reponse, status){
	      if(status == google.maps.places.PlacesServiceStatus.OK) {
	        params.finished.call(this,{resultats : reponse});
	      }
	    });
	}

	_this.getPosition = function(params){
		params = $.extend(true, {},_this.defaults.getPosition, params);

		var service = new google.maps.places.PlacesService(document.querySelector(params.element));

		service.getDetails({
            reference: params.reference
        },
        function(place, status){
        	if (status == google.maps.places.PlacesServiceStatus.OK || status == 'OK') {
        		if(typeof(place.address_components[0])=='undefined'){
        			var adresse = place.name;
        		}else{
        			var adresse = place.address_components[0].long_name;
        		}
        		if(typeof(place.address_components[1])=='undefined'){
        			var ville = '';
        		}else{
        			var ville = place.address_components[1].long_name;
        		}
	        	var infos  ={
	        		position : {
	        			latitude : place.geometry.location.lat(),
	        			longitude : place.geometry.location.lng()
	        		},
	        		adresse : adresse,
	        		ville : ville
	        	}
	        	params.success.call(this,infos, status);
	        }else{
	        	params.error.call(this,place, status);
	        }
        });

	}

};