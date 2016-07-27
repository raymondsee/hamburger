/**
*   This date picker is created and build base on 2 open source date pickers:
*       1) Open Ajax Alliance http://oaa-accessibility.org/example/15/
*       2) http://www.websemantics.co.uk/tutorials/accessible_date_picker_calendar/
*   Credit:
*       Mike Foskett, Francisco Charrua, Raymond See
*
**/

(function ($) {
    $.fn.datepicker2 = function (options) {
        var datepickers = $(this); //mutli

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            showButton: true,
            format: 'mm/dd/yy',
            language: 'en'
        }, options);

        datepickers.each(function () {
            var inputTextId = $(this).attr("id");
            var randomId = randomStr();

            if (inputTextId === undefined) {

                inputTextId = "input-" + randomId;
                $(this).attr("id", inputTextId);
            }
            var calendarId = "calendar-" + randomId;

            var buttonId = 'button-' + randomId;
            var buttonTemplate = '<button id="' + buttonId + '" class="button calendar"><span class="a11y-hide-visually">Launch a Date Picker</span><i class="fa fa-calendar"></i></button> ';
            var buttonMarkup = '';

            if (settings.showButton) {
                buttonMarkup = buttonTemplate;
            }
            buttonMarkup = buttonTemplate;
            // inject additional widget
            $(buttonMarkup +
                '<div id="' + calendarId + '" class="datepicker" aria-hidden="true" aria-labelledby="datepicker-instruction">JavaScript need to be enabled</div>').insertAfter($(this));


            var dp = null;        
            dp = new Datepicker(calendarId, inputTextId, buttonId, true, settings);

        });
        

        // Greenify the collection based on the settings variable.
        return this;

    };

}(jQuery));


function Datepicker(id, target, buttonId, modal, settings) {
    this.$id = $('#' + id); // element to attach widget to
    this.settings = settings;

    this.isIE = (navigator.userAgent.indexOf('MSIE') >= 0) ? true : false; //detect if browser type is MSIE?
    
    //Define all the languages display on calendar 
    this.defineLanguage();

    this.popGrid();
    this.$prev = this.$id.find('.prev-month');
    this.$next = this.$id.find('.next-month');
    this.$grid = this.$id.find('.calendar');
    this.$target = $('#' + target); // div or text box that will receive the selected date string and focus (if modal)

    this.$calendarButton = $('button#' + buttonId);

    this.dateObj = new Date();

    this.curYear = this.dateObj.getFullYear();
    this.year = this.curYear;

    this.curMonth = this.dateObj.getMonth();
    this.month = this.curMonth;
    this.currentDate = true;

    this.date = this.dateObj.getDate();

    this.keys = {
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40
    };

    //trap tab action
    this.$id.trap();

    this.bindHandlers();
}


//
// popGrid() is a member function to populate the datepicker grid with calendar days
// representing the current month
//
// @return N/A
//
Datepicker.prototype.popGrid = function () {
    var weekday = 0;
    var curDay = 1;
    var rowCount = 1;

    // clear the grid
    this.$id.empty();

    if (!this.month && !this.year) {
        var date = new Date();
        day = date.getDate();
        month = date.getMonth();
        year = date.getFullYear();
    } else {
        //day = 1;
        month = this.month;
        year = this.year;
    }

    var this_month = new Date(year, month, 1);
    var next_month = new Date(year, month + 1, 1);
    var navInstruction = this.navInstruction.replace('[month-year]', this.months[month] + ' ' + year);

    //Find out when this month starts and ends.
    first_week_day = this_month.getDay()
    days_in_this_month = Math.floor((next_month.getTime() - this_month.getTime()) / (1000 * 60 * 60 * 24));
    if (month == 2) days_in_this_month = 31;


    calendar_html = '<table class="calendar" align="center" summary="select a date">'
    calendar_html += '<thead>'
    calendar_html += '<tr class="days">' +
        '<th scope="col" class="weekend">' + this.dateOfWeekShort[0] + '</th>' +
        '<th scope="col">' + this.dateOfWeekShort[1] + '</th>' +
        '<th scope="col">' + this.dateOfWeekShort[2] + '</th>' +
        '<th scope="col">' + this.dateOfWeekShort[3] + '</th>' +
        '<th scope="col">' + this.dateOfWeekShort[4] + '</th>' +
        '<th scope="col">' + this.dateOfWeekShort[5] + '</th>' +
        '<th scope="col" class="weekend">' + this.dateOfWeekShort[6] + '</th></tr>'
    calendar_html += '</thead>'
    calendar_html += '<tbody>'
    calendar_html += '<tr>'

    calendar_nav_html = '<div class="month-wrap">' +
         '<span class="a11y-hide-visually" id="datepicker-instruction">' + navInstruction + '</span>' +
         '<div class="bn_prev"><a href="#" class="prev-month" tabindex="0" title="Previous month: ' + this.months[(month == 0) ? 11 : month - 1] + '"><span class="a11y-hide-visually">' + this.prevMonthText + this.months[(month == 0) ? 11 : month - 1] + '</span><i class="fa fa-arrow-circle-left"></i></a></div>' +
         '<div class="month" role="heading" aria-live="assertive" aria-atomic="true">' + this.months[month] + ' ' + year + '</div>' +
         '<div class="bn_next"><a href="#" class="next-month" tabindex="0" title="Next month: ' + this.months[(month == 11) ? 0 : month + 1] + '"><span class="a11y-hide-visually">' + this.nextMonthText + this.months[(month == 11) ? 0 : month + 1] + '</span><i class="fa fa-arrow-circle-right"></i></a></div>' +
         '</div>';
    calendar_html = calendar_nav_html + calendar_html;

    for (week_day = 0; week_day < first_week_day; week_day++) {
        calendar_html += ((week_day == 0) || (week_day == 6)) ? '<td class="weekend">&nbsp;</td>' : '<td>&nbsp;</td>';
    }

    week_day = first_week_day
    mm = this.addlead0(next_month.getMonth())
    mm = (mm == 0) ? 12 : mm

    for (day_counter = 1; day_counter <= days_in_this_month; day_counter++) {
        week_day %= 7
        if (week_day == 0) {
            calendar_html += '</tr><tr>';
        }
        calendar_html += '<td';
        if (day == day_counter) {
            calendar_html += ' class="current"';
        }

        if (this.isIE) {
            calendar_html += '><a role="button" data-value="' + this.addlead0(day_counter) + '" title="' + this.getFullDate(day_counter, mm, year) + '" tabindex="0"><span class="a11y-hide-visually">' + this.getDay(day_counter, mm, year) + ' ' + this.months[month] + '</span>  ' + day_counter + '  <span class="a11y-hide-visually">,' + year + '</span></a></td>';
        } else {
            calendar_html += '><a role="button" data-value="' + this.addlead0(day_counter) + '" tabindex="0"><span class="a11y-hide-visually">' + this.months[month] + '</span>  ' + day_counter + '  <span class="a11y-hide-visually">,' + year + '</span></a></td>';
        }
        week_day++
    }

    for (week_day = week_day; week_day < 7; week_day++) {
        calendar_html += ((week_day == 0) || (week_day == 6)) ? '<td class="weekend">&nbsp;</td>' : '<td>&nbsp;</td>';
    }

    calendar_html += '</tr>';
    calendar_html += '</tbody>';
    calendar_html += '</table>';

    this.$id.append(calendar_html);
}

//
// bindHandlers() is a member function to bind event handlers for the widget
//
// @return N/A
//
Datepicker.prototype.bindHandlers = function () {

    var thisObj = this;

    thisObj.$calendarButton.on('click', function (e) {
        //hide all other openned datepickers on the screen
        $('.datepicker:visible').attr('aria-hidden', 'true');
        thisObj.showDlg();

        e.stopPropagation();
        return false;
    });

    thisObj.$id.on('click', '.prev-month', function (e) {
        return thisObj.handlePrevClick(e);
    });

    thisObj.$id.on('click', '.next-month', function (e) {
        return thisObj.handleNextClick(e);
    });

    thisObj.$id.on('keydown', '.prev-month', function (e) {
        return thisObj.handlePrevKeyDown(e);
    });

    thisObj.$id.on('keydown', '.next-month', function (e) {
        return thisObj.handleNextKeyDown(e);
    });

    thisObj.$id.on('keydown', 'tbody td a, .month-wrap a', function (e) {
        return thisObj.handleGridKeyDown(e);
    });

    thisObj.$id.on('keypress', 'tbody td a', function (e) {
        return thisObj.handleGridKeyPress(e);
    });

    thisObj.$id.on('click', 'tbody td a', function (e) {
        return thisObj.handleGridClick(e);
    });

    // Visa
    thisObj.$id.on('keydown', function (e) {
        return thisObj.handleGridKeyDown(e);
    });

    $(document).on("click", function (e) {
        if (!$(e.target).closest('.datepicker').length) {
            if ($('.datepicker').is(":visible")) {
                $(this).trigger("document.click");
            }
        }
    });

} // end bindHandlers();

//
// handlePrevClick() is a member function to process click events for the prev month button
//
// @input (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
Datepicker.prototype.handlePrevClick = function (e) {

    var active = this.$grid.attr('aria-activedescendant');

    if (e.ctrlKey) {
        this.showPrevYear();
    }
    else {
        this.showPrevMonth();
    }

    if (this.currentDate == false) {
        this.$grid.attr('aria-activedescendant', 'day1');
    }
    else {
        this.$grid.attr('aria-activedescendant', active);
    }

    this.focusPrev(); //visa
    e.stopPropagation();
    return false;

} // end handlePrevClick()

//
// handleNextClick() is a member function to process click events for the next month button
//
// @input (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
Datepicker.prototype.handleNextClick = function (e) {

    var active = this.$grid.attr('aria-activedescendant');

    if (e.ctrlKey) {
        this.showNextYear();
    }
    else {
        this.showNextMonth();
    }

    if (this.currentDate == false) {
        this.$grid.attr('aria-activedescendant', 'day1');
    }
    else {
        this.$grid.attr('aria-activedescendant', active);
    }

    this.focusNext(); //visa

    e.stopPropagation();
    return false;

} // end handleNextClick()

//
// handlePrevKeyDown() is a member function to process keydown events for the prev month button
//
// @input (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
Datepicker.prototype.handlePrevKeyDown = function (e) {

    if (e.altKey) {
        return true;
    }

    switch (e.keyCode) {
        case this.keys.tab: {
            if (this.bModal == false || !e.shiftKey || e.ctrlKey) {
                return true;
            }

            this.$grid.focus();
            e.stopPropagation();
            return false;
        }
        case this.keys.enter:
        case this.keys.space: {
            if (e.shiftKey) {
                return true;
            }

            if (e.ctrlKey) {
                this.showPrevYear();
            }
            else {
                this.showPrevMonth();

                this.focusPrev(); //visa
            }

            e.stopPropagation();
            return false;
        }
    }

    return true;

} // end handlePrevKeyDown()

//
// showPrevMonth() is a member function to show the previous month
//
// @param (offset int) offset may be used to specify an offset for setting
//                      focus on a day the specified number of days from
//                      the end of the month.
// @return N/A
//
Datepicker.prototype.showPrevMonth = function (offset) {
    // show the previous month
    if (this.month == 0) {
        this.month = 11;
        this.year--;
    }
    else {
        this.month--;
    }

    if (this.month != this.curMonth || this.year != this.curYear) {
        this.currentDate = false;
    }
    else {
        this.currentDate = true;
    }

    // populate the calendar grid
    this.popGrid();

    // if offset was specified, set focus on the last day - specified offset
    if (offset != null) {
        var numDays = this.calcNumDays(this.year, this.month);
        var day = 'day' + (numDays - offset);

        this.$grid.attr('aria-activedescendant', day);
        $('#' + day).addClass('focus').attr('aria-selected', 'true');
    }

} // end showPrevMonth()

//
// handleNextKeyDown() is a member function to process keydown events for the next month button
//
// @input (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
Datepicker.prototype.handleNextKeyDown = function (e) {

    if (e.altKey) {
        return true;
    }

    switch (e.keyCode) {
        case this.keys.enter:
        case this.keys.space: {

            if (e.ctrlKey) {
                this.showNextYear();
            }
            else {
                this.showNextMonth();
            }

            
            this.focusNext(); //visa

            e.stopPropagation();
            return false;
        }
    }

    return true;

} // end handleNextKeyDown()

//
// showNextMonth() is a member function to show the next month
//
// @param (offset int) offset may be used to specify an offset for setting
//                      focus on a day the specified number of days from
//                      the beginning of the month.
// @return N/A
//
Datepicker.prototype.showNextMonth = function (offset) {
    // show the next month
    if (this.month == 11) {
        this.month = 0;
        this.year++;
    }
    else {
        this.month++;
    }

    if (this.month != this.curMonth || this.year != this.curYear) {
        this.currentDate = false;
    }
    else {
        this.currentDate = true;
    }

    // populate the calendar grid
    this.popGrid();

    // if offset was specified, set focus on the first day + specified offset
    if (offset != null) {
        var day = 'day' + offset;

        this.$grid.attr('aria-activedescendant', day);
        $('#' + day).addClass('focus').attr('aria-selected', 'true');
    }

} // end showNextMonth()

//
// handleGridKeyDown() is a member function to process keydown events for the datepicker grid
//
// @input (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
Datepicker.prototype.handleGridKeyDown = function (e) {

    var $rows = this.$grid.find('tbody tr');
    var $curDayLink = $(e.target);
    var curDay = $curDayLink.attr('data-value');
    //var $days = this.$grid.find('td a');
    var $focusableElements = this.$id.find('a');

    //if (e.altKey) {
        //return true;
    //}

    switch (e.keyCode) {
        
        case this.keys.tab: {
            if (e.shiftKey) {
                var prevElementIndex = $focusableElements.index($curDayLink) - 1;
                var $prevElement = $focusableElements.eq(prevElementIndex);
                $prevElement.focus();
                e.stopPropagation();
                return false;
            }
            break;
        }
        
        case this.keys.enter:
        case this.keys.space: {
            if (e.ctrlKey) {
                return true;
            }

            // update the target box
            //this.$target.val((this.month < 9 ? '0' : '') + (this.month + 1) + '/' + curDay + '/' + this.year);
            this.populateDate(new Date((this.month < 9 ? '0' : '') + (this.month + 1) + '/' + curDay + '/' + this.year));

            //console.log($(e.target).parent('td').addClass('selected'));
            //highlight the selected day

            this.$id.find('td.selected').removeClass('selected');
            $curDayLink.parent('td').addClass('selected');
            this.$grid.attr('aria-selected', 'false');
            this.$grid.find('td a').attr('aria-selected', 'false');
            $curDayLink.attr('aria-selected', 'true');

            // fall through
        }
        case this.keys.esc: {
            // dismiss the dialog box
            this.hideDlg();

            e.stopPropagation();
            return false;
        }
        // key left event works on keyboard user but not JAWS user
        case this.keys.left: {
            this.showPrevMonth();
            this.focusPrev();
            e.stopPropagation();
            return false;
        }
        // key right event works on keyboard user but not JAWS user
        case this.keys.right: {
            this.showNextMonth(1);
            this.focusNext();
            e.stopPropagation();
            return false;
        }
        // key up event works on keyboard user but not JAWS user
        case this.keys.up: {
            var prevElementIndex = $focusableElements.index($curDayLink) - 1;
            var $prevElement = $focusableElements.eq(prevElementIndex);
            $prevElement.focus();
            e.stopPropagation();
            return false;
        }
        // key down event works on keyboard user but not JAWS user
        case this.keys.down: {
            console.log($focusableElements.length);
            var nextElementIndex = $focusableElements.index($curDayLink) + 1;
            if (nextElementIndex >= $focusableElements.length) {
                nextElementIndex = 0;
            }
            var $nextElement = $focusableElements.eq(nextElementIndex);
            $nextElement.focus();
            e.stopPropagation();
            return false;
        }
            
        case this.keys.pageup: {
            if (e.altKey) {
                this.showPrevMonth();
                this.focusPrev();
                e.stopPropagation();
                return false;
            }
        }
        case this.keys.pagedown: {
            if (e.altKey) {
                this.showNextMonth();
                this.focusNext();
                e.stopPropagation();
                return false;
            }
        }
            /*
        case this.keys.home: {

            if (e.ctrlKey || e.shiftKey) {
                return true;
            }

            $curDay.removeClass('focus').attr('aria-selected', 'false');

            $('#day1').addClass('focus').attr('aria-selected', 'true');

            this.$grid.attr('aria-activedescendant', 'day1');

            e.stopPropagation();
            return false;
        }
        case this.keys.end: {

            if (e.ctrlKey || e.shiftKey) {
                return true;
            }

            var lastDay = 'day' + this.calcNumDays(this.year, this.month);

            $curDay.removeClass('focus').attr('aria-selected', 'false');

            $('#' + lastDay).addClass('focus').attr('aria-selected', 'true');

            this.$grid.attr('aria-activedescendant', lastDay);

            e.stopPropagation();
            return false;
        }
        */
    }

    return true;

} // end handleGridKeyDown()

//
// handleGridClick() is a member function to process mouse click events for the datepicker grid
//
// @input (id obj) e is the id of the object triggering the event
//
// @input (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
Datepicker.prototype.handleGridClick = function (e) {
    var $cell = $(e.target);

    // Work around for a bug on IE9 and IE10 while JAWS is activated. VERY STRANG bug
    // the even target is not the focused ANCHOR tag but the child SPAN tag
    if ($cell.prop('tagName').toLowerCase() == 'span') {
        $cell = $cell.parent('a');
    }
    this.$id.find('td.selected').removeClass('selected');
    $cell.parent('td').addClass('selected');

    var curDay = $cell.attr('data-value'); 
    this.$grid.attr('aria-selected', 'false');

    this.$grid.find('td a').attr('aria-selected', 'false')
    $cell.attr('aria-selected', 'true');
    // update the target box
    //this.$target.val((this.month < 9 ? '0' : '') + (this.month + 1) + '/' + curDay + '/' + this.year);
    this.populateDate(new Date((this.month < 9 ? '0' : '') + (this.month + 1) + '/' + curDay + '/' + this.year));
    // dismiss the dialog box
    this.hideDlg();

    e.stopPropagation();
    return false;

} // end handleGridClick()

//
// handleGridKeyPress() is a member function to consume keypress events for browsers that
// use keypress to scroll the screen and manipulate tabs
//
// @input (e obj) e is the event object associated with the event
//
// @return (boolean) false if consuming event, true if propagating
//
Datepicker.prototype.handleGridKeyPress = function (e) {
    if (e.altKey) {
        return true;
    }

    switch (e.keyCode) {
        case this.keys.tab:
        case this.keys.enter:
        case this.keys.space:
        case this.keys.esc:
        case this.keys.left:
        case this.keys.right:
        case this.keys.up:
        case this.keys.down:
        case this.keys.pageup:
        case this.keys.pagedown:
        case this.keys.home:
        case this.keys.end: {
            e.stopPropagation();
            return false;
        }
    }

    return true;

} // end handleGridKeyPress()


//
// hideDlg() is a member function to hide the datepicker and remove focus. This function is only called if
// the datepicker is used in modal dialog mode.
//
// @return N/A
//
Datepicker.prototype.hideDlg = function () {

    var thisObj = this;

    // unbind the modal event sinks
    //$(document).unbind('click mousedown mouseup mousemove mouseover');
    //visa
    $(document).unbind('document.click mousedown mouseup mousemove mouseover');

    // hide the dialog
    this.$id.attr('aria-hidden', 'true');

    // set focus on the focus target
    this.$target.focus();

} // end hideDlg()

//
// showDlg() is a member function to show the datepicker and give it focus. This function is only called if
// the datepicker is used in modal dialog mode.
//
// @return N/A
//
Datepicker.prototype.showDlg = function () {

    var thisObj = this;

    // Bind an event listener to the document to capture all mouse events to make dialog modal
    $(document).bind('click mousedown mouseup mousemove mouseover', function (e) {

        //ensure focus remains on the dialog
        thisObj.$grid.focus();

        // Consume all mouse events and do nothing
        //e.stopPropagation;
        //return false;
    });

    $(document).bind("document.click", function (e) {
        thisObj.hideDlg();
    });

    // show the dialog
    this.$id.attr('aria-hidden', 'false');

    //this.$grid.focus();
    this.focusCurrentDate();

} // end showDlg()

Datepicker.prototype.focusNext = function () {
    this.$id.find('.next-month').focus();
}

Datepicker.prototype.focusPrev = function () {
    this.$id.find('.prev-month').focus();
}

Datepicker.prototype.focusCurrentDate = function () {
    var selectedDate = this.$grid.find('td.selected a');

    if (selectedDate.length > 0) {
        selectedDate.focus();
    } else {
        this.$grid.find('td.current a').focus();
    }
}

Datepicker.prototype.populateDate = function (d) {
    var dateString = d.format(this.settings.format);
    this.$target.val(dateString);
    //console.log(dateString);
}

Datepicker.prototype.defineLanguage = function () {
    this.monthsObj = {
        en: {
            long: new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
            short: new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')
        },
        fr: {
            long: new Array('janvier', 'février', 'mars', 'avril', 'peut', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'),
            short: new Array('janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.')
        },
        es: {
            long: new Array('enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'),
            short: new Array('enero', 'feb.', 'marzo', 'abr.', 'mayo', 'jun.', 'jul.', 'agosto', 'sept.', 'oct.', 'nov.', 'dic.')
        }
    };

    this.dateOfWeekObj = {
        en: {
            long: new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
            short: new Array('S<span class="a11y-hide-visually">unday</span>',
                'M<span class="a11y-hide-visually">onday</span>',
                'T<span class="a11y-hide-visually">uesday</span>',
                'W<span class="a11y-hide-visually">ednesday</span>',
                'T<span class="a11y-hide-visually">hursday</span>',
                'F<span class="a11y-hide-visually">riday</span>',
                'S<span class="a11y-hide-visually">aturday</span>')
        },
        fr: {
            long: new Array('dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'),
            short: new Array('d<span class="a11y-hide-visually">imanche</span>',
                'l<span class="a11y-hide-visually">undi</span>',
                'm<span class="a11y-hide-visually">ardi</span>',
                'm<span class="a11y-hide-visually">ercredi</span>',
                'j<span class="a11y-hide-visually">eudi</span>',
                'v<span class="a11y-hide-visually">endredi</span>',
                's<span class="a11y-hide-visually">amedi</span>')
        },
        es: {
            long: new Array('domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'),
            short: new Array('d<span class="a11y-hide-visually">omingo</span>',
                'l<span class="a11y-hide-visually">unes</span>',
                'm<span class="a11y-hide-visually">artes</span>',
                'm<span class="a11y-hide-visually">iércoles</span>',
                'j<span class="a11y-hide-visually">ueves</span>',
                'v<span class="a11y-hide-visually">iernes</span>',
                's<span class="a11y-hide-visually">ábado</span>')
        }
    };
    this.instructionObj = {
        en: {
            nextMonth: 'Go to next month: ',
            prevMonth: 'Go to previous month: ',
            navigation: 'A date picker calendar is openned, use tab key or shift tab key to navigate. [month-year] is currently displayed.'
        },
        fr: {
            nextMonth: 'aller le mois prochain: ',
            prevMonth: 'aller à mois précédent: ',
            navigation: "Un calendrier du sélecteur de date est openned, touche de tabulation de l'utilisation ou la touche de tabulation de déplacement pour naviguer. [month-year] est actuellement affiché."
        },
        es: {
            nextMonth: 'ir al siguiente mes: ',
            prevMonth: 'ir al mes anterior: ',
            navigation: 'Un calendario selector de fecha se openned, utilice la tecla de tabulación o tabulador desplazamiento para navegar. [month-year] se muestra actualmente.'
        }
    };

    this.months = this.monthsObj[this.settings.language].long;
    this.daysofweek = this.dateOfWeekObj[this.settings.language].long;
    this.dateOfWeekShort = this.dateOfWeekObj[this.settings.language].short;
    this.nextMonthText = this.instructionObj[this.settings.language].nextMonth;
    this.prevMonthText = this.instructionObj[this.settings.language].prevMonth;
    this.navInstruction = this.instructionObj[this.settings.language].navigation;
}

Datepicker.prototype.getFullDate = function (d, m, y) {  // m = 1-12 not 0-11.
    t_date = new Date(y, m - 1, d);
    return (this.daysofweek[t_date.getDay()] + ", " + this.months[t_date.getMonth()] + " " + t_date.getDate() + " " + t_date.getFullYear());
} // returns date: "Saturday, September 3 2005"

Datepicker.prototype.getDay = function (d, m, y) {  // m = 1-12 not 0-11.
    t_date = new Date(y, m - 1, d);
    return (this.daysofweek[t_date.getDay()]);
} // returns date: "Saturday"

Datepicker.prototype.addlead0 = function (x) {
    return ((x < 10) ? "0" + x : x);
}

function randomStr () {
    return (+new Date).toString(36);
}