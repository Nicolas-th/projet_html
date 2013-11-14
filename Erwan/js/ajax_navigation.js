$(function(){
	var width_window = document.body.offsetWidth;
	$('.conteneur_pages').on('click','.ajax_nav',function(evt){
		evt.preventDefault();
		var url = $(this).attr('href');
		if(!$(this).hasClass('previous')){
			$.ajax({
				url:url,
				success: function(data){
		      		$('.page_suivante').html(data);
		      		if(url!=window.location){
				      window.history.pushState({path:url},'',url);
				    }
				    $('.conteneur_pages').animate({left:width_window*-1});
		   		}
			});
		}else{
			$('.conteneur_pages').animate({left:0});
			if(url!=window.location){
		      window.history.pushState({path:url},'',url);
		    }
		}
	});
	$('.page_suivante').css('left',width_window);
});