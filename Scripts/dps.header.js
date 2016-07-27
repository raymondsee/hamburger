var resizeHeader = function () {
    $(".header-row").each(function () {
        var header = $(this);

        // Adjust the height of the menu on mobile view header
        var mobile_logo = header.find(".top-bar img");
        var mobile_logo_src = mobile_logo.attr("src");

        if (mobile_logo_src.indexOf('?') > 1) {
            mobile_logo_src = mobile_logo_src.substr(0, mobile_logo_src.indexOf('?'));
        }

        var mobile_logo_new_src = mobile_logo_src + "?" + new Date().getTime();
        var mobile_logo = mobile_logo.attr("src", mobile_logo_new_src);
        var nav_height = null;
        var nav = header.find("nav.mobile-nav");
        $(mobile_logo).on("load", function () {
            nav_height = nav.find('>ul').height();
            nav.height(nav_height);
        });
    });
};