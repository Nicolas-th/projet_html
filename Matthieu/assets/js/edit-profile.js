$(document).ready(function() {
    // lorsque je soumets le formulaire
    $('#editProfile').on('submit', function() {
 
        // je récupère les valeurs
		var name = $('#name').val();
		var surname = $('#surname').val();
		var email = $('#email').val();
 
        // je vérifie une première fois pour ne pas lancer la requête HTTP
        // si je sais que mon PHP renverra une erreur
        if(name == '' || surname == '' || email == '') {
            alert('Les champs doivent êtres remplis');
        } else {
            // appel Ajax
            $.ajax({
                url: $(this).attr('action'), // le nom du fichier indiqué dans le formulaire
                type: $(this).attr('method'), // la méthode indiquée dans le formulaire (get ou post)
                data: $(this).serialize(), // je sérialise les données (voir plus loin), ici les $_POST
                success: function(html) { // je récupère la réponse du fichier PHP
                    console.log(name); // j'affiche cette réponse
                    console.log(surname); // j'affiche cette réponse
                    console.log(email); // j'affiche cette réponse
                }
            });
        }
        return false; // j'empêche le navigateur de soumettre lui-même le formulaire
    });
});