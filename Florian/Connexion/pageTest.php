<?php
	session_start(); 
	
	if ($_SESSION['id'] != 0){
		echo "connecté";
	}
	else{
		echo '<p>Petit coquin, va ...</p>';
		exit(); 
	}
?>