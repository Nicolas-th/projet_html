<html>
<head>
	<title>Panneau d'administration - Connexion</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">

	<link rel="stylesheet" href="css/bootstrap.min.css">
	<link rel="stylesheet" href="css/signin.css">
	<link rel="stylesheet" href="css/bootstrap-responsive.min.css" > 

</head>
<body>
	<div class="container">
		<div class="row login">
			<h1>Connexion</h1>
		</div>		
		<div class="row">		
		 	<form method="post" action="" id="signinForm" class="form-signin">
			 		<div id="messageSignin"></div>
				 	<input class="input-block-level" type="text" name="pseudo" placeholder="Pseudo" id="pseudo" required /><br>
				 	<input class="input-block-level" type="password" name="password1" id="pass1" placeholder="Mot de passe" required /><br>
				 	<input class="btn btn-lg btn-primary btn-block "type="submit" name="submit_signin" value="Connexion" />
		 	</form>
		</div>
	</div>

</body>
</html>