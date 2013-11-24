$(function() {
	$('.btn.btn-lg.btn-danger').on('click',function (event){
		event.preventDefault();
		deleteusers($(this).attr('id'));
	});
});

function deleteusers(id){
	$.post("../admin/ajax/delete.xhr.php",{
		id : id
	},
	function(data){
		alert('Cet utilisateur vient d\'être supprimé !');
	});
}