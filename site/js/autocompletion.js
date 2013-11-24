/**** Autocomplétion ****/
var Autocompletion = function(){

	var _this = this;
	var defauts = {
		value : '',
		finished : function(){}
	}

	/*
	## init() ##
	Paramètre attendu : objet
		 {
		 	inputText : String (selector)
		 	divResultats : String (selector)
		 }
	*/	
	_this.init = function(params){
		_this.params = $.extend({},defauts, params);
	}

	/*
	## rechercher() ##
			Paramètre attendu : aucun
	*/
	_this.rechercher = function(){
		var service = new google.maps.places.AutocompleteService();
	    service.getQueryPredictions({ input: _this.params.value }, function(reponse, status){
	      if(status == google.maps.places.PlacesServiceStatus.OK) {
	        _this.params.finished.call(this,{resultats : reponse});
	      }
	    });
	}

};