$(function () {
    $(document).on('click', 'body', function (e) {
        if ($(e.target).not('span[role="tooltip"].tooltip').length > 0) {
            $('span[role="tooltip"].tooltip').css({ 'display': 'none' });
        }
    });
});