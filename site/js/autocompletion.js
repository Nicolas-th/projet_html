/**** Autocomplétion ****/
var Autocompletion = function(){

	var _this = this;

	_this.defaults = {
		rechercher : {
			value : '',
			finished : function(){}
		},
		getPosition : {
			element : '#hidden',
			success : function(){},
			error : function(){}
		}
	}

	/*
	## rechercher() ##
			Paramètre attendu : aucun
	*/
	_this.rechercher = function(params){
		params = $.extend(true, {},_this.defaults.rechercher, params);

		var service = new google.maps.places.AutocompleteService();
	    service.getQueryPredictions({ input: params.value }, function(reponse, status){
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
	        	var infos  ={
	        		position : {
	        			latitude : place.geometry.location.lat(),
	        			longitude : place.geometry.location.lng()
	        		},
	        		adresse : place.address_components[0].long_name,
	        		ville : place.address_components[1].long_name
	        	}
	        	params.success.call(this,infos, status);
	        }else{
	        	params.error.call(this,place, status);
	        }
        });

	}

};