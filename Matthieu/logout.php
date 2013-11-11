<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
require 'config/config.php'; 
/*----------------------ACCÈS À FACEBOOK---------------------*/
require 'config/fb_config.php'; 
  $facebook->destroySession();
  session_unset();
  session_destroy();
  header('Location: index.php');
  exit();
 ?>