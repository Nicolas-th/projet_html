////FONCTION AJAX qui gère l'affichage du dougnhnut de vote

$(function() {
	var lieu = parseInt($('body').attr('id').replace("lieu_",""));
	$('#buttonLike').on('click',function () {envoyerLike(lieu)});
	$('#buttonDislike').on('click',function () {envoyerDislike(lieu)});
	$('.signaler').on('click',function (event){
		event.preventDefault();
		signal($(this).attr('id'),$(this))
	});
	
	$.post('../ajax/displaydoughnut.xhr.php',
		{
			lieu : lieu,
		},
		function(reponse) { 
			var string = reponse.split('-');
			var nblike = parseInt(string[0]);
			var nbdislike = parseInt(string[1]);
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
		
	);	
});
////////FIN de la fonction AJAX

/* Fonction gérant les boutons like et dislike sur les pages lieux */

//Fonction qui insert un like en fonction du lieu et de l'user
function envoyerLike(lieu) {
	$.post("../ajax/ajoutlike.xhr.php",
		{"lieu": lieu},
					
		function (){
			$.post('../ajax/displaydoughnut.xhr.php',{
				lieu : lieu,
				},
		
				function(reponse) { 
					var nbLike = reponse[0];
					var string = reponse.split('-');
					var nblike = parseInt(string[0]);
					var nbdislike = parseInt(string[1]);
					
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
					
					if(nblike == 1){
						document.getElementById("votes-positifs").innerHTML = '<strong>'+nblike+'</strong> aime ce lieu';
					}
					else {	
						document.getElementById("votes-positifs").innerHTML = '<strong>'+nblike+'</strong> aiment ce lieu';
					}	
					document.getElementById("button-validate").innerHTML = "Votre vote a été soumis";
				}
			);	
		});
}

//Fonction qui insert un dislike en fonction du lieu et de l'user
function envoyerDislike(lieu) {
	$.post("../ajax/ajoutdislike.xhr.php",
		{"lieu": lieu},
		
		function (){
			$.post('../ajax/displaydoughnut.xhr.php',{
				lieu : lieu,
				},
		
				function(reponse) {
					var nbDislike = reponse[0];
					var string = reponse.split('-'); 
					var nblike = parseInt(string[0]);
					var nbdislike = parseInt(string[1]);
					
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
					
					if(nbdislike == 1){
						document.getElementById("votes-negatifs").innerHTML = '<span style="color:#ff850b; font-weight:bold;">'+nbdislike+'</span> n\'a pas aimé';
					}
					else {
						document.getElementById("votes-negatifs").innerHTML = '<span style="color:#ff850b; font-weight:bold;">'+nbdislike+'</span> n\'ont pas aimé';
					}
					document.getElementById("button-validate").innerHTML = "Votre vote a été soumis";
				}
			);	
		});
} 

function signal(id,lien){
	$.post("../ajax/signaler.xhr.php",{
		id : id
	},
	function(){
		lien.replaceWith('Vous avez signalé ce commentaire. Merci :)');
	});
}