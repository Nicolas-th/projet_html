$(document).ready(function() {

    // lorsque je soumets le formulaire
    $('#loginForm').on('submit', function() {
 
        // je récupère les valeurs
		var nickname = $('#nickname').val();
		var password = $('#password').val();
 
        // je vérifie une première fois pour ne pas lancer la requête HTTP
        // si je sais que mon PHP renverra une erreur
        if(nickname == '' || password == '') {
            $("#messageLogin").html(" Tous les champs doivent êtres remplis");
        } else {
            // appel Ajax
            $.ajax({
                url: $(this).attr('action'), // le nom du fichier indiqué dans le formulaire
                type: $(this).attr('method'), // la méthode indiquée dans le formulaire (get ou post)
                data: $(this).serialize(), // je sérialise les données (voir plus loin), ici les $_POST
                success: function(html) { // je récupère la réponse du fichier PHP
                if(html="success") {
	        
                };
                 if(html="error") {
                     $("#messageLogin").html(html);
	                 $("#messageLogin").addClass('loginError');
	                 return false;
                }
	                
                }
            });
        }
        return false; // j'empêche le navigateur de soumettre lui-même le formulaire
    });  
    
    
    // lorsque je soumets le formulaire
    $('#signinForm').on('submit', function() {
 
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
            $("#messageLogin").html("Tous les champs doivent être remplis");
        } else {
            // appel Ajax
            $.ajax({
                url: $(this).attr('action'), // le nom du fichier indiqué dans le formulaire
                type: $(this).attr('method'), // la méthode indiquée dans le formulaire (get ou post)
                data: $(this).serialize(), // je sérialise les données (voir plus loin), ici les $_POST
                success: function(html) { // je récupère la réponse du fichier PHP
                if(html="success") {
					//$("#messageLogin").html(html);
	                 //$("#messageLogin").addClass('loginError');
                };
                 if(html="error") {
                     //$("#messageLogin").html(html);
	                 //$("#messageLogin").addClass('loginError');
	                 return false;
                }
	                
                }
            });
        }
        return false; // j'empêche le navigateur de soumettre lui-même le formulaire
    });   
});