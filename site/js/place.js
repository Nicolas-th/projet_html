////FONCTION AJAX qui gre l'affichage du dougnhnut de vote

$(function() {

	var lieu = parseInt($('#container-lieu').data('id'));
	$('#buttonLike').on('click',function (evt) {
		evt.preventDefault();
		likeDislike(lieu,'like');
	});
	$('#buttonDislike').on('click',function (evt) {
		evt.preventDefault();
		likeDislike(lieu,'dislike');
	});

	$('.signaler').on('click',function (event){
		event.preventDefault();
		signal($(this).attr('id'),$(this))
	});

	$('#leave-comment form input[type=submit]').on('click',function (event){
		event.preventDefault();
		var commentaire = $('#leave-comment form textarea[name=message]').val();
		if(commentaire.length>0){
			postCommentaire(lieu,commentaire);
		}else{
			console.log('test');
		}
	});
	
	$.ajax({
		type : "POST",
		url : '/site/ajax/displaydoughnut.xhr.php',
		data : {
			'lieu' : lieu,
		},
		dataType : 'json',
		success: function(reponse, status) {
			var nblike = parseInt(reponse.likes);
			var nbdislike = parseInt(reponse.dislikes);
			var doughnutData = [
				{
					value: nblike,
					color:"white"
				},
				{
					value : nbdislike,
					color : "#FF8E00"
				}			
			];

			var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData);
		}
		
	});	
});
////////FIN de la fonction AJAX

/* Fonction gérant les boutons like et dislike sur les pages lieux */
function likeDislike(lieu,type) {
	$.ajax({
		type : "POST",
		url : "/site/ajax/ajoutLikeDislike.xhr.php",
		dataType : 'json',
		data : {
			'lieu' : lieu,
			'type' : type
		},			
		success: function(reponse, status) {
			var nblike = parseInt(reponse.likes);
			var nbdislike = parseInt(reponse.dislikes);
			
			var doughnutData = [
				{
					value: nblike,
					color:"white"
				},
				{
					value : nbdislike,
					color : "#FF8E00"
				}			
			];

			var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData);

			$('#votes-positifs').html('<strong>'+nblike+'</strong> '+((nblike>1)?'aiment ce lieu':'aime ce lieu'));
			$('#votes-negatifs').html('<strong>'+nbdislike+'</strong> '+((nbdislike>1)?'n\'aiment pas ce lieu':'n\'aime pas ce lieu'));
			$('#button-validate').html('Votre vote a été soumis');
		}
	});	
}


function signal(id,lien){
	$.post("/site/ajax/signaler.xhr.php",{
		id : id
	},
	function(){
		lien.replaceWith('Vous avez signalé ce commentaire. Merci :)');
	});
}

function postCommentaire(lieu,commentaire){
	$.post("/site/ajax/addComments.xhr.php",{
		'lieu' : lieu,
		'message' : commentaire
	}, 
	function(data){
		$('.commentaire').last().after($(data).fadeIn());
	});	
}