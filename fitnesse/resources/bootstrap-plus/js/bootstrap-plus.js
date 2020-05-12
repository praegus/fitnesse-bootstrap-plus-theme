// Needed for Jest
try {
    module.exports = {
        // Sidebar.test
        getSidebarContentHtml: getSidebarContentHtml,
        getMainWorkSpace: getMainWorkSpace,
        placeSidebarContent: placeSidebarContent,
        toggleIconClickEvent: toggleIconClickEvent,
        expandRouteSidebarIcons: expandRouteSidebarIcons,
        expandSidebarIcons: expandSidebarIcons,
        // Tooltip.test
        placeToolTip:placeToolTip,
        // Tags.test
        createTagInput: createTagInput,
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

function copyToClipboard (str) {
   var el = document.createElement('textarea');
   el.value = str;
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   el.select();
   document.execCommand('copy');
   document.body.removeChild(el);
}

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
    // Set padding for contentDiv based on header and footer
    document.getElementById('contentDiv').style.paddingTop = $('nav').height() + 'px';
    if ($('footer').height() !== 0) {
        document.getElementById('contentDiv').style.paddingBottom = $('footer').height() + 31 + 'px';
    }

    // Tooltips
    getToolTips(placeToolTip);

    //This is for testHistoryChecker
    if ((location.pathname === '/FrontPage' || location.pathname === '/') && !location.search.includes('?')) {
        getPageHistory('http://' + window.location.hostname + ':' + window.location.port + '/?recentTestHistory', generateTestHistoryTable);

    }
    if (location.pathname.includes('FrontPage') && getCookie('versionCheck') === 'true') {
        getVersionData(versionCheck,'http://' + window.location.hostname + ':' + window.location.port + "/?mavenVersions");
    }

    //If the first row is hidden, don't use header row styling. Also remove it from DOM to keep table type decoration
    $('tr.hidden').each(function () {
        $(this).next().addClass('slimRowColor0').removeClass('slimRowTitle');
        $(this).remove();
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

    // For showing the Sidebar
    if (!location.pathname.includes('files') && getCookie('sidebar') == 'true') {
        if ($('body').hasClass('testPage')) {
            $('#collapseSidebarDiv').removeClass('collapseSidebarDivDisabled');
        }
        getSidebarContent(placeEverythingForSidebar);
    }

    // For the Sidebar buttons
    $('#collapseAllSidebar').click(function () {
        expandRouteSidebarIcons(location.pathname);
        scrollSideBarToHighlight();
        setBootstrapPlusConfigCookie("sidebarTreeState", "");
    });
    $('#expandAllSidebar').click(function () {
        expandSidebarIcons();
        scrollSideBarToHighlight();
        setBootstrapPlusConfigCookie("sidebarTreeState", "expanded");
    });

    // For resizing the Sidebar and context help
    $('#sidebar').resizable({
        handles: 'e',
        minWidth: 150,
        stop: function(event, ui) {
            setBootstrapPlusConfigCookie("sidebarPosition", ui.size.width);
        }
    });
    // $('#contextHelp').resizable({
    //     handles: 'w',
    //     minWidth: 150,
    //     stop: function(event, ui) {
    //         setBootstrapPlusConfigCookie("contextHelpPosition", ui.size.width);
    //     }
    // });

    if (getCookie('highlightSymbols') == 'true') {
        $('table').html(function(index,html){
               return html.replace(/((?![^<>]*>)\$[\w]+=?)/g,'<span class="page-variable">$1</span>')
                      .replace(/(\$`.+`)/g, '<span class="page-expr">$1</span>');
           });
        }

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

    $('body').on('click', '#highlight-switch', function (e) {
                e.preventDefault();
                switchHighlight();
            }
        );

    $('body').on('click', '#collapse-switch', function (e) {
            e.preventDefault();
            switchCollapse();
        }
    );

    $('body').on('click', '#mavenVersionCheck-switch', function (e) {
            e.preventDefault();
            switchVersionCheck();
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

    $('body').on('click', '#collapseSidebarDiv', function (e) {
            e.preventDefault();
            switchCollapseSidebar();
        }
    );

    $('body').on('click', '#collapseCHelpDiv', function (e) {
            e.preventDefault();
            switchCollapseContextHelp();
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
               setBootstrapPlusConfigCookie('themeType', 'bootstrap-plus');
               $('link[href="/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus-dark.css"]').attr('href', '/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus.css');
               $('#theme-switch').removeClass('fa-toggle-on');
               $('#theme-switch').addClass('fa-toggle-off');
           } else {
               setBootstrapPlusConfigCookie('themeType', 'bootstrap-plus-dark');
               $('link[href="/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus.css"]').attr('href', '/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus-dark.css');
               $('#theme-switch').removeClass('fa-toggle-off');
               $('#theme-switch').addClass('fa-toggle-on');
           }
       }

       function switchHighlight() {
          if (getCookie('highlightSymbols') == 'true') {
              setBootstrapPlusConfigCookie('highlightSymbols', 'false');
              $('#highlight-switch').removeClass('fa-toggle-on');
              $('#highlight-switch').addClass('fa-toggle-off');
          } else {
              setBootstrapPlusConfigCookie('highlightSymbols', 'true');
              $('#highlight-switch').removeClass('fa-toggle-off');
              $('#highlight-switch').addClass('fa-toggle-on');
          }
      }

       function switchCollapse() {
           if (getCookie('collapseSymbols') == 'true') {
               setBootstrapPlusConfigCookie('collapseSymbols', 'false');
               $('#collapse-switch').removeClass('fa-toggle-on');
               $('#collapse-switch').addClass('fa-toggle-off');
           } else {
               setBootstrapPlusConfigCookie('collapseSymbols', 'true');
               $('#collapse-switch').removeClass('fa-toggle-off');
               $('#collapse-switch').addClass('fa-toggle-on');
           }
       }

       function switchAutoSave() {
           if (getCookie('autoSave') == 'true') {
               setBootstrapPlusConfigCookie('autoSave', 'false');
               $('#autoSave-switch').removeClass('fa-toggle-on');
               $('#autoSave-switch').addClass('fa-toggle-off');
           } else {
               setBootstrapPlusConfigCookie('autoSave', 'true');
               $('#autoSave-switch').removeClass('fa-toggle-off');
               $('#autoSave-switch').addClass('fa-toggle-on');
           }
       }
    function switchVersionCheck() {
        if (getCookie('versionCheck') == 'true') {
            setBootstrapPlusConfigCookie('versionCheck','false')
            $('#mavenVersionCheck-switch').removeClass('fa-toggle-on');
            $('#mavenVersionCheck-switch').addClass('fa-toggle-off');
            $('#mavenVersions').addClass('displayNone');
        } else {
            getVersionData(versionCheck,'http://' + window.location.hostname + ':' + window.location.port + "/?mavenVersions");
            setBootstrapPlusConfigCookie('versionCheck','true')
            $('#mavenVersionCheck-switch').removeClass('fa-toggle-off');
            $('#mavenVersionCheck-switch').addClass('fa-toggle-on');
            $('#mavenVersions').removeClass('displayNone');
        }
    }

    function switchSidebar() {
        if (getCookie('sidebar') == 'true') {
            setBootstrapPlusConfigCookie('sidebar', 'false');
            setBootstrapPlusConfigCookie('collapseSidebar', 'false');
            $('#sidebar-switch').removeClass('fa-toggle-on');
            $('#sidebar-switch').addClass('fa-toggle-off');
            $('#sidebar').addClass('displayNone');
            $('#closedSidebar').addClass('displayNone');
        } else {
            setBootstrapPlusConfigCookie('sidebar', 'true');
            $('#sidebar-switch').removeClass('fa-toggle-off');
            $('#sidebar-switch').addClass('fa-toggle-on');
            $('#sidebar').removeClass('displayNone');
            $('#closedSidebar').removeClass('displayNone');
            getSidebarContent(placeEverythingForSidebar);
        }
    }

    function switchCollapseSidebar() {
        if (getCookie('collapseSidebar') == 'true') {
            setBootstrapPlusConfigCookie('collapseSidebar', 'false');
            $('#collapseSidebarDiv').addClass('collapseSidebarDivColor');
            $('#sidebar').removeClass('displayNone');
        } else {
            setBootstrapPlusConfigCookie('collapseSidebar', 'true');
            $('#collapseSidebarDiv').removeClass('collapseSidebarDivColor');
            $('#sidebar').addClass('displayNone');
        }
    }

    function switchCollapseContextHelp() {
        if (getCookie('collapseContextHelp') == 'true') {
            setBootstrapPlusConfigCookie('collapseContextHelp', 'false');
            $('#collapseCHelpDiv').addClass('collapseCHelpDivColor');
            $('#contextHelp').removeClass('displayNone');
        } else {
            setBootstrapPlusConfigCookie('collapseContextHelp', 'true');
            $('#collapseCHelpDiv').removeClass('collapseCHelpDivColor');
            $('#contextHelp').addClass('displayNone');
        }
    }

       function setBootstrapPlusConfigCookie(name, value) {
             var exp = new Date();
             exp.setTime(exp.getTime() + 3600*1000*24*365);
             document.cookie = name + '=' + value + ';expires=' + exp.toGMTString() + ';path=/';
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

// Sidebar content
function getSidebarContent(callback) {
    try {
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
    } catch(e) { }
}

function getMainWorkSpace(mainWorkspace) {
    if (mainWorkspace === '/' || mainWorkspace.toLowerCase() === '/frontpage') {
        mainWorkspace = '/root';
    } else if (mainWorkspace.includes('.')) {
        mainWorkspace = mainWorkspace.slice(0, mainWorkspace.indexOf('.'));
    }
    return mainWorkspace;
}

function placeEverythingForSidebar(contentArray) {
    placeSidebarContent(contentArray);
    toggleIconClickEvent();
    getCookie('sidebarTreeState') !== 'expanded' ? expandRouteSidebarIcons(location.pathname) : expandSidebarIcons();
    scrollSideBarToHighlight();
}

function scrollSideBarToHighlight() {
    // Scroll to the highlight
    if (document.getElementById('highlight')) {
        document.getElementById('highlight').scrollIntoView({block: 'center', inline: 'start'});
        $('#sidebarContent').scrollLeft(0);
    }
}

function placeSidebarContent(contentArray) {
    // Empty sidebar content
    $('#sidebarContent').html('');

    contentArray.forEach(layerOne => {
        // If path name doesn't exist and location.path is root
        layerOne.path === '' && (location.pathname.toLowerCase() === '/root' || location.pathname.toLowerCase() === '/frontpage' || location.pathname === '/')
            ? layerOne.path = 'root'
            : layerOne.path = layerOne.path;

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

        if (content.children && content.path !== 'files') {
            sidebarContentLayerLoop(content.path.replace(/\./g, ''), content.children);
        }
    });
}

// Generate the li for the html
function getSidebarContentHtml(content) {
    let iconClass = content.type.includes('suite') ? 'fa fa-cogs icon-test' : content.type.includes('test') ? 'fa fa-cog icon-suite' : 'fa fa-file-o icon-static';
    let toggleClass = content.children ? 'iconToggle iconWidth fa fa-angle-right' : 'iconWidth';
    let highlight = location.pathname === ('/' + content.path) ? ' id="highlight"' : '';
    const linkedText = content.type.includes('linked') ? ' @' : '';
    const symbolicIcon = content.isSymlink === true ? '&nbsp;<i class="fa fa-link" aria-hidden="true"></i>' : '';

    // If Frontpage
    highlight = content.path === 'FrontPage' && location.pathname === '/' ? ' id="highlight"' : highlight;
    // If files
    if (content.path.slice(0, 5) === 'files') {
        iconClass = content.type.includes('suite') ? 'fa fa-folder-o' : iconClass;
        toggleClass = 'iconWidth';
    }

    return '<li id="' + content.path.replace(/\./g, '') + '">' +
        '<div' + highlight + '>' +
        '<i class="' + toggleClass + '" aria-hidden="true" title="show/hide"></i>' +
        '&nbsp;' +
        '<i class="' + iconClass + '" aria-hidden="true"></i>' +
        '&nbsp;' +
        '<a href="' + content.path + '" class="' + content.type + '">' + content.name + linkedText + '</a>' +
        symbolicIcon +
        '</div>' +
        '</li>';
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

// Collapse all and Expand the route you are in
function expandRouteSidebarIcons(path) {
    collapseSidebarIcons();

    let idNames = [];
    if (path.toLowerCase() === '/frontpage' || path === '/') {
        idNames.push('root');
        idNames.push('FrontPage');
    } else {
        const names = path.slice(1).split('.');
        names.forEach(name => idNames.length === 0 ? idNames.push(name) : idNames.push(idNames[idNames.length - 1] + name));
    }

    // Expand al the ids
    idNames.forEach(id => {
        $('#sidebarContent #' + id + ' ul').first().css({'display': 'block'});
        $('#sidebarContent #' + id + ' .iconToggle').first().removeClass('fa-angle-right');
        $('#sidebarContent #' + id + ' .iconToggle').first().addClass('fa-angle-down');
    });
}

// Collapse all
function collapseSidebarIcons() {
    $('#sidebarContent .iconToggle').parent().siblings('ul').css({'display': 'none'});
    $('#sidebarContent .iconToggle').removeClass('fa-angle-down');
    $('#sidebarContent .iconToggle').addClass('fa-angle-right');
}

// Expand all sidebar icons
function expandSidebarIcons() {
    $('#sidebarContent .iconToggle').parent().siblings('ul').css({'display': 'block'});
    $('#sidebarContent .iconToggle').removeClass('fa-angle-right');
    $('#sidebarContent .iconToggle').addClass('fa-angle-down');
}

// Right click
$(function(){
    if($('#sidebarContent').length) {
        $('#sidebarContent').contextMenu({
            selector: 'a',
            callback: function(key, options) {
                handleContextMenuClick(key, this);
            },
            items: {
                "run": {name: "Run",
                        icon: "fa-play-circle-o",
                        visible: function(key, opt) { return showRunnablePageItems(opt); }
                        },
                "runNewTab": {name: "Run in new tab",
                        icon: "fa-play-circle-o",
                        visible: function(key, opt) { return showRunnablePageItems(opt); },
                        className: "contextmenu-newtab"
                        },
                "sep0": {type: "cm_separator", visible: function(key, opt) { return showRunnablePageItems(opt); }
                        },
                "edit": {name: "Edit", icon: "fa-edit"},
                "editNewTab": {name: "Edit in new tab", icon: "fa-edit", className: "contextmenu-newtab"},
                "rename": {name: "Rename", icon: "fa-pencil"},
                "move": {name: "Move", icon: "fa-long-arrow-right"},
                "delete": {name: "Delete", icon: "fa-trash-o"},
                "sep1": {type: "cm_separator"},
                "fold1": {
                    name: "Add",
                    icon: "fa-plus",
                    items: {
                        addStatic: {name: "Static Page", icon: "fa-file-o"},
                        addSuite: {name: "Suite Page", icon: "fa-cogs"},
                        addTest: {name: "Test Page", icon: "fa-cog"}
                    }
                },
                "sep2": {type: "cm_separator"},
                "copypath": {name: "Copy Page Path", icon: "fa-clipboard"},
                "testhistory": {name: "Test History",
                                icon: "fa-history",
                                visible: function(key, opt) {
                                    return showRunnablePageItems(opt);
                                 }},
                "search": {name: "Search from here", icon: "fa-search"},
                "properties":  {name: "Properties", icon:"fa-ellipsis-h"}
            }
        });
    }
});

function showRunnablePageItems(opt) {
    if (opt.$trigger[0].classList.contains('test') === false && opt.$trigger[0].classList.contains('suite') === false) {
        return false;
    }
    return true;
}

function handleContextMenuClick(key, element) {
    if (key === 'copypath') {
        copyToClipboard(element[0].pathname.replace('/', '.'));
    } else {
        var responder = getResponder(key, element);
        if (key.includes('NewTab')) {
            window.open(element[0].pathname + '?' +responder, '_blank');
        } else {
            window.location.href = element[0].pathname + '?' + responder;
        }
    }
}

function getResponder(key, element) {
    var el = element[0];
        switch(key) {
          case "run":
          case "runNewTab":
              return el.classList.contains('suite') ? 'suite' : 'test';
          case "edit":
          case "editNewTab":
              return 'edit';
          case "rename":
              return 'refactor&type=rename';
          case "move":
              return 'refactor&type=move';
          case "delete":
              return 'deletePage';
          case "testhistory":
              return 'testHistory';
          case "search":
              return 'search';
          case "properties":
              return 'properties';
          case "addStatic":
              return 'new&pageTemplate=.TemplateLibrary.StaticPage';
          case "addSuite":
              return 'new&pageTemplate=.TemplateLibrary.SuitePage';
          case "addTest":
              return 'new&pageTemplate=.TemplateLibrary.TestPage';
        }
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
    // get data from responder
    $.ajax({
        type: 'GET',
        url: 'http://' + window.location.hostname + ':' + window.location.port + '/?Tooltips',
        contentType: 'charset=utf-8',
        success: data => callback(data),
        error: function (xhr) {
            alert('An error ' + xhr.status + ' occurred. Look at the console (F12 or Ctrl+Shift+I) for more information.');
            console.log('Error code: ' + xhr.status, xhr);
        }
    });
}

// Places picked tooltips on the page
function placeToolTip(text) {

    if ($('#tooltip-text')) {
        if (text.includes('</a>') && !text.includes('<script>')) {
            $('#tooltip-text').html(text);
        } else {
            $('#tooltip-text').text(text);
        }
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
        if (event.keyCode === 13) {
            const currentPageURL = $(currentAddTagButton).siblings('a').attr('href');
            const responderURL = '?responder=tableOfContents';
            const inputValue = $('.tagInputOverview').val().trim();
            GetCurrentTagList(checkIfNewTagIsValid, currentPageURL, responderURL, inputValue);
        }
    });

    // Get href value of the a tag
    const indexPointURl = $(currentAddTagButton).siblings('a').attr('href').indexOf('.');
    const currentMainSuiteURL = $(currentAddTagButton).siblings('a').attr('href').slice(0, indexPointURl);
    const responderURL = '?responder=allTags';
    //Call get current tag list function
    GetCurrentTagList(tagAutocomplete, currentMainSuiteURL, responderURL);
}

// Get current tag list from the parent where you want your new tag
function GetCurrentTagList(callback, currentPageURL, responderURL, newTags) {
    $.ajax({
        type: 'GET',
        url: 'http://' + location.host + '/' + currentPageURL + responderURL,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: data => callback(data, currentPageURL, newTags),
        error: function (xhr) {
            alert('An error ' + xhr.status + ' occurred. Look at the console (F12 or Ctrl+Shift+I) for more information.');
            console.log('Error code: ' + xhr.status);
            console.log(xhr);
        }
    });
}

function tagAutocomplete(data) {
    $('.tagInputOverview').autocomplete({
        source: function(request, response) {
            const results = $.ui.autocomplete.filter(data[Object.keys(data)], request.term);
            // Show the words in alphabetical order
            results.sort();
            // Show only up to 5 words
            response(results.slice(0, 5));
        }
    });
    // Only show words that begin with the input value
    $.ui.autocomplete.filter = function (array, term) {
        const matcher = new RegExp('^' + $.ui.autocomplete.escapeRegex(term), 'i');
        return $.grep(array, function (value) {
            return matcher.test(value.label || value.value || value);
        });
    };
}

// Check if the tag meet the requirements
function checkIfNewTagIsValid(data, currentPageURL, newTags) {
    const lowerCaseTags = newTags.toLowerCase();

    //Check if error message is present and remove it when it's true
    if ($('.tagErrorMessage').length) {
        $('.tagErrorMessage').remove();
    }
    // Check if tag already exist and if it has no special characters
    if (typeof data[0].tags !== 'undefined' && data[0].tags.includes(lowerCaseTags) === true) {
        inputBorderStyling();
        $('.tagInputOverview').after('<div class="tagErrorMessage">Tag already exists on this element</div>');
    } else if (lowerCaseTags.match(/[`~!@#$%^&*()|+=?;:'",.<>\/]/gi) !== null) {
        inputBorderStyling();
        $('.tagInputOverview').after('<div class="tagErrorMessage">`~!@#$%^&*()|+=?;:\'",.<>\\/ not allowed except for -_</div>');
    } else if (!newTags) {
        inputBorderStyling();
        $('.tagInputOverview').after('<div class="tagErrorMessage">Please fill in a tag name</div>');
    } else {
        // Post tags
        const currentTagString = (typeof data[0].tags !== 'undefined') ? data[0].tags.join(', ') : '';
        const tagList = currentTagString.length > 0 ? currentTagString + ', ' + newTags : newTags;
        const url = 'http://' + location.host + '/' + currentPageURL;
        postTagRequest(postTagInHtml, url, tagList, {currentPageURL, newTags});
    }
}

// Post Tag in the html
function postTagInHtml(successData, neededValues) {
    //Add new tag span layout to page
    $('.contents a[href$=\'' + neededValues.currentPageURL + '\']').parent().after('<span class=\'tag\'>' + neededValues.newTags + ' <i class="fas fa-times deleteTagButton"></i></span>');
    //Remove input field
    $('.tagInputOverview').remove();

    // Find new tag
    const newDeleteTagButton = $('a[href$=\'' + neededValues.currentPageURL + '\']').parent().parent().find('.deleteTagButton').first();
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
        const getCurrentPage = $(this).parent().parent().find('.addTagDiv').find('a')[0];
        const currentTagArray = ($(getCurrentPage).hasClass('suite') === true) ? $(this).parent().parent().children('.tag') : $(this).parent().parent().find('.tag');
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
                switch (versionData.artifactid) {
                    case 'fitnesse':
                        versionData['notes'] = '<a href="http://fitnesse.org/FitNesse.ReleaseNotes"  target="_blank">FitNesse</a>';
                        break;
                    case 'hsac-fitnesse-fixtures':
                        versionData['notes'] = '<a href="https://github.com/fhoeben/hsac-fitnesse-fixtures/releases"  target="_blank">Hsac FitNesse Fixtures</a>';
                        break;
                    case 'toolchain-fitnesse-plugin':
                        versionData['notes'] = '<a href="https://github.com/praegus/toolchain-fitnesse-plugin/releases"  target="_blank">Toolchain Plugin</a> / <a href="https://github.com/praegus/fitnesse-bootstrap-plus-theme/releases" target="_blank">Bootstrap<sup>+</sup></a>';
                        break;
                    default:
                        versionData['notes'] ='';
                        break;
                }




            // Place in html
            $('#versioncheck').append(
                '<tr class="check">' +
                '<td><p>' + versionData.artifactid.replace(/-/g, ' ') + '</p></td>' +
                '<td><p>' + versionData.currentVersion + '</p></td>' +
                '<td><p>' + versionData.latest + '</p></td>' +
                '<td class="' + versionData.status + '"><p>' + versionData.status + '</p></td>' +
                '<td><p>' + versionData.notes + '</p></td>' +
                '</tr>');
        });
   }
}

/*
END VERSIONCHECKER
 */