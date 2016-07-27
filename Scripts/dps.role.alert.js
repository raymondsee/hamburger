$(function() {
    /*
     * Example one
     */
    $("#role-alert-example1-button").on("click", function(){
        var modal = $("#role-alert-example1-button");
        a11y_alert({message: "Please wait while we are processing your request ..."});
        $(document).on('opened.fndtn.reveal', '#modal-loading[data-reveal]', function () {
            $('#modal-loading').delay(2000).fadeOut(500, function(){
                $(this).foundation('reveal', 'close');
            });
        });
        
        return false;
    });
    
    /*
     * Example Two
     */
    $("#role-alert-example2-button").on("click", function() {
        $(document).on('opened.fndtn.reveal', '#modal-session-expiring[data-reveal]', function () {
            a11y_alert({target_id: "session-expired-message-id"});
        });
        
        return false;
    });
    
    
    /*
     * Example Three
     */
    $('#role-alert-example3-form').validate({
        errorElement: "small",
        errorTextClass: "text",
        errorContainer: $(".warning"),
        errorLabelContainer: ".warning",
        wrapper: "li",
        showErrors: function(errorMap, errorList) {
            showErrorsSummary(this, errorMap, errorList);
            a11y_alert({ target_id: "role-alert-example3-message-id" });
            scroll_to_form_top();
        },
        rules: {
            example3: {
                required: true,
                minlength: 160
            },
            example4: {
                required: true,
                minlength: 160
            }
        },
        submitHandler: function(form) {
            return false;
        }
    });

});

var showErrorsSummary = function(form, errorMap, errorList) {
    var numberOfError = form.numberOfInvalids();

    var message = numberOfError == 1
        ? "Your form contains " + numberOfError + " error, see details below."
        : "Your form contains " + numberOfError + " errors, see details below.";
    $(".message .error-summary").html(message);
    form.defaultShowErrors();
};

/*
 * This function will either add attribute role="alert" to specific element, or inject a specific message in the DOM
 * 
 * params:
 *      target_id: the id of the element, which will contain the alert message. If target_id is not null, the message param will be omitted
 *      message: if target_id is null or undefined, inject an invisible message after first H1 or BODY tag
 */
var a11y_alert = function (data) {
    console.log(data);
    // First action: Remove all other elements, which has role="alert" attribute
    $("[role='alert']").attr("role", null);
    
    if (data.target_id && data.target_id.trim() != "") {
        var target_el = $("#"+data.target_id);
        target_el.attr("role", "alert");
    } else if (data.message && data.message.trim() != "") {
        var message_html = "<span class='a11y-hide-visually' role='alert'>"+data.message+"</span>";
        // Best practice is to insert the message after the H1 element
        var h1 = $("h1");

        if (h1.length > 0) { //Inject HTML after the first H1
            h1.first().after(message_html);
        } else { //if H1 is not exist, inject the HTML code after open BODY tag
            var body = $("body");
            body.prepend(message_html);
        }
    }
    
    return false;
};

var scroll_to_form_top = function () {
    var top_offset = $(".header-container").height();
    var target_top = $('.warning').offset().top;

    target_top -= top_offset;
    if (target_top < 0) {
        target_top = 0;
    }

    $('html, body').stop().animate({ scrollTop: target_top }, 800);
    return false;
};
