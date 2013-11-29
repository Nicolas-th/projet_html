$(function(){
	localize.getUserLocation({
        localized : function(positionGeoc){
        	// On remplie les champs concernant la localisation et l'adresse grâce aux données GPS
        	$('#form-ajout-lieux input[name=latitude]').val(positionGeoc.latitude);
        	$('#form-ajout-lieux input[name=longitude]').val(positionGeoc.longitude);
        	localize.getAdress({
        		latitude : positionGeoc.latitude,
        		longitude : positionGeoc.longitude,
        		success : function(params){
        			$('#form-ajout-lieux input[name=address]').val(params.adress);
        			$('#form-ajout-lieux input[name=postCode]').val(params.postCode);
        			$('#form-ajout-lieux input[name=city]').val(params.city);
        		}
        	})
        },
        error : function(){
        	$('#form-ajout-lieux input[name=address],#form-ajout-lieux input[name=postCode],#form-ajout-lieux input[name=city]').attr('type','text');
        	$('.infos_localisation_lieu').removeClass('hide');
        }
    });

    $('#form-ajout-lieux').on('submit',function(evt){
    	evt.preventDefault();
    	$('.error').remove();

    	// Si la géolocalisation est désactivée
    	if(!$('.infos_localisation_lieu').hasClass('hide')){
    		var error = false;
    		if(!$('#form-ajout-lieux input[name=address]').val().length>0){
    			error = 'Vous devez indiquer une adresse.';
    		}else if(!$('#form-ajout-lieux input[name=postCode]').val().length>0){
    			error = 'Vous devez indiquer un code postal.';
    		}else if(!$('#form-ajout-lieux input[name=city]').val().length>0){
    			error = 'Vous devez indiquer une ville.';
    		}
    		if(error!==false){
    			$('#form-ajout-lieux').before($('<p></p>').addClass('error').html(error));
    		}else{
    			var address = $('#form-ajout-lieux input[name=address]').val()+', '+$('#form-ajout-lieux input[name=postCode]').val()+' '+$('#form-ajout-lieux input[name=city]').val();
    			localize.getLocalization({
    				address : address,
    				success : function(params){
    					$('#form-ajout-lieux input[name=latitude]').val(params.position.latitude);
        				$('#form-ajout-lieux input[name=longitude]').val(params.position.longitude);
        				sendForm();
    				},
    				error : function(){
    					$('#form-ajout-lieux').before($('<p></p>').addClass('error').html('Adresse inconnue. Veuillez vérifier votre saisie.'));
    				}	
    			});
    		}
    	// Si la géolocalisation est activée
    	}else{
    		if(!$('#form-ajout-lieux input[name=latitude]').val().length>0 && $('#form-ajout-lieux input[name=longitude]').val().length>0){
    			$('#form-ajout-lieux').before($('<p></p>').addClass('error').html('Echec lors de votre géolocalisation. Veuillez remplir les champs manuellement.'));
    			$('#form-ajout-lieux input[name=address],#form-ajout-lieux input[name=postCode],#form-ajout-lieux input[name=city]').attr('type','text');
        		$('.infos_localisation_lieu').removeClass('hide');
    		}else{
                sendForm();
    		}
    	}
    })
});

function sendForm(){
	$('.error').remove();
	$.ajax({     
	    type: 'POST',  
	    url: "/ajax/validate-place.xhr.php",
	    dataType: "json",
	    data: $('#form-ajout-lieux').serialize(),   
	    success: function (params) {
	    	if(params.type=='ok'){
	    		window.location = params.url;
	    	}else{
	    		$('#form-ajout-lieux').before($('<p></p>').addClass('error').html(params.erreur));
                $('#form-ajout-lieux input[name=address],#form-ajout-lieux input[name=postCode],#form-ajout-lieux input[name=city]').attr('type','text');
                $('.infos_localisation_lieu').removeClass('hide');
	    	}
	    },
	    error: function(params){
            console.log(params);
			$('#form-ajout-lieux').before($('<p></p>').addClass('error').html('Une erreur s\'est produite. Veuillez recommencer.'));
            $('#form-ajout-lieux input[name=address],#form-ajout-lieux input[name=postCode],#form-ajout-lieux input[name=city]').attr('type','text');
            $('.infos_localisation_lieu').removeClass('hide');
	    }

	}); 
}