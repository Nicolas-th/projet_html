  $("#bouton2").css("display","none");
  
  $("#profile").click(function(){
  	console.log($("#popup_right").attr('style'));
  	  if($('#popup_right').attr('style') != "right: -280px;"){
  	  	 $("#popup_right").animate({
		  right:"-280px"
		  },400);
  	  }
  	  
  	  else {
  	  $("#popup_right").animate({
	  right:"0"
	  },400);
	  }
	  
	  $("#bouton2").css("display","block");	
	  
	  $("#popup").animate({
	  left:"-280px"
	  },400); 
	  
  });
  
 

  $("#bouton_right").click(function(){
	console.log($("#popup_right").attr('style'));
	  $("#popup_right").animate({
	  right:"-280px"
	  },400);
  });
  
  
  $("#bouton").click(function(){
  	  $("#popup").animate({
  	  left:"-280px"
  	  },400);
 
  $("#bouton2").css("display","block");	   
      
  });
  
  $("#bouton2").click(function(){
	  $("#popup").animate({
	  left:"0px"
	  },400);
	  
	  $("#popup_right").animate({
	  right:"-280px"
	  },400);
	 
  $("#bouton2").css("display","none");
  });

/******Modification ou suprression d'itinéraires dans profil************/

$(".edit_itineraries").click(function(){
	$(".itinerary :nth-child(1)").removeClass('saved').addClass('trash');
	$(".edit_itineraries").css("display","none");
	$("#save_itineraries").css("display","block");
	
});


$(".edit_added_places").click(function(){
	$("#popup_right ul li img").attr({ src: "img/trash.svg", width: "20" });
	
});



/*****Formulaire hidden de profile settings******/

$("#edit_password img").click(function(){
	  $("#hidden_password").fadeToggle(300);
	  $("#hidden_password input").removeAttr('disabled');
	  $("#save_password").css("display","block");
	  //$("#popup_right form input[type=text]").css('background-color','grey');
  });


$("#edit img").click(function(){
	  $("#update_info input").removeAttr('disabled');
	  $("#save_infos").css("display","block");
	  //$("#popup_right form input[type=text]").css('background-color','grey');
  });