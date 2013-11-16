<!DOCTYPE html>
<head>
 	<meta charset="UTF-8" />
 	<meta http-equiv="X-UA-Compatible" content="IE=edge">
 	
		<title>Like / Dislike</title>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="Chart.js"></script>
		<script src="AJAX.js"></script>
		<meta name="description" content="">
		
		<meta name="viewport" content="width=device-width,initial-scale=1">
		
		<!--<link rel="stylesheet" href="Untitled.html">-->
		<style>
			canvas{
			}
		</style>
	</head>
	<body>
		<input type="button" id="buttonLike" value="Like" onclick="envoyerLike(lieu,user)"/>
		<input type="button" id="buttonDislike" value="Dislike" onclick="envoyerDislike(lieu,user)"/>
		<canvas id="canvas" height="450" width="450"></canvas>
		<script>
		var lieu = 34;
		var user = 6;
		$(function() {
			$.post('PHP.php',
				{
					lieu : lieu,
					//test : 'coucou', //Passe un argument dans la requete PHP
				},
				function(reponse) { 
					var string = reponse.split('-');
					var nblike = parseInt(string[0]);
					var nbdislike = parseInt(string[1]);
					/*var nbpourcentlike((nblike*100)/(nblike+nbdislike));
					var nbpourcentdislike((nbdislike*100)/(nblike+nbdislike));
					*/
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
		</script>
		
	</body>
</html>