$(function() {

    /**
     * Expando Collapso
     * Toggles (show/hide) target container content.
     *
     * Trigger Example
     * @attribute {array} data-targets - The ids (comma separated list) of target containers to toggle
     * <button class="expando-collapso" data-targets="mti-1397480634440, mts-1397480634440">
     *   <i class="fa fa-caret-right"></i>Open
     * </button>
     *
     * Target Example
     * <div id="mti-1397480634440">...</div>
     * <div id="mts-1397480634440">...</div>
     */
    $(".expando-collapso").on("click", function() {
        var targets = $(this).attr("data-targets").replace(/ /g, '').split(","),
            buttonText = $(this).text(),
            toggleText = null,
            ariaLiveMessage = null;

        if(buttonText.indexOf("Expand") !== -1) {
            ariaLiveMessage = "Section Expanded.";
            toggleText = buttonText.replace("Expand", "Collapse");
            $(this).html('<i class="fa fa-caret-down"></i><span class="a11y-hide-visually">'+toggleText+'</span>');
        } else {
            ariaLiveMessage = "Section Collapsed.";
            toggleText = buttonText.replace("Collapse", "Expand");
            $(this).html('<i class="fa fa-caret-right"></i><span class="a11y-hide-visually">'+toggleText+'</span>');
        }

        $.each(targets, function(index, targetId) {
            $("#" + targetId).slideToggle("fast", function(){
                a11y_aria_live({message: ariaLiveMessage});
            });
        });
    });

});

var a11y_aria_live = function(data){
    // First action: Remove all other elements, which has role="status" attribute
    $("[role='status']").remove();
    
    var message_html = "<span class='a11y-hide-visually' role='status' aria-live='assertive'>"+data.message+"</span>";
    // Best practice is to insert the message after the H1 element
    var h1 = $("h1");

    if (h1.length > 0) { //Inject HTML after the first H1
        h1.first().after(message_html);
    } else { //if H1 is not exist, inject the HTML code after open BODY tag
        var body = $("body");
        body.prepend(message_html);
    }
    
    return false;
};