$(function() {
    /*
     * Close messaging box
     */
    $(".message").on("click", ".close", function(){
        $(this).parent(".message").fadeOut(300);
        return false;
    });
});