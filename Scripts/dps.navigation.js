$(function () {
    /*
     * Ally feature.  This method will allow user to navigate the menu using combination of tab, shift+tab, up, down, left, and right arrow keys.
     * Use tab, shift+tab to navigation forward and backward through the menu items.  Up and down arrow keys do the same thing as tabl and shift+tab.
     * Use left and right key to navigate through top level menu items.
     */
    $(".desktop-nav .top-bar-section").on("keydown", "ul", function (e) {
        var target = document.activeElement; //currently focus item
        var target_parent = $(target).parent();
        
        var is_in_submenu = $(target).closest("ul").hasClass("dropdown");
        var target_grand_parent = $(target_parent).parent();
        var submenu = $(target).next('ul');
        //e.preventDefault();
        if (!is_in_submenu) { // top nav
            submenu.css("display", "block");

            if (e.keyCode == 38 || (e.shiftKey && e.keyCode==9)) { //up arrow or shift+tab
                var prev_top_level_item = $(target_parent).prev("li"); 
                var prev_submenu = prev_top_level_item.find("ul.dropdown");
                prev_submenu.css("display", "block");
                var prev_item = prev_top_level_item.find("a:visible").last();
                if (prev_top_level_item.length==0) {
                    var tabables = $("input:visible,a:visible,textarea:visible,select:visible,button:visible");
                    var index = tabables.index($(target));
                    $(tabables[index-1]).focus();
                } else {
                    $(prev_item).focus();
                }
                submenu.attr("style", "");
                return false;
            } else if (e.keyCode == 40 || e.keyCode == 9) { //down arrow or tab
                var first_subitem = $(target).next('ul').find('li > a')[0];
                if (first_subitem===undefined) {
                    //focus move to the next focusable input or hyper link
                    var tabables = $("input:visible,a:visible,textarea:visible,select:visible,button:visible");
                    var index = tabables.index($(target));
                    tabables.eq(index+1).focus();
                } else {
                    $(first_subitem).focus();
                }
                return false;
            } else if (e.keyCode == 37) { //left arrow
                var prev_top_level_item = $(target_parent).prev("li").find("a:visible").first();
                var prev_submenu = prev_top_level_item.next("ul");
                submenu.attr("style", "");
                prev_top_level_item.focus();
                prev_submenu.show();
                return false;
            } else if (e.keyCode == 39) { //right arrow
                var next_top_level_item = $(target_parent).next("li").find("a:visible").first();
                var next_submenu = next_top_level_item.next("ul");
                submenu.attr("style", "");
                next_top_level_item.focus();
                next_submenu.show();
                return false;
            }
            //return false;
        } else { // sub nav
            if (e.keyCode == 38 || (e.shiftKey && e.keyCode==9)) { //up arrow or shift+tab
                var prev_li = $(target_parent).prev('li');
                var prev_item = prev_li.find('a');
                if (prev_li.hasClass('back') || prev_li.length ==0) { //move focus back to top level item
                    //prev_li.parent().prev('a').focus();
                    $(target_parent).parent().prev('a').focus();
                } else { //move to prev submenu item
                    $(prev_item).focus();
                }
                return false;
            } else if (e.keyCode == 40 || e.keyCode == 9) { //down arrow or tab
                
                var next_item = $(target_parent).next('li').find('a');
                if ($(next_item).length > 0) { //focus on next sub item
                    $(next_item).focus();
                } else { // focuse on next top level item
                    
                    var current_top_level_item = $(target_parent).closest("li.has-dropdown");
                    var current_submenu = $(target_parent).parent();
                    var next_top_level_item = $(current_top_level_item).next("li").find("> a");
                    current_submenu.attr("style", "");
                    if (next_top_level_item.length > 0) {
                        $(current_top_level_item).next("li").find("> a").focus();
                    } else {
                        var tabables = $("input:visible,a:visible,textarea:visible,select:visible,button:visible");
                        var index = tabables.index(current_top_level_item.find("a:visible").first());
                        tabables.eq(index+1).focus();
                    }
                }
                return false;
            } else if (e.keyCode == 37) { //left arrow
                var prev_top_level_item = $(target_parent).closest("li.has-dropdown").prev("li").find("a:visible").first();
                var prev_submenu = prev_top_level_item.next("ul");
                target_grand_parent.attr("style", "");
                prev_top_level_item.focus();
                prev_submenu.show();
                return false;
            } else if (e.keyCode == 39) { //right arrow
                var next_top_level_item = $(target_parent).closest("li.has-dropdown").next("li").find("a:visible").first();
                var next_submenu = next_top_level_item.next("ul");
                target_grand_parent.attr("style", "");
                next_top_level_item.focus();
                next_submenu.show();
                return false;
            }
            //return false;
        }
    });
    
    /*
     * Prevent more than one submenu expanding at the same time
     */
    $(".top-bar-section").on("mouseover", "> ul > li > a", function (e) {

        // hide all previously opened submenu first
        $(".top-bar-section ul.dropdown").not($(this).next("ul.dropdown")).each(function () {
            if ($(this).is(":visible")) {
                $(this).attr("style", "");
            }
        });
        //$(this).focus();
        return false;
    });
});