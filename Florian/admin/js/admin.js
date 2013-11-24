$(function() {
	$('.btn.btn-lg.btn-danger.btnUsers').on('click',function (event){
		event.preventDefault();
		deleteusers($(this).attr('id'));
	});
	$('.btn.btn-lg.btn-danger.btnPlaces').on('click',function (event){
		event.preventDefault();
		deleteplaces($(this).attr('id'));
	});
	$('.btn.btn-lg.btn-danger.btnComments').on('click',function (event){
		event.preventDefault();
		deletecomments($(this).attr('id'));
	});
});

function deleteusers(id){
	$.post("../admin/ajax/delete.xhr.php",{
		id : id
	},
	function(data){
		if(data == 0){
			alert('Cet utilisateur vient d\'être supprimé');
		}
		else {
			alert('Impossible de supprimer cet utilisateur');
		}
	});
}

function deleteplaces(id){
	$.post("../admin/ajax/deletePlace.xhr.php",{
		id : id
	},
	function(data){
		if(data == 0){
			alert('Ce lieu vient d\'être supprimé');
		}
		else {
			alert('Impossible de supprimer ce lieu');
		}
	});
}

function deletecomments(id){
	$.post("../admin/ajax/deleteComments.xhr.php",{
		id : id
	},
	function(data){
		if(data == 0){
			alert('Ce commentaire vient d\'être supprimé');
		}
		else {
			alert('Impossible de supprimer ce commentaire');
		}
	});
}