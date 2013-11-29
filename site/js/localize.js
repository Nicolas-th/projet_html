var localize={
	
	defaults : {
		getUserLocation : {
			localized : function(){},
			error : function(){}
		},
		addTrack : {
			added : function(){}
		},
		getAdress : {
			success : function(){},
			error : function(){}
		},
		getLocalization : {
			success : function(){},
			error : function(){}
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
	},

	getAdress : function(params){
		params = $.extend(true, {},this.defaults.getUserLocation, params);
		var geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(params.latitude, params.longitude);
		geocoder.geocode({
			'latLng': latlng
			},
			function(data,status){
				if(status == google.maps.GeocoderStatus.OK){
					if(typeof(data[0])!='undefined' && typeof(data[0].address_components)!='undefined'){
						var address_components = data[0].address_components;
						params.success.call(this,{
							adress : address_components[0].long_name+' '+address_components[1].long_name,
							city : address_components[3].long_name,
							postCode : address_components[7].long_name
						});
					}
				}else{
					params.error.call(this);
				}
			}
		);
	},

	getLocalization : function(params){
		params = $.extend(true, {},this.defaults.getUserLocation, params);
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			'address': params.address
			},
			function(data,status){
				if(status == google.maps.GeocoderStatus.OK){
					if(typeof(data[0])!='undefined' && typeof(data[0].geometry)!='undefined'){
						var position = data[0].geometry.location;
						params.success.call(this,{
							position : {
								latitude : position.lat(),
								longitude : position.lng()
							}
						});
					}
				}else{
					params.error.call(this);
				}
			}
		);
	}
	
};











