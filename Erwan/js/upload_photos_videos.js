$(document).ready(function() {

    uploadFile('#form_photo');
    uploadFile('#form_video');

});


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
            }else{
                progressbox.after('<p class="response">'+response.responseText+'</p>');
            }
        }
    });
}