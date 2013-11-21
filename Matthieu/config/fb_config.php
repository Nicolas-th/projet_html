<?php
// CONNEXION À LA BASE DE DONNÉES
require_once('config.php');
require_once('facebook/facebook.php');

$app_id = '572222546160247';
$app_secret = '65d1e941c88eebe1e2068f42c0a94d35';
$scope = 'user_status,email,user_birthday,user_likes,read_stream';
$redirect_uri = 'http://www.find-it-out.fr/site/home.php';

// Init the Facebook SDK
$facebook = new Facebook(array(
    'appId'  => $app_id,
		'secret' => $app_secret,
));

$params = array(
	'scope' => $scope,
	'redirect_uri' => $redirect_uri ,
	'display' => 'popup',
);



// Get the current user
$user = $facebook->getUser();

if ($user) {
	try {
		// Proceed knowing you have a logged in user who's authenticated.
		$user_profile = $facebook->api('/me');
	} catch (FacebookApiException $e) {
		echo '<pre>'.htmlspecialchars(print_r($e, true)).'</pre>';
		$user = null;
	}
}


// Login or logout url will be needed depending on current user state.

if ($user) {
  //$logoutUrl = $facebook->getLogoutUrl();
  $user_fb_id = $user_profile['id'];
  $user_fb_avatar = $user_fb_avatar ="https://graph.facebook.com/".$user_profile['id']."/picture?width=150&height=150";
  $user_fb_name = $user_profile['first_name']; 
	  $user_fb_surname = $user_profile['last_name'];
	  $user_fb_username = $user_profile['username'];
	  $user_fb_email = $user_profile['email'];
	  $user_fb_birthday = $user_profile['birthday'];
	  $user_fb_birthday = date('Y-m-d', strtotime(str_replace('-', '/',  $user_fb_birthday)));
  $usersDbExist = $dbh -> query("SELECT email FROM users WHERE email LIKE '$user_fb_email'")->fetch();
  
  if ($usersDbExist) {
  	//MISE À JOUR DES INFOS
  	 $modify = $dbh->query("UPDATE users SET 
  	 							avatar= '$user_fb_avatar', 
  	 							name = '$user_fb_name',
  	 							surname = '$user_fb_surname',
  	 							nickname = '$user_fb_username',
  	 							birthday ='$user_fb_birthday',
  	 							email = '$user_fb_email'
  	 						WHERE facebook_key = '$user_fb_id'");
  	 $usersDbSession = $dbh -> query("SELECT * FROM users WHERE email LIKE '$user_fb_email'")->fetch();
  	 $_SESSION['email'] = $usersDbSession['email'];
  	 $_SESSION['fb_id'] = $usersDbSession['facebook_key'];
  	 $_SESSION['first_name'] = $usersDbSession['name'];
  	 $_SESSION['last_name'] = $usersDbSession['surname'];
  	 $_SESSION['id'] = $usersDbSession['id'];
  } else {
  	//INSERTION DE L'UTILISATEURS
	 $insert = $dbh -> query("INSERT users VALUES ('', '$user_fb_avatar', '$user_fb_name', '$user_fb_surname', '$user_fb_username', '$user_fb_birthday', '$user_fb_email', '', NOW(), '$user_fb_id', '')");
	 $usersDbSession = $dbh -> query("SELECT * FROM users WHERE email LIKE '$user_fb_email'")->fetch();
  	 $_SESSION['email'] = $usersDbSession['email'];
  	 $_SESSION['fb_id'] = $usersDbSession['facebook_key'];
  	 $_SESSION['first_name'] = $usersDbSession['name'];
  	 $_SESSION['last_name'] = $usersDbSession['surname'];
  	 $_SESSION['id'] = $usersDbSession['id'];	  
  }
  		 
} else {
  $statusUrl = $facebook->getLoginStatusUrl();
  $loginUrl = $facebook->getLoginUrl($params);
  //var_dump($loginUrl);

}


?>

	
	
	
