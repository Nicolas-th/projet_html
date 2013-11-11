$(document).ready(function() {
    var progressbox     = $('#form_photo .conteneur_progress_bar');
    var progressbar     = $('#form_photo .progress_bar');
    var statustxt       = $('#form_photo .progress_value');
    var submitbutton    = $('#form_photo input[type="submit"]');
    var myform      = $('#form_photo form');
    var completed       = '0%';

    $(myform).ajaxForm({
        beforeSend: function() {
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
            if(percentComplete>50)
                {
                    statustxt.css('color','#fff');
                }
            },
        complete: function(response) {
            myform.resetForm();
            submitbutton.removeAttr('disabled');
            progressbox.slideUp();
        }
    });
});