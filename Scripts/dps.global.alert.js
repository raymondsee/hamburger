/**
* Util to manage global alert modal
*
*/
function GlobalAlert(options) {
    this.settings = $.extend({
        showAllAlerts: false
    }, options);


    this.init = function ($this) {
        var modals = $(".reveal-modal[data-global-alert-id]");
        var alerts = [];

        if (modals.length > 0) {
            for (var i = 0; i < modals.length; i++) {
                // filter out all the do not show again modal(s)
                if ($this.showAlert($(modals[i]).attr("data-global-alert-id"))) {
                    alerts.push(modals[i]);
                }
            }
            $this.openModal(alerts);
        }

        return $this;
    }


    this.openModal = function (modals) {
        $this = this;

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

        $.each(modals, function (index, modal) {
            var buttonElm = $(modal).find("button.global-alert-button");
            var checkboxHideForever = $(modal).find(".global-alert-dont-show-checkbox");
            var closeButton = $(modal).find("button.close-reveal-modal");
            
            buttonElm.on("click", function () {
                if (checkboxHideForever.is(":checked")) {
                    var cookieId = $(modal).attr("data-global-alert-id");
                    $this.hideForever(cookieId);
                }
                closeButton.trigger("click");
            });

            closeButton.on("click", function () {
                if ($this.settings.showAllAlerts) {
                    // set timeout so the modal backdrop has time to react to the close modal action
                    setTimeout(function () {
                        var nextModalId = $(modals[index + 1]).attr("data-global-alert-id");
                        if (nextModalId !== undefined) {
                            $this.openNextAlert(modals, index);
                        }
                    }, 800);
                }
            });
        });
        $this.openNextAlert(modals);

        return;
    }

    this.openNextAlert = function (alerts, currentIndex) {
        if (currentIndex === undefined) {
            for (var i = 0; i < alerts.length; i++) {
                var id = $(alerts[i]).attr("data-global-alert-id");
                if ($.cookie(id) === undefined) {
                    $(alerts[i]).foundation('reveal', 'open');
                    break;
                }
            }
        } else {
            currentIndex += 1;
            var nextModalId = $(alerts[currentIndex]).attr("id");
            var id = $("#" + nextModalId).attr("data-global-alert-id");

            while (nextModalId && id) {
                if ($.cookie(id) === undefined) {
                    $("#" + nextModalId).foundation('reveal', 'open');
                    break;
                } else {
                    currentIndex += 1;
                    nextModalId = $(alerts[currentIndex]).attr("id");
                    id = $("#" + nextModalId).attr("data-global-alert-id");
                }
            }

        }

        return;
    }

    this.hideForever = function (id) {
        return $.cookie(id, 'hide_alert_forever');
    };

    this.showAlert = function (id) {
        return ($.cookie(id) === undefined);
    };

    this.init(this);
}