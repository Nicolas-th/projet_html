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
            console.log($(this).serialize());
            // appel Ajax
            $.ajax({
                url: $(this).attr('action'), // le nom du fichier indiqué dans le formulaire
                type: $(this).attr('method'), // la méthode indiquée dans le formulaire (get ou post)
                data: $(this).serialize(), // je sérialise les données (voir plus loin), ici les $_POST
                success: function(html) { // je récupère la réponse du fichier PHP
                    console.log(html);
                    console.log(name); // j'affiche cette réponse
                    console.log(surname); // j'affiche cette réponse
                    console.log(email); // j'affiche cette réponse
                }
            });
        }
        return false; // j'empêche le navigateur de soumettre lui-même le formulaire
    });
    
    
uploadFile('#changeAvatar');

    
function uploadFile(conteneurFormSelector){
	
	    var form            = $(conteneurFormSelector).children('form').first();
	    var progressbox     = $(conteneurFormSelector).children('.conteneur_progress_bar').first();
	    var progressbar     = progressbox.children('.progress_bar').first();
	    var statustxt       = progressbox.children('.progress_value').first();
	    var submitbutton    = $(conteneurFormSelector).children('input[type="submit"]').first();
	    var completed       = '0%';
	
	    $(form).ajaxForm({
	        beforeSend: function() {
	            $('.response').remove();
	            submitbutton.attr('disabled', '');
	            statustxt.empty();
	            progressbox.slideDown(); 
	            progressbar.width(completed);
	            statustxt.html(completed);
	            statustxt.css('color','#000');
	        },
	        uploadProgress: function(event, position, total, percentComplete) {
	            progressbar.width(percentComplete + '%')
	            statustxt.html(percentComplete + '%')
	            if(percentComplete>50){
	                    statustxt.css('color','#fff');
	            }
	        },
	        complete: function(response) {
	            if(response.status=='200'){
	                progressbox.after('<p class="response">'+response.responseText+'</p>');
	                form.resetForm();
	                submitbutton.removeAttr('disabled');
	                progressbox.slideUp();
	                $(".avatar").attr('src',$(".avatar").attr('src')+'#');
	               
	            }else{
	                progressbox.after('<p class="response">'+response.responseText+'</p>');
	                console.log(response);
	            }
	            
	        }
	    });
	    
	}
    
});