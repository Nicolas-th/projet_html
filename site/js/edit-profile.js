$(document).ready(function() {

    // On cache le bouton submit si je js est activé
    $('#changeAvatar form input[type=submit]').addClass('hide');


    // lorsque je soumets le formulaire
    $('#update_info').on('submit', function() {
 
        // je récupère les valeurs
		var name = $('#name').val();
		var surname = $('#surname').val();
		var email = $('#email').val();
 
        // je vérifie une première fois pour ne pas lancer la requête HTTP
        // si je sais que mon PHP renverra une erreur
        if(name == '' || surname == '' || email == '') {
            $("#messageEdit").html("'Les champs doivent êtres remplis.");
    	    $("#messageEdit").addClass('messageError');
        } else {
            // appel Ajax
            $.ajax({
                url: $(this).attr('action'), // le nom du fichier indiqué dans le formulaire
                type: $(this).attr('method'), // la méthode indiquée dans le formulaire (get ou post)
                data: $(this).serialize(), // je sérialise les données (voir plus loin), ici les $_POST
                success: function(html) { // je récupère la réponse du fichier PHP
                    if(html=="errorProfile") {
    					$("#messageEdit").html("Une erreur est survenue.");
    	                $("#messageEdit").addClass('messageError');
                    }
                    
    	             if(html=="successProfile") {
    	             	console.log(html);
    	             	$("#messageEdit").html("Vos informations ont été modifiées.");
    	             	$(location).attr('href', 'home.php');
    	             } 
    	            
                },
                error: function(){
                    $('#update_info').submit();
                }
            });
        }
        return false; // j'empêche le navigateur de soumettre lui-même le formulaire
    });
    
    
     // lorsque je soumets le formulaire
    $('#hidden_password').on('submit', function() {
 
        // je récupère les valeurs
        var old_password = $('#old_password').val();
        
		var password = $('#password').val();
		var password_confirm = $('#password_confirm').val(); 
		
        // je vérifie une première fois pour ne pas lancer la requête HTTP
        // si je sais que mon PHP renverra une erreur
        if(old_password == '' || password == '' || password_confirm == '') {
            $("#messageEdit").html("'Les champs doivent êtres remplis.");
    	    $("#messageEdit").addClass('messageError');
        } else {
            // appel Ajax
            $.ajax({
                url: $(this).attr('action'), // le nom du fichier indiqué dans le formulaire
                type: $(this).attr('method'), // la méthode indiquée dans le formulaire (get ou post)
                data: $(this).serialize(), // je sérialise les données (voir plus loin), ici les $_POST
                success: function(html) { // je récupère la réponse du fichier PHP
                    console.log(html);
                    if(html=="oldPswdWrong") {
    					$("#messageEdit").html("Le mot de passe actuel n'est pas correct.");
    	                $("#messageEdit").addClass('messageError');
                    }
                    
    	             if(html=="successPswd") {
    	             	$("#messageEdit").html("Votre mot de passe a bien été changé.");
    	             	$(location).attr('href', 'home.php');
    	             } 
    	             
    	             if(html=="newPswdWrong") {
    	             	$("#messageEdit").html("les deux nouveaux mots de passe ne correspondent pas.");
    	                $("#messageEdit").addClass('messageError');
    	             }  

    	            
                },
                error: function(){
                    $('#hidden_password').submit();
                }
            });
        }
        return false; // j'empêche le navigateur de soumettre lui-même le formulaire
    });
    
    $('#changeAvatar form input[type=file]').on('change',function(){
        uploadFile('#form_avatar',function(){
            $(".avatar").attr('src',$(".avatar").attr('src')+'?'+ Math.random());
        });
     });

});