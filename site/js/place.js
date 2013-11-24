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
			postCommentaire(
				lieu,
				commentaire,
				function(){
					$('#leave-comment form textarea[name=message]').val('');
				}
			);
		}else{
			$('#leave-comment form')
			.before(
				$('<p class="error">Vous devez écrire un commentaire</p>')
				.delay(3000)
				.fadeOut(400,function() {
			 		$(this).remove(); 
				})
			);
		}
	});

	$('#voir-commentaires').on('click',function(evt){
		evt.preventDefault();
		var id_last = $('.commentaire').last().attr('id').replace('comment_','');
		$.ajax({
			type : "POST",
			url : '/site/ajax/get_comments.xhr.php',
			data : {
				'id' : id_last,
				'limit' : 5, 
				'lieu' : lieu
			},
			dataType : 'json',
			success: function(reponse, status) {
				var hasNext = parseInt(reponse.hasNext);
				if(hasNext==0){
					$('#voir-commentaires').hide();
				}
				var commentaires = reponse.comments;
				$('.commentaire').last().after($(commentaires).fadeIn(400));
			}
			
		});	
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
		url : "/site/ajax/ajout_like_dislike.xhr.php",
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
	function(data){
		console.log(data);
		lien.replaceWith('<p class="signalement">Vous avez signalé ce commentaire. Un modérateur a été averti.</p>');
	});
}

function postCommentaire(lieu,commentaire,success){
	$.post("/site/ajax/add_comment.xhr.php",{
		'lieu' : lieu,
		'message' : commentaire
	}, 
	function(data){
		$('.commentaire').first().before($(data).fadeIn());
		if(typeof(success)=='function'){
			success.call();
		}
	});	
}