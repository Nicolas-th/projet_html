//Fonction qui insert un like en fonction du lieu et de l'user
function envoyerLike(lieu, user) {
	$.post("../ajoutlike.php",
		{"lieu": lieu, "user": user},
					
		function (){
			$.post('../PHP.php',{
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
					document.getElementById("result").innerHTML = "Votre vote a été soumis";
					$('#buttonValidate').remove();
				}
			);	
		});
}
//Fonction qui insert un dislike en fonction du lieu et de l'user
function envoyerDislike(lieu, user) {
	$.post("../ajoutdislike.php",
		{"lieu": lieu, "user": user},
		
function (){
			$.post('../PHP.php',{
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
					document.getElementById("result").innerHTML = "Votre vote a été soumis";
					$('#buttonValidate').remove();
				}
			);	
		});
}