$(function () {
    $(".balance-widget").on("change", "select#teen-names-id", function () {
        // TODO: add ajax request here to update the balance of the selected teen
        alert('Add Ajax request here');
    });


    $("input#date-to-add-funds[data-a11y-datepicker]").a11yDatepicker();

    $("input#payment-date[data-a11y-datepicker]").a11yDatepicker({
        format: 'yyyy-mm-dd',
        language: 'fr'
    });
    
    // jQuery UI 1.11.4 datepicker, not accessible.  The product team is ok with this before we develop an accessible datepicker.
    
    $("input[data-datepicker]").datepicker({
        showOn: 'button',
        buttonText: '<span class="a11y-hide-visually">Select Date ...</span><i class="fa fa-calendar"></i>'
    });
    

    initialize();

    /*
    *   Example Form Controls page form validation
    */
    $('#kitchen-sink-form').validate({
        errorElement: "small",
        errorTextClass: "text",
        errorContainer: $(".warning"),
        errorLabelContainer: "#kitchen-sink-form-error-message-id", //remove this line and next line to have error message displayed inline
        wrapper: "li",
        showErrors: function (errorMap, errorList) {
            showErrorsSummary(this, errorMap, errorList);
            a11y_alert({ target_id: "kitchen-sink-form-error-message-id" });
            scroll_to_form_top();
        },
        rules: {
            first_name: {
                required: true
            },
            last_name: {
                required: true
            },
            phone_number: {
                required: true
            },
            use_for_texts: {
                required: true
            },
            email_address: {
                required: true
            },
            address_line_1: {
                required: true
            },
            city: {
                required: true
            },
            state_province: {
                required: true
            },
            postal_code: {
                required: true
            },
            gov_id_type: {
                required: true
            }
        },
        messages: {
            first_name: {
                required: 'Enter your first name'
            },
            last_name: {
                required: 'Enter your last name'
            },
            phone_number: {
                required: 'Enter your phone number'
            },
            use_for_texts: {
                required: 'Enter your phone number'
            },
            email_address: {
                required: 'Enter your email address'
            },
            address_line_1: {
                required: 'Enter your address'
            },
            city: {
                required: 'Enter your city'
            },
            state_province: {
                required: 'Select your state'
            },
            postal_code: {
                required: 'Enter your postal code'
            },
            gov_id_type: {
                required: 'Select your Government ID type'
            }
        },
        submitHandler: function (form) {
            form.submit();
            return false;
        }
    });

    /*
     * Get back to the Learn more section on click
     */
    $(".back-to-learn-more a").click(function () {
        var top_offset = $(".header-container").height();
        var learn_more_top = $('#learn-more-row').position().top;
        learn_more_top -= top_offset;
        $('html, body').stop().animate({ scrollTop: learn_more_top }, 800);
        $("#learn-more-focus").focus();
        return false;
    });
    
    /*
     * Move down to the correspondent feature section on click
     */
    $(".features-list a").click(function () {
        var top_offset = $(".header-container").height();
        var section_id = $(this).attr('href');
        var section_top = $(section_id).position().top - top_offset;
        $('html, body').stop().animate({ scrollTop: section_top }, 800);
        return false;
    });

    $("body").on("click", "a.disabled", function(){
        return false;
    });
    
    /*
     * Government ID toggler control
     */
    $('#id-type').change(function(){
        var selectedGovId = $(this).val();
        $('.gov-id-container').hide();
        $('#' + selectedGovId + '-container').show();
        return false;
    });    
    
    /*
     * This function is for Style Guide only. The purpose is to demo headers in different senario. eg. Logo left, logo right, signed-in, signed-out, and etc.
     */
    $("#program-name").on("keyup", function(){
        var program_name = $.trim($(this).val()); 
        if (program_name != "") {
            $(".header-card-program").html(program_name);
        }
    });
    
    $("input[name=brand-logo]").on("change", function(){
        var image_src = $(this).next().next("img").attr("src");
        $(".logo-wrapper img.header-logo").attr("src", image_src);
        $(".top-bar img.header-logo").attr("src", image_src);
    });
    
    $(".sg-source-code-toggle-button").on("click", function(){
        var src_code_container = $(this).parent().next(".sg-header-source-code-container");
        if (src_code_container.is(":visible")) {
            $(src_code_container).slideUp();
            $(this).find("i").toggleClass("fa-angle-down");
        } else {
            $(src_code_container).slideDown();
            $(this).find("i").toggleClass("fa-angle-down");
        }
    });
    
    $("#toggle-theme-button").on("click", function(){
        var current_theme_option = $('#select-theme option[selected="selected"]');
        var current_theme = (current_theme_option.val());
        var new_theme, new_theme_obj = null;
        
        if (current_theme === "default") {
            current_theme_option.attr("selected", null);
            new_theme = $('#select-theme option[value="direct-express"]');
            new_theme.attr("selected", "selected");
            new_theme_obj = { "cssUri": new_theme.attr('data-source'), "imageUri": new_theme.attr('data-image-uri') };
        } else {
            current_theme_option.attr("selected", null);
            new_theme = $('#select-theme option[value="default"]');
            new_theme.attr("selected", "selected");
            new_theme_obj = { "cssUri": new_theme.attr('data-source'), "imageUri": new_theme.attr('data-image-uri') };
        }
        change_theme(new_theme_obj);
    });
    
    $("#select-theme").on("change", function(){
        var new_theme = ($('#select-theme option:selected'));
        var new_theme_obj = { "cssUri": new_theme.attr('data-source'), "imageUri": new_theme.attr('data-image-uri') };

        change_theme(new_theme_obj);
    });

});

var initialize = function(){
	// Init all code highlighting
    Prism.highlightAll();

    addEventHandlers();
    //sgResizeHeader();
    resizeHeader();

    render_theme_selector();
};

var addEventHandlers = function(){
    validate_kitchen_sink_listner();
    no_click_tip_in_label();
};

var validate_kitchen_sink_listner = function(){

    /*
  $('#submit-kitchen-sink').click(function() { 
      if($("#kitchen-sink-form").valid() == true)
      {
        form.submit();
      }
      else
      {
        $("h1.sg-section-title").after("<div role='alert'>There were errors in the form, please correct them and submit the form again.</div>");
        $("#kitchen-sink-form").find(".error:first").focus();
      }
    });
    */
    $(window).resize(function () {
        resizeHeader();
    });
};

var no_click_tip_in_label = function(){
    $('label').click(function(event){
      if ($(event.target).hasClass('fa') || $(event.target).hasClass('has-tip') || $(event.target).is('a')){
          return false;
      }
    });
};

var change_theme = function (new_theme) {

    $("link#theme-css").attr('href', SitePath + new_theme.cssUri);
     
    // change images URL 
    $("img").each(function () {
        var src = $(this).attr("src");
        var index, image, new_image_src = null;
        if (src.indexOf("Theme") > -1) {
            index = src.lastIndexOf("/")+1;
            image = src.substr(index); 
            new_image_src = new_theme.imageUri + image;
            $(this).attr("src", new_image_src);
        }
    });   
};

var render_theme_selector = function () {
    var items = [];
    var selected_string = "";
    $.getJSON("../Scripts/json/themes.json", function (data) {
        $.each(data.themes, function (key, theme) {
            selected_string = ""
            if (key === "default") {
                selected_string = "selected='selected'";
            }
            items.push("<option value=" + theme.value + " data-source="+theme.cssUri+" data-image-uri=" + theme.imageUri +" "+selected_string+">"+theme.label+"</option>");
        });
        $(items.join("")).appendTo("select#select-theme");
    });
};

var random_str = function () {
    return (+new Date).toString(36);
}