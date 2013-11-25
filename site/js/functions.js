/**** Utils *****/

/* Fonction permettant de retourner une copie de tab_in, sans la case correspondantà à value_in  */
function deleteValueFromArray(tab_in,value_in){
	return tab_out = $.grep(tab_in, function(current_val) {
	  return current_val != value_in;
	});
}

/* Fonction retournant un nombre de secondes en durée xxhxxmin  */
function secondesToDuree(time){
	var sec_num = parseInt(time, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    return hours+'h'+minutes+'min';
}

/* Source originale : http://goo.gl/bWiu72 */
/* Retourne la distance en Km */
function calculerDistancePoints(lat1,lon1,lat2,lon2){
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	dist = dist * 1.609344;
	return Math.abs(dist);
}