<?php
  
  define('FACEBOOK_appId','499357543494722');
  define('FACEBOOK_secret','a11732d18fbc24fe6942a257b15d53fa');
  define('FACEBOOK_returnURL','http://illio.fr/projet_html/tests_erwan/facebook_connect2.php');

  require_once('lib/facebook/facebook.php');
   
  $facebook = new Facebook(array(
    'appId'  => FACEBOOK_appId,
    'secret' => FACEBOOK_secret,
  ));

  $user = $facebook->getUser();
  //var_dump($user);
  if ($user) {
    try {
      //$user_profile = $facebook->api('/me');
      //$friends = $facebook->api('/me/friends');
      //var_dump($user_profile);
      //var_dump($friends);

      //var_dump($friends);

      //$userid = '1020032543';

      $jeton = $facebook->getAccessToken();
      //var_dump($jeton);

      //$jeton = 'CAAHGKbzZB9EIBAEIdlUA4bZCDipLwil0O0VLZB9b8mWkjAB75pUjV5qiJQNp97ymnjLXUHD4K2hFZB6YVboNPpd2Vs37p2A6EAsZCDIhOLif8UVNhf3sWteSgfyECXpaNHTCbIH2u2rgx1VMJeb0qNlAfUakarSfOweO9TccCol9Xp5wKU9Oqtp57c509igKJ3D1ZBvuoNPQZDZD';
      $response = file_get_contents('https://graph.facebook.com/me/friends?fields=id,name,checkins,interests&access_token='.$jeton);
      //var_dump($response);

      $friends = json_decode($response,true);

      foreach($friends['data'] as $f){
        echo('<div><p>'.$f['name'].':</p>');
        echo('<ul>');
        if(isset($f['checkins'])){
          foreach($f['checkins']['data'] as $i){
            echo('<li>'.$i['place']['name'].'</li>');
            //var_dump($i);
          }
        }
        echo('</ul>');
      }

      /*foreach($friends['data'] as $f){

        //$userid = '1020032543';
        $userid = $f['id'];
        $response = file_get_contents('https://graph.facebook.com/'.$userid.'/?access_token=CAAHGKbzZB9EIBAHAkC4FDMVjz0hOk9EnGSZBZAZAJK9MlfRTH43gfBHtxwltQEFFtPcnPupQ2RegtZAPWYZA6F8QP5CA2CGB9hVDm8oAoNUzCUfdZCKN5X0mIplZBZANDc9shop4ZAoijGpUaEbxjDlF0UlTV5bobzyVV5IatYtqvkbctXIhiUbPeWkfTevqaOeWPfHYEegMHOhwZDZD&fields=id,name,locations&locale=fr_FR');

        $infos = json_decode($response,true);
        if(isset($infos['locations']) && is_array($infos['locations'])){
            echo('<div><p>'.$infos['name'].':</p>');
            echo('<ul>');
            foreach($infos['locations']['data'] as $i){
              echo('<li>'.$i['place']['name'].'</li>');
            }
            echo('</ul>');

        }
        //var_dump('<br>'.$response);

      }*/
    } catch (FacebookApiException $e) {
      error_log($e);
      $user = null;
    }
  }
?>

<html>
<head>
  <title></title>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
</head>
<body>
  <div id="fb-root"></div>

  <?php 
    if ($user) {
      $logoutUrl = $facebook->getLogoutUrl();
      echo('<a href="'.$logoutUrl.'">Se déconnecter</a>');
    } else {
      $loginUrl = $facebook->getLoginUrl(array('scope'=>'user_activities,friends_activities,user_checkins,friends_checkins,user_interests,friends_interests,user_location,friends_location','redirect-uri'=>FACEBOOK_returnURL));
      echo('<a href="'.$loginUrl.'">Se connecter</a>');
    }
  ?>
</body>
</html>