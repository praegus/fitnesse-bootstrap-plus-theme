// Needed for Jest
try {
    module.exports = {
        // Sidebar.test
        getSidebarContentHtml: getSidebarContentHtml,
        getMainWorkSpace: getMainWorkSpace,
        placeSidebarContent: placeSidebarContent,
        toggleIconClickEvent: toggleIconClickEvent,
        collapseSidebarIcons: collapseSidebarIcons,
        expandSidebarIcons: expandSidebarIcons,
        // Tooltip.test
        displayToolTip: displayToolTip,
        // Tags.test
        postTagRequest: postTagRequest,
        createTagInput: createTagInput,
        GetCurrentTagList: GetCurrentTagList,
        checkIfNewTagIsValid: checkIfNewTagIsValid,
        postTagInHtml: postTagInHtml,
        inputBorderStyling: inputBorderStyling,
        deleteClickAndHoverEvent: deleteClickAndHoverEvent,
        joinTagList: joinTagList,
        deleteTag: deleteTag,
        // TestHistoryChecker.test
        generateTestHistoryTable: generateTestHistoryTable,
        getPageHistory: getPageHistory,
        // Versioncheck.test
        versionCheck:versionCheck


    };
} catch (e) {
}

/**
 * @return {string}
 */
String.prototype.UcFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * [Gets the cookie value if the cookie key exists in the right format]
 * @param  {[string]} name [name of the cookie]
 * @return {Object|string}      [value of the cookie]
 */
var getCookie = function (name) {
    return parseCookies()[name] || '';
};

/**
 * [Parsing the cookieString and returning an object of the available cookies]
 * @return {[object]} [map of the available objects]
 */
var parseCookies = function () {
    var cookieData = (typeof document.cookie === 'string' ? document.cookie : '').trim();

    return (cookieData ? cookieData.split(';') : []).reduce(function (cookies, cookieString) {
        var cookiePair = cookieString.split('=');

        cookies[cookiePair[0].trim()] = cookiePair.length > 1 ? cookiePair[1].trim() : '';

        return cookies;
    }, {});
};

function processSymbolData(str) {
    var result = '';
    var inSymbol = false;
    var nesting = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] === '[') {
            if (nesting == 0) {
                result += '<span class="symbol-data">';
            } else {
                result += str[i];
            }
            nesting++;
            inSymbol = true;
        } else if (str[i] === ']') {
            nesting--;

            if (nesting > 0) {
                result += str[i];
            } else if (inSymbol) {
                result += '</span>';
                inSymbol = false;
            }
        } else {
            result += str[i];
        }
    }
    return result.replace(/&lt;-|-&gt;/g, '');
}

/*
 DOCUMENT READY START
 */

$(document).ready(function () {
    // Set padding for contentDiv based on footer
    if ($('footer').height() !== 0) {
        document.getElementById('contentDiv').style.paddingBottom = $('footer').height() + 31 + 'px';
    }

    // Tooltips
    getToolTips(displayToolTip);

    //This is for testHistoryChecker
    if ((location.pathname === '/FrontPage' || location.pathname === '/') && !location.search.includes('?')) {
        getPageHistory('http://localhost:' + window.location.port + '/?recentTestHistory', generateTestHistoryTable);
        getVersionData(versionCheck,location + "/?mavenVersions");
    }

    //If the first row is hidden, don't use header row styling
    $('tr.hidden').each(function () {
        $(this).next().addClass('slimRowColor0').removeClass('slimRowTitle');
    });
    $('.test').each(function () {
        $(this).before('<i class="fa fa-cog icon-suite" aria-hidden="true"></i>&nbsp;');
    });
    $('.suite').each(function () {
        $(this).before('<i class="fa fa-cogs icon-test" aria-hidden="true" title="show/hide"></i>&nbsp;');
    });
    $('.static').each(function () {
        $(this).before('<i class="fa fa-file-o icon-static" aria-hidden="true"></i>&nbsp;');
    });
    $('.contents li a').each(function () {
        var item = $(this);
        var orig = item.html();
        var tags = orig.match(/\((.*)\)/);
        if (tags) {
            var nwhtml = orig.replace(/\(.*\)/, '');
            item.html(nwhtml);
            var tagList = tags[1].split(', ');
            $.each(tagList, function (i, tag) {
                var tagbadge = document.createElement('span');
                tagbadge.setAttribute('class', 'tag');
                tagbadge.innerText = tag;
                item.after(tagbadge);
            });
        }
    });

    // Add hidden tag buttons upon entering overview page
    $('.test, .suite, .static').each(function () {
        $(this).wrap('<div class=\'addTagDiv\'></div>');
        $(this).after('<i class="fas fa-plus-circle addTag"></i>');
    });

    // Show sidebar
    if (!location.pathname.includes('FrontPage') && getCookie('sidebar') == 'true') {
        getSidebarContent(placeEverythingForSidebar);

        $( "#sidebar" ).resizable({
            handles: 'e, w',
            maxWidth: 700,
            minWidth: 150
        });
    }

    $('#collapseAllSidebar').click(function () {
        collapseSidebarIcons(location.pathname);
    });

    $('#expandAllSidebar').click(function () {
        expandSidebarIcons();
    });

    //Do not use jQuery, as it rebuilds dom elements, breaking the failure nav

    [].forEach.call(document.getElementsByTagName('td'), cell => {
        if (cell.innerHTML.match(/((?![^<>]*>)\$[\w]+=?)/g)) {
            cell.innerHTML = cell.innerHTML.replace(/((?![^<>]*>)\$[\w]+=?)/g, '<span class="page-variable">$1</span>');
        }
        if (cell.innerHTML.match(/(\$`.+`)/g)) {
            cell.innerHTML = cell.innerHTML.replace(/(\$`.+`)/g, '<span class="page-expr">$1</span>');
        }
    });

    if (getCookie('collapseSymbols') == 'true') {
        $('td').contents().filter(function () {
            return this.nodeType == 3 && this.nodeValue.indexOf('->') >= 0 | this.nodeValue.indexOf('<-') >= 0;
        })
        .each(function (cell) {
            if (this.parentNode != null && this.parentNode != undefined) {
                this.parentNode.innerHTML = processSymbolData(this.parentNode.innerHTML);
            }
        });

        $('.symbol-data').prev('.page-variable, .page-expr').each(function () {
            $(this).addClass('canToggle');
            $(this).addClass('closed');
        });

        $('.canToggle').click(function () {
            if ($(this).hasClass('closed')) {
                $(this).next('.symbol-data').css('display', 'inline-flex');
                $(this).removeClass('closed');
                $(this).addClass('open');
            } else {
                $(this).next('.symbol-data').css('display', 'none');
                $(this).removeClass('open');
                $(this).addClass('closed');
            }
        });
    }

    $('#alltags').change(function () {
        if (this.checked) {
            $('#filtertags').attr('name', 'runTestsMatchingAllTags');
        } else {
            $('#filtertags').attr('name', 'runTestsMatchingAnyTag');
        }
    });

    $('.fa-cogs').click(function () {
        $(this).siblings('ul').toggle();
    });

    $('body').on('click', '#prefs-switch', function (e) {
            e.preventDefault();
            $('.settings-panel').toggle();
        }
    );

    $('body').on('click', '#theme-switch', function (e) {
            e.preventDefault();
            switchTheme();
        }
    );

    $('body').on('click', '#collapse-switch', function (e) {
            e.preventDefault();
            switchCollapse();
        }
    );

    $('body').on('click', '#autoSave-switch', function (e) {
            e.preventDefault();
            switchAutoSave();
        }
    );

    $('body').on('click', '#sidebar-switch', function (e) {
            e.preventDefault();
            switchSidebar();
        }
    );

    $('body').on('click', '#collapseSidebarIcon', function (e) {
            e.preventDefault();
            switchCollapseSidebar();
        }
    );

    $('body').on('click', '.coll', function () {
        if ($(this).children('input').is(':checked')) {
            $(this).removeClass('closed');
            $(this).addClass('open');
        } else {
            $(this).removeClass('open');
            $(this).addClass('closed');
        }
    });

    function switchTheme() {
        if (getCookie('themeType') == 'bootstrap-plus-dark') {
            document.cookie = 'themeType=bootstrap-plus';
            $('link[href="/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus-dark.css"]').attr('href', '/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus.css');
            $('#theme-switch').removeClass('fa-toggle-on');
            $('#theme-switch').addClass('fa-toggle-off');
        } else {
            document.cookie = 'themeType=bootstrap-plus-dark';
            $('link[href="/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus.css"]').attr('href', '/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus-dark.css');
            $('#theme-switch').removeClass('fa-toggle-off');
            $('#theme-switch').addClass('fa-toggle-on');
        }
    }

    function switchCollapse() {
        if (getCookie('collapseSymbols') == 'true') {
            document.cookie = 'collapseSymbols=false';
            $('#collapse-switch').removeClass('fa-toggle-on');
            $('#collapse-switch').addClass('fa-toggle-off');
        } else {
            document.cookie = 'collapseSymbols=true';
            $('#collapse-switch').removeClass('fa-toggle-off');
            $('#collapse-switch').addClass('fa-toggle-on');
        }
    }

    function switchAutoSave() {
        if (getCookie('autoSave') == 'true') {
            document.cookie = 'autoSave=false';
            $('#autoSave-switch').removeClass('fa-toggle-on');
            $('#autoSave-switch').addClass('fa-toggle-off');
        } else {
            document.cookie = 'autoSave=true';
            $('#autoSave-switch').removeClass('fa-toggle-off');
            $('#autoSave-switch').addClass('fa-toggle-on');
        }
    }

    function switchSidebar() {
        if (getCookie('sidebar') == 'true') {
            document.cookie = 'sidebar=false';
            document.cookie = 'collapseSidebar=false';
            $('#sidebar-switch').removeClass('fa-toggle-on');
            $('#sidebar-switch').addClass('fa-toggle-off');
            $('#closedSidebar').addClass('displayNone');
            $('#sidebar').addClass('displayNone');
        } else {
            document.cookie = 'sidebar=true';
            $('#sidebar-switch').removeClass('fa-toggle-off');
            $('#sidebar-switch').addClass('fa-toggle-on');
            $('#sidebar').removeClass('displayNone');
            getSidebarContent(placeEverythingForSidebar);
        }
    }

    //Add hover function to type of page
    function tagButtonHover(pageType) {
        $('.' + pageType).parent().hover(
            function () {
                $(this).find('.addTag:first').css('visibility', 'visible');
            }, function () {
                $(this).find('.addTag:first').css('visibility', 'hidden');
            }
        );
    }

    tagButtonHover('test');
    tagButtonHover('static');
    tagButtonHover('suite');

    // Click add tag function
    $('.addTag').click(function () {
        createTagInput($(this));
    });

    // Add delete button when page is loaded in
    $('.contents .tag').append(' <i class="fas fa-times deleteTagButton"></i>');

    deleteClickAndHoverEvent('.deleteTagButton');
});

/*
 DOCUMENT READY END
 |
 SIDEBAR FUNCTIONS START
 */

// Collapse sidebar switch
function switchCollapseSidebar() {
    if (getCookie('collapseSidebar') == 'true') {
        document.cookie = 'collapseSidebar=false';
        $('#closedSidebar').addClass('displayNone');
        $('#sidebar').removeClass('displayNone');
    } else {
        document.cookie = 'collapseSidebar=true';
        $('#closedSidebar').removeClass('displayNone');
        $('#sidebar').addClass('displayNone');
    }
}

// Sidebar content
function getSidebarContent(callback) {
    $.ajax({
        type: 'GET',
        url: 'http://' + location.host + getMainWorkSpace(location.pathname) + '?responder=tableOfContents',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: contentArray => callback(contentArray),
        error: function (xhr) {
            alert('An error ' + xhr.status + ' occurred. Look at the console (F12 or Ctrl+Shift+I) for more information.');
            console.log('Error code: ' + xhr.status, xhr);
        }
    });
}

function getMainWorkSpace(mainWorkspace) {
    if (mainWorkspace.includes('.')) {
        mainWorkspace = mainWorkspace.slice(0, mainWorkspace.indexOf('.'));
    }
    return mainWorkspace;
}

function placeEverythingForSidebar(contentArray) {
    placeSidebarContent(contentArray);
    toggleIconClickEvent();
    collapseSidebarIcons(location.pathname);

    // Scroll to the highlight
    document.getElementById('highlight').scrollIntoView({block: 'center'});
}

function placeSidebarContent(contentArray) {
    // Empty sidebar content
    $('#sidebarContent').html('');

    contentArray.forEach(layerOne => {
        // Place the li in the html
        $('#sidebarContent').append(getSidebarContentHtml(layerOne));

        // If there are children
        if (layerOne.children) {
            sidebarContentLayerLoop(layerOne.path.replace(/\./g, ''), layerOne.children);
        }
    });
}

function sidebarContentLayerLoop(suiteName, children) {
    // Place new ul in the correct li
    $('#' + suiteName).append('<ul></ul>');

    children.forEach(content => {
        // Place new li in the new made ul
        $('#' + suiteName).find('ul').first().append(getSidebarContentHtml(content));

        if (content.children) {
            sidebarContentLayerLoop(content.path.replace(/\./g, ''), content.children);
        }
    });
}

// Generate the li for the html
function getSidebarContentHtml(content) {
    const iconClass = content.type.includes('suite') ? 'fa fa-cogs icon-test' : content.type.includes('test') ? 'fa fa-cog icon-suite' : 'fa fa-file-o icon-static';
    const prunedClass = content.type.includes('pruned') ? ' pruned' : '';
    const highlight = location.pathname === ('/' + content.path) ? ' id="highlight"' : '';
    const toggleClass = content.children ? 'iconToggle iconWidth fa fa-angle-right' : 'iconWidth';

    const htmlContent =
        '<li id="' + content.path.replace(/\./g, '') + '">' +
        '<div' + highlight + '>' +
        '<i class="' + toggleClass + '" aria-hidden="true" title="show/hide"></i>' +
        '&nbsp;' +
        '<i class="' + iconClass + '" aria-hidden="true"></i>' +
        '&nbsp;' +
        '<a href="' + content.path + '" class="' + content.type + prunedClass + '">' + content.name + '</a>' +
        '</div>' +
        '</li>';
    return htmlContent;
}

// Set a click event an the sidebar toggle icons
function toggleIconClickEvent() {
    $('#sidebarContent .iconToggle').click(function () {
        $(this).parent().siblings('ul').toggle();

        if ($(this)[0].className === 'iconToggle iconWidth fa fa-angle-down') {
            $(this).removeClass('fa-angle-down');
            $(this).addClass('fa-angle-right');
        } else {
            $(this).removeClass('fa-angle-right');
            $(this).addClass('fa-angle-down');
        }
    });
}

// Collapse all sidebar icons expect the route you are in
function collapseSidebarIcons(path) {
    // Close all
    $('#sidebarContent .iconToggle').parent().siblings('ul').css({'display': 'none'});
    $('#sidebarContent .iconToggle').removeClass('fa-angle-down');
    $('#sidebarContent .iconToggle').addClass('fa-angle-right');

    // Expand the route you are in
    // Removes the / from the location.pathname
    path = path.slice(1);
    const names = path.split('.');
    let idNames = [];
    names.forEach(name => idNames.length === 0 ? idNames.push(name) : idNames.push(idNames[idNames.length - 1] + name));
    idNames.forEach(id => {
        $('#sidebarContent #' + id + ' ul').first().css({'display': 'block'});
        $('#sidebarContent #' + id + ' .iconToggle').first().removeClass('fa-angle-right');
        $('#sidebarContent #' + id + ' .iconToggle').first().addClass('fa-angle-down');
    });
}

// Collapse all sidebar icons expect
function expandSidebarIcons() {
    $('#sidebarContent .iconToggle').parent().siblings('ul').css({'display': 'block'});
    $('#sidebarContent .iconToggle').removeClass('fa-angle-right');
    $('#sidebarContent .iconToggle').addClass('fa-angle-down');
}

/*
 SIDEBAR FUNCTIONS END
 |
 PAGE HISTORY START
 */

function getPageHistory(url, callback) {
    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'charset=utf-8',
        success: data => callback(data),
        error: function (xhr) {
            alert('An error ' + xhr.status + ' occurred. Look at the console (F12 or Ctrl+Shift+I) for more information.');
            console.log('Error code: ' + xhr.status, xhr);
        }
    });
}

function generateTestHistoryTable(data) {
    const check = document.getElementById('recentTestHistoryTable');
    if (check !== undefined) {
        const parser = new DOMParser();
        let parserhtml = parser.parseFromString(data, 'text/html');
        let table = parserhtml.getElementsByTagName('table')[0];
        const rows = table.getElementsByTagName('tr');

        // Make row length no longer than 5
        if (rows.length > 5) {
            let rowNumberToSlice = rows.length - 5;
            $(rows, 'tr').slice(-rowNumberToSlice).remove();
        }

        // Make new column named "last 5 results"
        let resultsReportTd = rows[0].childNodes[9];
        resultsReportTd.innerText = 'Last 5 Results';
        resultsReportTd.setAttribute('colspan', 5);
        // Make cell length from column "last 5 results" no longer than 5
        for (let i = 1; i < rows.length; i++) {
            let cells = rows[i].getElementsByTagName('td');
            // 4 columns + 5 cells
            if (cells.length > 9) {
                $(cells, 'td').slice(9).remove();
            }
        }

        check.appendChild(table);
    }
}

/*
 PAGE HISTORY END
 |
 FITNESSE TOOLTIPS START
 */

// Get list of tooltips
function getToolTips(callback) {
    // if the document has been loaded, then get data from toolTipData.txt
    $.get('files/fitnesse/bootstrap-plus/txt/toolTipData.txt', function (data) {
        const tooltips = data;
        // Activate function displayToolTip
        callback(tooltips);
    });
}

// Picks random tooltip
function displayToolTip(text) {
    // Picks random tip
    const tipsArray = text.split('\n');
    const pickedTip = Math.floor(Math.random() * tipsArray.length);

    placeToolTip(tipsArray, pickedTip);

    // Returns chosen tip in string for jest
    return pickedTip + ',' + tipsArray[pickedTip];
}

// Places picked tooltips on the page
function placeToolTip(tipsArray, pickedTip) {
    const textfield = document.getElementById('tooltip-text');
    if (textfield) {
        textfield.innerText = tipsArray[pickedTip];
    }
}

/*
 FITNESSE TOOLTIPS END
 |
 ADD & DELETE TAGS FUNCTIONS START
 */

function postTagRequest(callback, url, tagList, neededValues) {
    $.ajax({
        type: 'POST',
        url: url,
        contentType: 'application/json; charset=utf-8',
        data: 'responder=updateTags&suites=' + tagList,
        dataType: 'json',
        success: data => callback(data, neededValues),
        error: function (xhr) {
            alert('An error ' + xhr.status + ' occurred. Look at the console (F12 or Ctrl+Shift+I) for more information.');
            console.log('Error code: ' + xhr.status);
            console.log(xhr);
        }
    });
}

/*
 ADD TAG START
 */

// When pressed an add new tag button create a input to make te new tag in
function createTagInput(currentAddTagButton) {
    //Remove all existing tag input fields
    $('.tagInputOverview').remove();
    //Add input field
    $(currentAddTagButton).after('<input type="text" class="tagInputOverview">');

    //Add focus after clicking button
    $('.tagInputOverview').focus();

    //Remove tag input (& tag error message) when focus is out of the input field
    $('.tagInputOverview').focusout(function () {
        $('.tagInputOverview').remove();
        if ($('.tagErrorMessage').length) {
            $('.tagErrorMessage').remove();
        }
    });

    $('.tagInputOverview').keyup(function (event) {
        //If "Enter" button is pressed
        if (event.keyCode == 13) {
            //Get current input value & replace empty spaces at the start/end of input
            const inputValue = $('.tagInputOverview').val().trim();
            //Get href value of the a tag
            const currentURL = $(currentAddTagButton).siblings('a').attr('href');
            //Call get current tag list function
            GetCurrentTagList(currentURL, inputValue, checkIfNewTagIsValid);
        }
    });
}

// Get current tag list from the parent where you want your new tag
function GetCurrentTagList(currentURL, newTags, callback) {
    //Get current tag list
    $.ajax({
        type: 'GET',
        url: 'http://' + location.host + '/' + currentURL + '?responder=tableOfContents',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: data => callback(data, currentURL, newTags),
        error: function (xhr) {
            alert('An error ' + xhr.status + ' occurred. Look at the console (F12 or Ctrl+Shift+I) for more information.');
            console.log('Error code: ' + xhr.status);
            console.log(xhr);
        }
    });
}

// Check if the tag meet the requirements
function checkIfNewTagIsValid(data, currentURL, newTags) {
    const lowerCaseTags = newTags.toLowerCase();

    //Check if error message is present and remove it when it's true
    if ($('.tagErrorMessage').length) {
        $('.tagErrorMessage').remove();
    }
    // Check if tag already exist and if it has no special characters
    if (data[0].tags.length > 0 && data[0].tags.includes(lowerCaseTags) === true) {
        inputBorderStyling();
        $('.tagInputOverview').after('<div class="tagErrorMessage">Tag already exists on this element</div>');
    } else if (lowerCaseTags.match(/[`~!@#$%^&*()|+=?;:'",.<>\/]/gi) !== null) {
        inputBorderStyling();
        $('.tagInputOverview').after('<div class="tagErrorMessage">`~!@#$%^&*()|+=?;:\'",.<>\\/ not allowed except for -_</div>');
    } else {
        // Post tags
        const currentTagString = data[0].tags.join(', ');
        const tagList = currentTagString.length > 0 ? currentTagString + ', ' + lowerCaseTags : lowerCaseTags;
        const url = 'http://' + location.host + '/' + currentURL;
        postTagRequest(postTagInHtml, url, tagList, {currentURL, newTags});
    }
}

// Post Tag in the html
function postTagInHtml(successData, neededValues) {
    //Add new tag span layout to page
    $('.contents a[href$=\'' + neededValues.currentURL + '\']').parent().after('<span class=\'tag\'>' + neededValues.newTags + ' <i class="fas fa-times deleteTagButton"></i></span>');
    //Remove input field
    $('.tagInputOverview').remove();

    // Find new tag
    const newDeleteTagButton = $('a[href$=\'' + neededValues.currentURL + '\']').parent().parent().find('.deleteTagButton').first();
    // Assign hover listener to new tag
    deleteClickAndHoverEvent(newDeleteTagButton);
}

// Make the tag input border red
function inputBorderStyling() {
    $('.tagInputOverview').css({
        'border-color': 'red',
        'outline': '0'
    });
}

/*
 ADD END
 |
 DELETE START
 */

// Place a Click and a hover event an the tags
function deleteClickAndHoverEvent(deleteTagButton) {
    // Show delete tag button on hover
    $('.tag').hover(
        function () {
            $(this).find('.deleteTagButton').css({'display': 'inline-block'});
        }, function () {
            $(this).find('.deleteTagButton').css({'display': 'none'});
        }
    );

    // Click delete tag function
    $(deleteTagButton).click(function () {
        const chosenTag = $(this).parent().text().trim();
        const currentTagArray = $(this).parent().parent().find('.tag');
        const currentTagSpan = $(this).parent();
        const url = 'http://' + location.host + '/' + $(this).parent().siblings('.addTagDiv').find('a').attr('href');
        postTagRequest(deleteTag, url, joinTagList(chosenTag, currentTagArray), {currentTagSpan});
    });
}

// Delete the chosen tag from the current tag list
function joinTagList(chosenTag, currentTagArray) {
    const newTagArray = [];
    // Loop through all found tags
    $(currentTagArray).each(function () {
        // Filter current tags from chosen tag
        if ($(this).text().trim() !== chosenTag) {
            // Push remaining tags to the array
            newTagArray.push($(this).text().trim());
        }
    });
    // Return joined array values
    return newTagArray.reverse().join(', ');
}

// Delete tag
function deleteTag(successData, neededValues) {
    // Remove chosen tag from list/view
    neededValues.currentTagSpan.remove();
}

/*
 DELETE END | ADD & DELETE TAGS FUNCTIONS END
 */

/*
 START VERSIONCHECKER
 */

function getVersionData(callback, url) {
    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'charset=utf-8',
        success: data => callback(data),
        error: function (xhr) {
            console.log('Error code for version checker: ' + xhr.status, xhr);
        }
    });
}

function versionCheck(data) {
    if (data !== undefined) {
        data.forEach(versionData => {
            // Replace property 'version' with 'currentVersion' to make al the property names alike
            if (versionData.hasOwnProperty('version')) {
                versionData["currentVersion"] = versionData['version'];
                delete versionData['version'];
            }

                // split version strings by dot and line then parse them to ints
                let semanticCurrentVersion = versionData.currentVersion.replace(/[^.-\d]/ig, '').split(/[-.]/).map(Number);
                let semanticLatestVersion = versionData.latest.replace(/[^.-\d]/ig, '').split(/[-.]/).map(Number);

                // make arrays equal in length if necessary so there wont be an undefined index
                if (semanticCurrentVersion.length < semanticLatestVersion.length || semanticLatestVersion.length < semanticCurrentVersion.length) {
                    while (semanticCurrentVersion.length < semanticLatestVersion.length) semanticCurrentVersion.push(0);
                    while (semanticLatestVersion.length < semanticCurrentVersion.length) semanticLatestVersion.push(0);
                }
                semanticLatestVersion.forEach(function (semanticLatestVersionNumber, i) {
                    //check if current ver is smaller then the latest and check if status is not defined so it doesnt have to loop more than it has to
                    if (versionData.status === undefined) {
                        if (semanticLatestVersionNumber < semanticCurrentVersion[i]) {
                            versionData['status'] = 'Ahead';
                        } else if (semanticCurrentVersion[i] < semanticLatestVersionNumber && i !== semanticLatestVersion.length) {
                            versionData['status'] = 'Outdated';
                        } else if (semanticCurrentVersion[i] === semanticLatestVersionNumber && i === semanticLatestVersion.length - 1) {
                            versionData['status'] = 'Up-to-date';
                        }
                    }
                });


            // Place in html
            $('#versioncheck').append(
                '<tr class="check">' +
                '<td><p>' + versionData.artifactid.replace(/-/g, ' ') + '</p></td>' +
                '<td><p>' + versionData.currentVersion + '</p></td>' +
                '<td><p>' + versionData.latest + '</p></td>' +
                '<td class="' + versionData.status + '"><p>' + versionData.status + '</p></td>' +
                '</tr>');
        });
   }
}

/*
END VERSIONCHECKER
 */