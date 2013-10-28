<?php
	session_start();
	
?>
<a href="inscription.php">Inscription ici</a>

<form method="post" action="login.php">
	<label for="mail">Mail : </label><input type="email" name="mail" placeholder="E-mail" id="mail" required/>
	<label for="password">Mail : </label><input type="password" name="password" placeholder="Mot de passe" id="password" required/>
	<input type="submit" value="Se connecter" />
</form>