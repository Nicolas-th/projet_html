<?php

	require_once('../includes/config.inc.php');
	require_once('../classes/sql.class.php');
	require_once('../includes/functions.inc.php');

	/* Flick */
	$sql = new SQL();
	$sql->prepare('SELECT *	FROM api_flickr');
	$flickr_posts = $sql->execute(true);

	if(is_array($flickr_posts) && count($flickr_posts)>0){
		require_once('../lib/flickr/phpFlickr.php');
		$flickr = new phpFlickr(FLICKR_APP_KEY, FLICKR_APP_KEY_SECRET);
		$flickr->setToken(FLICKR_USER_TOKEN);
		foreach($flickr_posts as $p){
			$attachment = json_decode($p['attachment'],true);
			$result = $flickr->sync_upload($attachment['path_image'],$attachment['title'],$attachment['description'],$attachment['keywords']);

			$sql->prepare('DELETE FROM api_flickr WHERE id=:id');
			$sql->bindValue('id',$p['id'],PDO::PARAM_INT);
			$sql->execute();
		}
	}

	/* Twitter */
	$sql = new SQL();
	$sql->prepare('SELECT *	FROM api_twitter');
	$twitter_posts = $sql->execute(true);

	if(is_array($twitter_posts) && count($twitter_posts)>0){
		require_once('../lib/tmhOAuth/tmhOAuth.php');
		$connection = new tmhOAuth(array(
			'consumer_key' => TWITTER_CONSUMER_KEY,
			'consumer_secret' => TWITTER_CONSUMER_KEY_SECRET,
			'user_token' => TWITTER_ACCESS_TOKEN,
			'user_secret' => TWITTER_ACCESS_TOKEN_SECRET
		));
		foreach($twitter_posts as $p){
			$attachment = json_decode($p['attachment'],true);
			var_dump($attachment);
			$response_code = $connection->request('POST', $p['type'],
		       	$attachment,
		        true,
		        true
		    );
		    var_dump($response_code);
			//if($response_code == 200) {
				$sql->prepare('DELETE FROM api_twitter WHERE id=:id');
				$sql->bindValue('id',$p['id'],PDO::PARAM_INT);
				$sql->execute();
			//}
		}
	}

	/* Facebook */
	$sql = new SQL();
	$sql->prepare('SELECT *	FROM api_facebook');
	$facebook_posts = $sql->execute(true);

	if(is_array($facebook_posts) && count($facebook_posts)>0){
		require_once('../lib/facebook/facebook.php');
		try{
			$facebook = new Facebook(array(
				'appId'  => FACEBOOK_APP_KEY,
				'secret' => FACEBOOK_APP_KEY_SECRET,
				'cookie' => false,
			));
			foreach($facebook_posts as $p){
				$attachment = json_decode($p['attachment'],true);
				$result = $facebook->api($p['type'], 'post', $attachment);

				$sql->prepare('DELETE FROM api_facebook WHERE id=:id');
				$sql->bindValue('id',$p['id'],PDO::PARAM_INT);
				$sql->execute();
			}
		}
		catch(FacebookApiException $e){
			print_r($e);
		}
	}

?>