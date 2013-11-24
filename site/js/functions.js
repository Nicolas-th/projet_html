/**** Utils *****/

/* Fonction permettant de retourner une copie de tab_in, sans la case correspondantà à value_in  */
function deleteValueFromArray(tab_in,value_in){
	return tab_out = $.grep(tab_in, function(current_val) {
	  return current_val != value_in;
	});
}