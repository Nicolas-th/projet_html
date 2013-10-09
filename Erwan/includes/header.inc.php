<?php
	session_start();
	if(!defined('CHEMIN_REQUIRES'))	define('CHEMIN_REQUIRES','');
	require_once(CHEMIN_REQUIRES.'includes/config.inc.php');
	require_once(CHEMIN_REQUIRES.'classes/sql.class.php');
	require_once(CHEMIN_REQUIRES.'includes/functions.inc.php');
?>