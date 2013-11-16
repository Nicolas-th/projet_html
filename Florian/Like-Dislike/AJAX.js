//Fonction qui insert un like en fonction du lieu et de l'user
function envoyerLike(lieu, user) {
	$.post("ajoutlike.php",
		{"lieu": lieu, "user": user},
					
		function (){
			$.post('PHP.php',{
				lieu : lieu,
				},
		
				function(reponse) { 
					var string = reponse.split('-');
					var nblike = parseInt(string[0]);
					var nbdislike = parseInt(string[1]);
					
					var doughnutData = [
						{
							value: nblike,
							color:"blue"
						},
						{
							value : nbdislike,
							color : "red"
						}			
					];
	
					var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData);
				}
			);	
		});
}
//Fonction qui insert un dislike en fonction du lieu et de l'user
function envoyerDislike(lieu, user) {
	$.post("ajoutdislike.php",
		{"lieu": lieu, "user": user},
		
function (){
			$.post('PHP.php',{
				lieu : lieu,
				},
		
				function(reponse) {
					var string = reponse.split('-'); 
					var nblike = parseInt(string[0]);
					var nbdislike = parseInt(string[1]);
					
					var doughnutData = [
						{
							value: nblike,
							color:"blue"
						},
						{
							value : nbdislike,
							color : "red"
						}			
					];
	
					var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData);
				}
			);	
		});
}