$(function () {
    

    /*
     * Close modal button
     */
    $('.button-close-modal').on("click", function (e) {
        $('.close-reveal-modal').trigger('click');
    });
    
    /*
     * On Enter key press while foucs on Close X button, close modal
     */
    $(".close-reveal-modal").on("keydown", function(e){
        if (e.keyCode == 13) { //Enter key got pressed
            $(e.target).trigger('click');
        }
    });


    /*
     * Adjust modal height
     */

    $('[data-reveal-id]').click(function(e) {
        //e.preventDefault();
        var modal_id = '#' + $(this).attr('data-reveal-id');

        // cache the trigger element ID, so that on modal close event, it will
        // restore fucus to the triggering element
        var trigger_elm_id = $(e.target).attr('id');
        if (trigger_elm_id !== undefined) {
            $(modal_id).attr('data-trigger-elm-id', trigger_elm_id);
        }

        $(document).foundation({
            reveal: {
                animation: 'fade',
                animation_speed: 200,
                close_on_background_click: false,
                css: {
                    open: {
                        'opacity': 0,
                        'visibility': 'visible',
                        'display': 'block'
                    },
                    close: {
                        'opacity': 1,
                        'visibility': 'hidden',
                        'display': 'none'
                    }
                }
            }
        });

        $(modal_id).foundation('reveal', "open");
        
        return false;
    });
    
    /*
    * On modal open event:
    * Get the first focusable element focused
    */
    $(document).on('opened.fndtn.reveal', '[data-reveal]', function (event) {
        var modal = $(this);
        var scrollable = modal.find('.scrollable');
        var title = modal.find('h2');
        var first_focusable = scrollable.find("input,button,select,textarea").filter(":visible").first();

        if (first_focusable.length > 0) {
            first_focusable.focus();
        } else if (title.attr('tabindex') !== undefined) {
            title.focus();
        } else {
            modal.find("input,button").filter(":visible").first().focus();
        }

        // adjust the height of scrollable area
        var window_height = $(window).height();
        var default_modal_top = 100;
        var offset = 220; // magic number
        var modal_body_height = 400; // default value
        var scrollable_height = 200; // default value

        if (window_height < 800) {
            modal_body_height = modal.height();
            scrollable_height = scrollable.height();

            scrollable_height = scrollable_height - (modal_body_height + 12 + default_modal_top - window_height); // 12 is the border spacing

            //Make sure the content height is still visiable
            if (scrollable_height < 100) {
                scrollable_height = 100;
            }
            scrollable.css({ 'max-height': scrollable_height + 'px' });
        }
        
        /*
         * Prevent modal element lose focus if user click outside of the modal window
         */
        $(document).on("mousedown.modal", function(e){
            var current_focused_el = modal.find(":focus");
            if ($(e.target).hasClass("reveal-modal-bg")) {
                current_focused_el.focus();
                
                return false;
            }
        });
    });
    
    

    /*
     * clear the scrollable area max-height, and focus on triggering element on close
     */
    $(document).on('closed', '[data-reveal]', function () {
        var modal = $(this);
        var modal_id = modal.attr("id");
        var triggering_el = $("[data-reveal-id=" + modal_id + "]");

        if (triggering_el.length > 1) {
            triggering_el_id = modal.attr('data-trigger-elm-id');
            if (triggering_el_id !== undefined) {
                triggering_el = $('#' + triggering_el_id);
            }
        }
        
        modal.find('.scrollable').css('max-height', '');
        triggering_el.focus();
        
        // remove mousedown event when modal is up
        $(document).off("mousedown.modal");
    });
    
    /*
     * trap focus inside the modal
     */
    $(".reveal-modal").trap();

});