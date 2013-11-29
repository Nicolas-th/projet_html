<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
require_once('config/config.php'); 
/*----------------------ACCÈS À FACEBOOK---------------------*/
require_once('config/fb_config.php'); 
  $facebook->destroySession();
  session_unset();
  session_destroy();
  header('Location: index.php');
  exit();
 ?>