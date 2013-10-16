<!doctype html>
<html>
	<head>
		<title>Doughnut Chart</title>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="Chart.js"></script>
		<meta name = "viewport" content = "initial-scale = 1, user-scalable = no">
		<style>
			canvas{
			}
		</style>
	</head>
	<body>
		<canvas id="canvas" height="450" width="450"></canvas>

	<script>
		$(function() {
			$.post('nblike.php',
				{
					test : 'coucou',
				},
				function(reponse) { 
					console.log(reponse);
				}
				
			);	
		});
		var doughnutData = [
				{
					value: 50,
					color:"#F7464A"
				},
				{
					value : 50,
					color : "#46BFBD"
				}			
			];

	var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData);
	
	</script>
	</body>
</html>
