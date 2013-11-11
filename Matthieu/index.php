<?php
/*------------ACCÈS BASE DE DONNÉES ET FACEBOOK--------------*/
require 'config/config.php'; 

/*----------------------ACCÈS À FACEBOOK---------------------*/
require 'config/fb_config.php'; 
$_SESSION = NULL;
?>
<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>FindItOut</title>
</head>

<body>
	<?php if ($user && $_SESSION['email']):
		header('Location: home.php');
    else: ?>
     <div>
        <h1>Bienvenue sur FindItOut</h1>
        <a href="<?php echo $loginUrl; ?>">Se connecter avec Facebook</a>
         <a href="signin.php">S'inscrire avec une adresse e-mail</a>
      </div>
      
      <div id="login">
      	<p> Se connecter à FindItOut</p>
		<form method="post" action="login.php" >
			<label for="mail">Mail : </label><input type="email" name="mail" placeholder="E-mail" id="mail" required/>
		    <label for="password">Mail : </label><input type="password" name="password" placeholder="Mot de passe" id="password" required/>
		    <input name="submit_login" type="submit" value="Se connecter" />
		</form>	      
      </div>
    <?php endif ?>
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
	<script>
	  window.fbAsyncInit = function() {
	    // init the FB JS SDK
	    FB.init({
	      appId      : '<? echo $app_id ?>',                        // App ID from the app dashboard
	      channelUrl : '', // Channel file for x-domain comms
	      status     : true,                                 // Check Facebook Login status
	      xfbml      : true                                  // Look for social plugins on the page
	    });
	
	    // Additional initialization code such as adding Event Listeners goes here
	  };
	
	  // Load the SDK asynchronously
	  (function(d, s, id){
	     var js, fjs = d.getElementsByTagName(s)[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement(s); js.id = id;
	     js.src = "//connect.facebook.net/fr_FR/all.js";
	     fjs.parentNode.insertBefore(js, fjs);
	   }(document, 'script', 'facebook-jssdk'));
	</script>
</body>
</html>