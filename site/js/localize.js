var localize={
	
	defaults : {
		getUserLocation : {
			localized : function(){}
		},
		addTrack : {
			added : function(){}
		}
	},
	
	getUserLocation : function(params){
		params = $.extend(true, {},this.defaults.getUserLocation, params);
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
				function(position){
					params.localized.call(this,position.coords);
				},
				function(){
					params.error.call(this,null);
				},
				{enableHighAccuracy:true}
			);
		}else{
			params.error.call(this,null);
		}
	},

	addTrack : function(params){
		params = $.extend(true, {},this.defaults.getUserLocation, params);
		if(navigator.geolocation){
			var id = navigator.geolocation.watchPosition(function(position) {
				params.added.call(this,position.coords);
			});
			return id;
		}
	},

	removeTrack : function(params){
		params = $.extend(true, {},this.defaults.getUserLocation, params);
		if(navigator.geolocation){
			navigator.geolocation.clearWatch(params.id);
		}
	}
	
};











