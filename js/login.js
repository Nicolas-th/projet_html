$(document).ready(function() {

    // lorsque je soumets le formulaire
    $('#loginForm').on('submit', function(evt) {

        evt.preventDefault();
 
        // je récupère les valeurs
        console.log('test1');
		var nickname = $('#nickname').val();
		var password = $('#password').val();
 
        // je vérifie une première fois pour ne pas lancer la requête HTTP
        // si je sais que mon PHP renverra une erreur
        if(nickname == '' || password == '') {
            $("#messageLogin").html(" Tous les champs doivent êtres remplis");
        } else {
            console.log('test2');
            // appel Ajax
            $.ajax({
                url: $(this).attr('action'), // le nom du fichier indiqué dans le formulaire
                type: $(this).attr('method'), // la méthode indiquée dans le formulaire (get ou post)
                data: $(this).serialize(), // je sérialise les données (voir plus loin), ici les $_POST
                success: function(html) { // je récupère la réponse du fichier PHP
                console.log(html);
                    if(html=="success") {
    	               $(location).attr('href', 'home.php');
                    }else if(html=="error") {
                        $("#messageLogin").html("Votre nom d'utilisateur ou mot de passe est incorrect");
                        $("#messageLogin").addClass('messageError');
                    }  
                },
                error: function(){
                     $('#loginForm').submit();
                }
            });
        }
        return false; // j'empêche le navigateur de soumettre lui-même le formulaire
    });  
    
    
   

    // lorsque je soumets le formulaire
    $('#signinForm').on('submit', function(evt) {
        evt.preventDefault();
 
        // je récupère les valeurs
        var nom = $('#nom').val();
		var prenom = $('#prenom').val();
		var pseudo = $('#pseudo').val();
		var email = $('#email').val();
		var password1 = $('#password1').val();
		var password2 = $('#password2').val();

 
        // je vérifie une première fois pour ne pas lancer la requête HTTP
        // si je sais que mon PHP renverra une erreur
        if(nom == '' || prenom == '' || pseudo == '' || email == '' || password1 == '' || password2 == '') {
            $("#messageSignin").html("Tous les champs doivent être remplis");
		} else  {        
            // appel Ajax
            $.ajax({
                url: $(this).attr('action'), // le nom du fichier indiqué dans le formulaire
                type: $(this).attr('method'), // la méthode indiquée dans le formulaire (get ou post)
                data: $(this).serialize(), // je sérialise les données (voir plus loin), ici les $_POST
                success: function(html) { // je récupère la réponse du fichier PHP
                    
                    if(html=="emailExist") {
    					$("#messageSignin").html("L'email existe déjà. Veuillez en choisir un autre.");
    	                $("#messageSignin").addClass('loginError');
                    }
                    
                     if(html=="userExist") {
                         $("#messageSignin").html("Le pseudo existe déjà. Veuillez en choisir un autre.");
    	                 $("#messageSignin").addClass('messageError');
                    }

    	             if(html=="success") {
    	             	$(location).attr('href', 'home.php');
    	             } 
    	             
    	             if(html=="errorPassword") {
    	             	$("#messageSignin").html("les deux mots de passe ne correspondent pas.");
    	                $("#messageSignin").addClass('messageError');
    	             }  

    	            
                },
                error: function(){
                    $('#signinForm').submit();
                }
            });
        }
        return false; // j'empêche le navigateur de soumettre lui-même le formulaire
    });   
});