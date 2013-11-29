var Itineraire = function() {

	var _this = this;

	_this.defaults = {
		rechercherLieux : {
			points : [],
			success : function(){},
			error : function(){}
		},
		lancerRechercheLieux : {
			directionsServiceResponse : null,
			itinerairesTraces : function(){}
		},
		tracerItineraires : {
			itinerairesTraces : function(){}
		}
	}

	// Fonction recherchant des lieux insolites autour d'un point donné
	_this.rechercherLieux = function(params){
		params = $.extend({}, _this.defaults.rechercherLieux, params);
		var str_points = "";
		for (var i = 0; i<params.points.length; i++) {
		  str_points+=params.points[i].latitude+','+params.points[i].longitude+';'
		}
		$.ajax({
		  type: "POST",
		  url: 'ajax/get_lieux_by_geolocalisation.xhr.php',
		  data: { 'points': str_points },
		  dataType: 'json',
		  success: function(data, textStatus, jqXHR){
		  	params.success.call(this,data, textStatus, jqXHR);
		  },
		  error :  function(data, textStatus, jqXHR){
		  	params.error.call(this,data, textStatus, jqXHR);
		  }
		});
	}
}