
  $("#bouton2").css("display","none");

  $("header div:nth-child(2)").click(function(){

  	if($("header div:nth-child(3)").hasClass('actif')){

  		$("#sidebar_profile").hide(0);
	  	$("#sidebar_edit").show(0);
		$("header div:nth-child(2)").addClass('actif');
		$("header div:nth-child(3)").removeClass('actif');

  	}else{

	  	$("#sidebar_edit").show(400);
  
		  $("#sidebar_profile").css("display","none");
		  $("#sidebar_edit").css("display","block");
	  
	  	  if($('#popup_right').css('right') != "-280px"){
	  	  	$("header div:nth-child(2)").removeClass('actif');
	  	  	$("#popup_right").animate({
			  right:"-280px"
			  },400,function(){
			  	$('#popup_right').hide(0);
			  });
	  	  }else {
	  	  	$("header div:nth-child(2)").addClass('actif');
	  	  	$('#popup_right').show(0,function(){
		  	  $("#popup_right").animate({
			  	right:"0"
			  },400);
			});
		  }
		  
		  $("#bouton2").css("display","block");	
		  
		  $("#popup").animate({
		  	left:"-280px"
		  },400); 
	}
	  
  });
  
  $("header div:nth-child(3)").click(function(){

  	if($("header div:nth-child(2)").hasClass('actif')){

	  	$("#sidebar_edit").hide(0);
		$("#sidebar_profile").show(0);
		$("header div:nth-child(3)").addClass('actif');
		$("header div:nth-child(2)").removeClass('actif');

	}else{

		$("#sidebar_edit").css("display","none");
	 	$("#sidebar_profile").css("display","block");
	  
		if($('#popup_right').css('right') != '-280px'){

			$("header div:nth-child(3)").removeClass('actif');
			$("#popup_right").animate({
			 	right:"-280px"
			},400,function(){
				$('#popup_right').hide(0);
			});

		}else {
			$("header div:nth-child(3)").addClass('actif');
			$('#popup_right').show(0,function(){
			  	$("#popup_right").animate({
					right:"0"
				},400);
			});
		}

		$("#bouton2").css("display","block");	

		$("#popup").animate({
			left:"-280px"
		},400); 
	}
	  
  });


  $("#bouton_right").click(function(){
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

/******Modification ou suppression d'itinéraires dans profil************/

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
	  $("#update_info input[type=text],#update_info input[type=email]").css("background-color","grey");
	  $("#save_infos").css("display","block");
	  //$("#popup_right form input[type=text]").css('background-color','grey');
  });
