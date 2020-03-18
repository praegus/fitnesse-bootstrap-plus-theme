function initErrorMetadata() {
    var errors = $(".alternating_block .fail, .alternating_block .error, .alternating_block .exception")
        .not(".scenario, .scenario>.fail, .scenario>.error, .exception .error");

    $("#error-nav-max").text(errors.length);

    function getCurrentErrorNavIndex() {
        return parseInt($("#error-nav-text").val());
    }

    function setCurrentErrorNavIndex(index) {
        $("#error-nav-text").val(index);
    }

    function incrementErrorNavIndex(offset) {
        var currentErrorNavIndex = getCurrentErrorNavIndex();
        currentErrorNavIndex += offset;
        if (isNaN(currentErrorNavIndex) || currentErrorNavIndex > errors.length) {
            currentErrorNavIndex = 1;
        } else if (currentErrorNavIndex < 1) {
            currentErrorNavIndex = errors.length;
        }
        setCurrentErrorNavIndex(currentErrorNavIndex);
        navigateToCurrentError();
    }

    function unfoldErrors(element) {
        $(element).parents('.scenario-detail').removeClass('closed-detail').prev().removeClass('closed');
        $(element).parents('.collapsible').removeClass('closed invisible');
        $(element).parents('tr.hidden').removeClass('hidden');
    }

    var highlight;

    function navigateToCurrentError() {
    var errors = $(".alternating_block .fail, .alternating_block .error, .alternating_block .exception")
            .not(".scenario, .scenario>.fail, .scenario>.error, .exception .error");

        var currentErrorNavIndex = getCurrentErrorNavIndex();

        if (highlight) {
            $(highlight).removeClass("selected-error");
        }

        highlight = errors[currentErrorNavIndex - 1];
        unfoldErrors(highlight);
        $(highlight).addClass("selected-error");
        highlight.scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
    }

    $("#error-nav-prev").click(function () {
        incrementErrorNavIndex(-1);
    });

    $("#error-nav-next").click(function () {
        incrementErrorNavIndex(1);
    });

    $("#error-nav-text").change(function () {
        incrementErrorNavIndex(0);
    });

    /**
     * Open scenario's and collapsed sections which contain failed or errorous tests
     */
    if (errors.length > 0) {
        unfoldErrors($('.fail,.error'));
        $("#error-nav").removeClass("hidden");
    }
}
