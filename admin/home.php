<?php
	require_once('../config/config.php');
	require_once('includes/functions.inc.php');
?>
<html>
<head>
	<title>Panneau d'administration - Les utilisateurs</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css">
	<link href="css/bootstrap-responsive.min.css" rel="stylesheet" type="text/css">
  <link href="css/style.css" rel="stylesheet" type="text/css">
</head>
<body>

  <div role="navigation" class="navbar navbar-static-top">
    <div class="navbar-inner">
      <div class="container">
        <div class="container">
            <button data-target=".nav-collapse" data-toggle="collapse" class="btn btn-navbar" type="button">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a href="home.php" class="brand">Panneau d'administration - FindItOut</a>
            <div class="nav-collapse collapse">
              <ul class="nav">
                <li class="active">
                  <a href="home.php">Utilisateurs</a>
                </li>
                <li class="">
                  <a href="lieux.php">Lieux</a>
                </li>
                <li class="">
                  <a href="commentaires.php">Commentaires</a>
                </li>
                <li>
                  <a href="" class="logout">Déconnexion</a>
                </li>
              </ul>
            </div>
          </div>
      </div><!-- /.container -->
    </div>
   </div>

  <div class="container-fluid">

  	<div class="row-fluid">
  				<h1>Les utilisateurs</h1>
  	</div>

    <div class="row">

      <?php
      	displayUsers($dbh);
      ?>

    </div>

  </div><!-- .container-fluid -->

  <script src="js/jquery-1.10.2.min.js"></script>
  <script src="js/bootstrap.min.js"></script>
  <script src="js/admin.js"></script>

</body>
</html>