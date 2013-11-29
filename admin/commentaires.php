<?php
	require_once('../config/config.php');
	require_once('includes/functions.inc.php');
?>
<html>
<head>
	<title>Panneau d'administration - Les commentaires</title>
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
              <li class="">
                <a href="home.php">Utilisateurs</a>
              </li>
              <li class="">
                <a href="lieux.php">Lieux</a>
              </li>
              <li class="active">
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
				<h1>Les commentaires</h1>
		</div>

    <div class="row">

      <!-## Les commentaires signalés ## ->

      <div class="span5" id="bloc-com-signales">

        <div class="span4">
          <h3 class="com-signales">Commentaires signalés</h3>
        </div>

        <?php
        	displayComments($dbh);
        ?>

      </div><!-- div#bloc-com-signales -->

      <!-## Tous les commentaires ## ->

      <div class="span7">

        <div class="span4">
          <h3>Tous les commentaires</h3>
        </div>

         <?php
         	displayAllComments($dbh);
         ?>

      </div><!-- div.span7 -->

  </div><!-- .container-fluid -->

  <script src="js/jquery-1.10.2.min.js"></script>
  <script src="js/bootstrap.min.js"></script>

</body>
</html>