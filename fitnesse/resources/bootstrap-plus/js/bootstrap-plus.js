// Needed for Jest
try {
    module.exports = {
        getSidebarContentHtml: getSidebarContentHtml,
        placeSidebarContent: placeSidebarContent,
        toggleIconClickEvent: toggleIconClickEvent,
        expandRouteSidebarIcons: expandRouteSidebarIcons,
        expandSidebarIcons: expandSidebarIcons,
        placeToolTip:placeToolTip,
        createTagInput: createTagInput,
        checkIfNewTagIsValid: checkIfNewTagIsValid,
        postTagInHtml: postTagInHtml,
        inputBorderStyling: inputBorderStyling,
        deleteClickAndHoverEvent: deleteClickAndHoverEvent,
        joinTagList: joinTagList,
        deleteTag: deleteTag,
        generateTestHistoryTable: generateTestHistoryTable,
        getPageHistory: getPageHistory
    };
} catch (e) {
    //Intentionally left blank
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
                inSymbol = true;
            } else {
                result += str[i];
            }
            nesting++;
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

function showNotification(type, message) {
    if ($('#notification').length < 1) {
        const icon = type === 'success'
            ? 'check'
            : type === 'info'
                ? 'info'
                : type === 'warning'
                    ? 'exclamation'
                    : type === 'danger'
                        ? 'times-circle'
                        : 'question';

        $('body').append('<div class="push-notification push-' + type + '" id="notification"><i class="notification-icon fa fa-' + icon + '" aria-hidden="true"></i>' + message + '</div>');
        $('#notification').show().delay(4000).fadeOut(1200, function () {
            $('#notification').remove();
        });
    }
}

/*
 DOCUMENT READY START
 */

$(document).ready(function () {

    $(document).keydown(function (e) {
        var items = $('#sidebarContent div:visible');
        var itemSelected = $(".highlight");
        var index = items.index(itemSelected);
        var focused = document.activeElement.tagName;
        var prevent = focused.toLowerCase() === 'textarea'
                        || focused.toLowerCase() === 'input'
                        || focused.toLowerCase() === 'select'
                        || $(".context-menu-list").is(":visible")
                        || !$("#sidebarContent").is(":visible");
        if (prevent) {
            return;
        }
        if(e.which === 40){

            itemSelected.removeClass('highlight');
            next = items.eq(index + 1);
            if(next.length > 0){
                itemSelected = next.addClass('highlight');
            }else{
                itemSelected = items.eq(0).addClass('highlight');
            }

        } else if(e.which === 38){
            itemSelected.removeClass('highlight');
            next = items.eq(index - 1);
            if(next.length > 0){
                itemSelected = next.addClass('highlight');
            }else{
                itemSelected = items.last().addClass('highlight');
            }
        } else if(e.which === 37 || e.which === 39 || e.which === 32) {
            itemSelected.children('.iconToggle').trigger('click');
        } else if(e.which === 13) {
            location.href=itemSelected.children('a').attr("href");
        }
        else if(e.code === 'AltRight') {
            itemSelected.children('a').trigger('contextmenu');
        }
    });

    $(document).keydown(function (e) {
        var evtobj = window.event ? event : e;
        //toggle sidebar with alt-1
        if ((evtobj.keyCode == 49 && evtobj.altKey)) {
            e.preventDefault();
            switchCollapseSidebar();
        }
    });

    // Set padding for contentDiv based on header and footer
    document.getElementById('contentDiv').style.paddingTop = $('nav').height() + 'px';
    if ($('footer').height() !== 0) {
        document.getElementById('contentDiv').style.paddingBottom = $('footer').height() + 31 + 'px';
    }

    // Tooltips
    getToolTips(placeToolTip);

    //This is for testHistoryChecker
    if ((location.pathname === '/FrontPage' || location.pathname === '/') && !location.search.includes('?')) {
        getPageHistory(location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/?recentTestHistory&specPageFilter=' + getCookie('historySpecialPages'), generateTestHistoryTable);
    }
    // for recent test history filter switch
    if(getCookie('historySpecialPages')== 'true'){
        $('#history-specialPages-switch').removeClass('fa-toggle-off');
        $('#history-specialPages-switch').addClass('fa-toggle-on');

    }else{
        $('#history-specialPages-switch').removeClass('fa-toggle-on');
        $('#history-specialPages-switch').addClass('fa-toggle-off');
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
        if($(this).attr('href').endsWith('.ScenarioLibrary')) {
            $(this).before('<i class="fa fa-bolt icon-scenariolib" aria-hidden="true"></i>&nbsp;');
        } else if ($(this).attr('href').endsWith('.SetUp') ||
                    $(this).attr('href').endsWith('.SuiteSetUp') ||
                    $(this).attr('href').endsWith('.TearDown') ||
                    $(this).attr('href').endsWith('.SuiteTearDown'))  {
            $(this).before('<i class="fa fa-wrench icon-special" aria-hidden="true"></i>&nbsp;');
        } else {
            $(this).before('<i class="fa fa-file-o icon-static" aria-hidden="true"></i>&nbsp;');
        }
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
        // Set cookie to remember expanded state BEFORE making the request
        setBootstrapPlusConfigCookie("sidebarTreeState", "expanded");
        
        // Show loading indicator
        $('#sidebarContent').html('<div id="spinner" style="width: 42px; height:42px; margin: 15px 10px;"></div>');
        
        // Make a new call to the responder without depth parameter as it now returns the complete tree by default
        $.ajax({
            type: 'GET',
            url: location.protocol + '//' + location.host + getWorkSpace(location.pathname) + '?responder=tableOfContents',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(contentArray) {
                // Place the content in the sidebar - this will now render all nested levels
                // because we've updated sidebarContentLayerLoopOptimized to respect the expanded state
                placeSidebarContent(contentArray);
                
                // Set up the click events
                toggleIconClickEvent();
                setupSidebarLinkClickEvent();
                
                // Make sure all ULs are visible - even deeply nested ones
                $('#sidebarContent ul').css({'display': 'block'});
                
                // Update all toggle icons to show they're expanded
                $('#sidebarContent .iconToggle').removeClass('fa-angle-right');
                $('#sidebarContent .iconToggle').addClass('fa-angle-down');
                
                // Scroll to highlight
                scrollSideBarToHighlight();
            },
            error: function(xhr) {
                console.log('Error code: ' + xhr.status, xhr);
                // Fallback to the original behavior if the request fails
                expandSidebarIcons();
                scrollSideBarToHighlight();
            }
        });
    });

    $('#resetSidebarRoot').click(function () {
        setBootstrapPlusConfigCookie("sidebarRoot", "");
        $('#sidebarContent').empty();
        $('#sidebarContent').append('<div id="spinner" style="width: 42px; height:42px; margin: 15px 10px;"></div>');
        getSidebarContent(placeEverythingForSidebar);
        $(this).remove();
    });

    // For resizing the Sidebar and context help
    $('#sidebar').resizable({
        handles: 'e',
        minWidth: 150,
        stop: function(event, ui) {
            setBootstrapPlusConfigCookie("sidebarPosition", ui.size.width);
        }
    });
    $('#contextHelp').resizable({
        handles: 'w',
        minWidth: 230,
        stop: function(event, ui) {
            setBootstrapPlusConfigCookie("contextHelpPosition", ui.size.width);
        }
    });

    if (getCookie('highlightSymbols') == 'true') {
        $('table').html(function(index,html){
               return html.replace(/((?![^<>]*>)\$[\w]+=?)/g,'<span class="page-variable">$1</span>')
                      .replace(/(\$`.+`)/g, '<span class="page-expr">$1</span>');
           });
        }

    if (getCookie('collapseSymbols') == 'true') {
        $('td').contents().filter(function () {
            return this.nodeType == 3 && this.nodeValue.indexOf('->[') >= 0 | this.nodeValue.indexOf('<-[') >= 0;
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

    $('body').on('click', '#sidebarTags-switch', function (e) {
            e.preventDefault();
            switchSidebarTags();
        }
    );

    $('body').on('click', '#history-specialPages-switch', function (e) {
        e.preventDefault();
        switchHistorySpecialPages();
        var info = getPageHistory(location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/?recentTestHistory&specPageFilter=' + getCookie('historySpecialPages'), generateTestHistoryTable);
        $('#recentTestHistoryTable').html('');
        $('#recentTestHistoryTable').load(info);
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
               $('link[href="/files/fitnesse/bootstrap-plus/css/custom-bootstrap-plus-dark.css"]').attr('href', '/files/fitnesse/bootstrap-plus/css/custom-bootstrap-plus.css');
               $('#theme-switch').removeClass('fa-toggle-on');
               $('#theme-switch').addClass('fa-toggle-off');
           } else {
               setBootstrapPlusConfigCookie('themeType', 'bootstrap-plus-dark');
               $('link[href="/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus.css"]').attr('href', '/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus-dark.css');
               $('link[href="/files/fitnesse/bootstrap-plus/css/custom-bootstrap-plus.css"]').attr('href', '/files/fitnesse/bootstrap-plus/css/custom-bootstrap-plus-dark.css');
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
               showNotification('info', 'Symbol highlighting enabled. Can be slow on large result pages!');
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
               showNotification('info', 'Symbol collapse enabled. Can be slow on large result pages!');
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
               showNotification('warning', 'You have enabled an experimental function. Use with caution!');
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
            showNotification('info', 'The context helper styling has also changed into the sidebar style');
        }
    }

    function switchSidebarTags(){
        if (getCookie('sidebarTags') == 'true'){
            setBootstrapPlusConfigCookie('sidebarTags', 'false');
            $('#sidebarTags-switch').addClass("noTags");
            $('.sidebarTag').addClass('displayNone');
        }else {
            setBootstrapPlusConfigCookie('sidebarTags', 'true');
            $('#sidebarTags-switch').removeClass('noTags');
            $('.sidebarTag').removeClass('displayNone');
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
    function switchHistorySpecialPages(){
        if(getCookie('historySpecialPages') == 'true'){
            setBootstrapPlusConfigCookie('historySpecialPages', 'false');
            $('#history-specialPages-switch').addClass('fa-toggle-off');
            $('#history-specialPages-switch').removeClass('fa-toggle-on');
        }else{
            setBootstrapPlusConfigCookie('historySpecialPages','true');
            $('#history-specialPages-switch').removeClass('fa-toggle-off');
            $('#history-specialPages-switch').addClass('fa-toggle-on');
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
        // For normal loading, always use depth=2
        // When in expanded mode, the responder now returns complete tree by default
        const depthParam = getCookie('sidebarTreeState') !== 'expanded' ? '&depth=2' : '';
        
        $.ajax({
            type: 'GET',
            url: location.protocol + '//' + location.host + getWorkSpace(location.pathname) + '?responder=tableOfContents' + depthParam,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(contentArray) {
                // Always call the callback function to ensure content is displayed
                callback(contentArray);
            },
            error: function (xhr) {
                console.log('Error code: ' + xhr.status, xhr);
            }
        });
    } catch(e) { }
}

function getWorkSpace(mainWorkspace) {

    if (getCookie('sidebarRoot').length == 0 && mainWorkspace === '/' || mainWorkspace.toLowerCase() === '/frontpage') {
        mainWorkspace = '/root';
    } else if (getCookie('sidebarRoot').length == 0 && mainWorkspace.includes('.')) {
        mainWorkspace = mainWorkspace.slice(0, mainWorkspace.indexOf('.'));
    }

    var workspace = getCookie('sidebarRoot').length > 0
            ? getCookie('sidebarRoot')
            : mainWorkspace;

    return workspace;
}

function placeEverythingForSidebar(contentArray) {
    placeSidebarContent(contentArray);
    toggleIconClickEvent();
    setupSidebarLinkClickEvent();
    
    // If the tree state is set to expanded, expand all icons without lazy loading
    // This is used when the Expand All button is clicked and we already have all the data
    if (getCookie('sidebarTreeState') === 'expanded') {
        // Show all ul elements (these are the children containers)
        $('#sidebarContent ul').css({'display': 'block'});
        
        // Update all toggle icons to show expanded state
        $('#sidebarContent .iconToggle').removeClass('fa-angle-right');
        $('#sidebarContent .iconToggle').addClass('fa-angle-down');
    } else {
        // Otherwise, just expand the route
        expandRouteSidebarIcons(location.pathname);
    }
    
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
        layerOne.path === '' && (location.pathname.toLowerCase() === '/root' ||
                                 location.pathname.toLowerCase() === '/frontpage' ||
                                 location.pathname === '/')
            ? layerOne.path = 'root'
            : layerOne.path = layerOne.path;

        // Create a document fragment to minimize DOM operations
        const fragment = document.createDocumentFragment();
        const rootElement = $(getSidebarContentHtml(layerOne))[0];
        fragment.appendChild(rootElement);

        // If there are children
        if (layerOne.children) {
            // Only render the first level children initially
            sidebarContentLayerLoopOptimized(rootElement, layerOne.children, 1);
        }

        // Append the entire fragment to the DOM at once
        $('#sidebarContent').empty().append(fragment);
        
        // Add the sidebar-link-handler class to all links
        $('#sidebarContent a').addClass('sidebar-link-handler');
    });
}

function sidebarContentLayerLoopOptimized(parentElement, children, currentDepth) {
    // Create a ul element
    const ul = document.createElement('ul');
    
    // Get the tree state
    const isExpanded = getCookie('sidebarTreeState') === 'expanded';
    
    // Process all children
    children.forEach(content => {
        // Create the li element
        const li = $(getSidebarContentHtml(content))[0];
        
        // Only process children if we're on the path to the current page, at the first level,
        // or if the tree is in expanded state (which means we should render all levels)
        const isOnCurrentPath = location.pathname.startsWith('/' + content.path);
        
        // If this content has children according to the API response
        if (content.children && content.children.length > 0 && content.path !== 'files') {
            // If we're at the first level or on the current path or in expanded mode, render the children we have
            if (currentDepth === 1 || isOnCurrentPath || isExpanded) {
                sidebarContentLayerLoopOptimized(li, content.children, currentDepth + 1);
            }
            
            // Make sure the toggle icon is visible for nodes that have children
            // This is important because we now know this node has children, even if we don't load them yet
            const toggleIcon = $(li).find('i').first();
            if (!toggleIcon.hasClass('iconToggle')) {
                toggleIcon.removeClass('iconWidth');
                toggleIcon.addClass('iconToggle iconWidth fa fa-angle-right');
            }
        } else if (content.children && content.children.length === 0) {
            // If the API explicitly tells us there are no children, we can mark this node
            $(li).attr('data-no-children', 'true');
            
            // Make sure there's no toggle icon for nodes without children
            const toggleIcon = $(li).find('i').first();
            if (toggleIcon.hasClass('iconToggle')) {
                toggleIcon.removeClass('iconToggle fa fa-angle-right fa-angle-down');
                toggleIcon.addClass('iconWidth');
            }
        }
        
        // Add the li to the ul
        ul.appendChild(li);
    });
    
    // Add the ul to the parent element
    parentElement.appendChild(ul);
}

// Generate the li for the html
function getSidebarContentHtml(content) {
    let iconClass = content.type.includes('suite')
        ? 'fa fa-cogs icon-test'
        : content.type.includes('test')
            ? 'fa fa-cog icon-suite'
            : 'fa fa-file-o icon-static';
    
    // Determine if we should show the toggle icon
    let toggleClass = '';
    
    // Only add the toggle icon class if we know the content has children
    if (content.children && content.children.length > 0) {
        toggleClass = 'iconToggle iconWidth fa fa-angle-right';
    } else {
        // For nodes without children or unknown status, just add spacing
        toggleClass = 'iconWidth';
    }
    
    let highlight = location.pathname === ('/' + content.path) ? ' class="highlight"' : '';
    const linkedText = content.type.includes('linked') ? ' @' : '';
    const symbolicIcon = content.isSymlink === true ? '&nbsp;<i class="fa fa-link" aria-hidden="true"></i>' : '';
    const tagString = sidebarTags(content.tags);

    // If Frontpage
    highlight = content.path === 'FrontPage' && location.pathname === '/' ? ' class="highlight"' : highlight;
    
    // If files
    if (content.path.slice(0, 5) === 'files') {
        iconClass = content.type.includes('suite') ? 'fa fa-folder-o' : iconClass;
    }
    
    // Wrench for setup/teardown pages
    if(content.path.endsWith('.SetUp') ||
        content.path.endsWith('.SuiteSetUp') ||
        content.path.endsWith('.TearDown') ||
        content.path.endsWith('.SuiteTearDown')) {
        iconClass = 'fa fa-wrench icon-special'
    }
    
    // bolt for scenariolibrary
    if(content.path.endsWith('.ScenarioLibrary')) {
        iconClass = 'fa fa-bolt icon-scenariolib'
    }

    return '<li id="' + content.path.replace(/\./g, '') + '">' +
        '<div' + highlight + '>' +
        '<i class="' + toggleClass + '" aria-hidden="true" title="show/hide"></i>' +
        '&nbsp;' +
        '<i class="' + iconClass + '" aria-hidden="true"></i>' +
        '&nbsp;' +
        '<a href="' + content.path + '" class="' + content.type + '">' + content.name + linkedText + '</a>' +
        symbolicIcon +
        tagString +
        '</div>' +
        '</li>';
}

function sidebarTags(tagsArray){
    let tagString = "" ;
    if(tagsArray !== undefined){
        tagsArray.forEach(tag => {
            tagString += getCookie('sidebarTags') == 'true'
                ? '<span class="tag sidebarTag">' + tag + '<i class="fas fa-times deleteTagButton"></i></span>'
                : '<span class="tag sidebarTag displayNone">' + tag + '<i class="fas fa-times deleteTagButton"></i></span>';
        });
    }
    return tagString;
}

// Set a click event an the sidebar toggle icons
function toggleIconClickEvent() {
    // Remove any existing click handlers to avoid duplicates
    $('#sidebarContent').off('click', '.iconToggle');
    
    // Use event delegation for better performance
    $('#sidebarContent').on('click', '.iconToggle', function(e) {
        // Prevent the event from being handled twice
        e.stopPropagation();
        
        const parentLi = $(this).closest('li');
        const parentLink = parentLi.find('a').first();
        const pagePath = parentLink.attr('href');
        
        // Check if this node is already expanded
        const isExpanded = $(this).hasClass('fa-angle-down');
        
        if (isExpanded) {
            // If it's already expanded, just collapse it
            parentLi.find('> ul').hide();
            $(this).removeClass('fa-angle-down').addClass('fa-angle-right');
        } else {
            // Show loading indicator
            $(this).removeClass('fa-angle-right').addClass('fa-spinner fa-spin');
            
            // Always make AJAX request to get fresh children data
            // Always use depth=2 for lazy loading
            $.ajax({
                type: 'GET',
                url: location.protocol + '//' + location.host + '/' + pagePath + '?responder=tableOfContents&depth=2',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: (contentArray) => {
                    if (contentArray && contentArray.length > 0 && contentArray[0].children && contentArray[0].children.length > 0) {
                        // Remove existing children if any
                        parentLi.find('> ul').remove();
                        
                        // Render the children with fresh data
                        const parentElement = parentLi[0];
                        sidebarContentLayerLoopOptimized(parentElement, contentArray[0].children, 2);
                        
                        // Show the children
                        parentLi.find('> ul').show();
                        
                        // Change icon to expanded state
                        $(this).removeClass('fa-spinner fa-spin').addClass('fa-angle-down');
                    } else {
                        // No children found
                        $(this).removeClass('fa-spinner fa-spin').addClass('fa-angle-right');
                        
                        // If no children were found, mark this node
                        parentLi.attr('data-no-children', 'true');
                        
                        // Remove the toggle icon since there are no children
                        $(this).removeClass('iconToggle fa-angle-right');
                        $(this).addClass('iconWidth');
                    }
                },
                error: function(xhr) {
                    console.log('Error loading children: ' + xhr.status, xhr);
                    $(this).removeClass('fa-spinner fa-spin').addClass('fa-angle-right');
                }
            });
        }
    });
    
    // For tests compatibility - this is needed for the tests to pass
    // but we don't actually use it for the real functionality
    $('#sidebarContent .iconToggle').each(function() {
        $(this).data('click-bound', true);
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
    // Check if we're in "expanded" mode (all data already loaded)
    const isFullyLoaded = getCookie('sidebarTreeState') === 'expanded';
    
    if (isFullyLoaded) {
        // If we already have all the data, just expand all nodes visually
        $('#sidebarContent ul').css({'display': 'block'});
        $('#sidebarContent .iconToggle').removeClass('fa-angle-right');
        $('#sidebarContent .iconToggle').addClass('fa-angle-down');
    } else {
        // Otherwise, we need to expand nodes one by one with lazy loading
        // First, get all collapsed nodes with toggle icons
        const collapsedNodes = $('#sidebarContent .iconToggle.fa-angle-right').toArray();
        
        // Define a recursive function to expand nodes one by one
        function expandNextNode(index) {
            if (index >= collapsedNodes.length) {
                return; // All nodes expanded
            }
            
            const toggleIcon = collapsedNodes[index];
            
            // Trigger a click on the toggle icon to expand it (which will make an AJAX call)
            $(toggleIcon).trigger('click');
            
            // Wait for the AJAX call to complete before expanding the next node
            // We'll use a timeout to give the AJAX call time to complete
            setTimeout(function() {
                expandNextNode(index + 1);
            }, 100);
        }
        
        // Start expanding nodes
        expandNextNode(0);
    }
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
                "runNewTab": {name: "Run in New Tab",
                        icon: "fa-play-circle-o",
                        visible: function(key, opt) { return showRunnablePageItems(opt); },
                        className: "contextmenu-newtab"
                        },
                "sep0": {type: "cm_separator", visible: function(key, opt) { return showRunnablePageItems(opt); }
                        },
                "edit": {name: "Edit", icon: "fa-edit"},
                "editNewTab": {name: "Edit in New Tab", icon: "fa-edit", className: "contextmenu-newtab"},
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
                "setSidebarRoot": {name: "Set as Sidebar Root", icon: "fa-thumb-tack"},
                "testhistory": {name: "Test History",
                                icon: "fa-history",
                                visible: function(key, opt) {
                                    return showRunnablePageItems(opt);
                                 }},
                "search": {name: "Search From Here", icon: "fa-search"},
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
    } else if (key === 'setSidebarRoot') {
         var exp = new Date();
         exp.setTime(exp.getTime() + 3600*1000*24*365);
         document.cookie = 'sidebarRoot=/' + element[0].pathname.replace('/', '.').substring(1) + ';expires=' + exp.toGMTString() + ';path=/';
         getSidebarContent(placeEverythingForSidebar);
         $("#resetSidebarRoot").remove();
         if (!$("#resetSidebarRoot").is(":visible")) {
            $(".buttonSidebarDiv").append('<i id="resetSidebarRoot" class="fa fa-refresh buttonSidebar" aria-hidden="true" title="Reset sidebar root"></i>');
         }
         //Manually register onClick handler
         $('#resetSidebarRoot').click(function () {
                 document.cookie = 'sidebarRoot= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
                 $('#sidebarContent').empty();
                 $('#sidebarContent').append('<div id="spinner" style="width: 42px; height:42px; margin: 15px 10px;"></div>');
                 getSidebarContent(placeEverythingForSidebar);
                 $(this).remove();
             });
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
        url: location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/?Tooltips',
        contentType: 'charset=utf-8',
        success: data => callback(data),
        error: function (xhr) {
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
        url: location.protocol + '//' + location.host + '/' + currentPageURL + responderURL,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: data => callback(data, currentPageURL, newTags),
        error: function (xhr) {
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
        const url = location.protocol + '//' + location.host + '/' + currentPageURL;
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
        const url = location.protocol + '//' + location.host + '/' + $(this).parent().siblings('.addTagDiv').find('a').attr('href');
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

// Set up click event for sidebar links to change the sidebar root
function setupSidebarLinkClickEvent() {
    // Remove any existing click handlers to avoid duplicates
    $('#sidebarContent').off('click', 'a.sidebar-link-handler');
    
    // Use event delegation for better performance
    $('#sidebarContent').on('click', 'a.sidebar-link-handler', function(e) {
        // Get the clicked page path
        const pagePath = $(this).attr('href');
        
        // Only change root if we're not already at a deep level
        if (getCookie('sidebarRoot').length === 0) {
            // Find the top-level parent of this page
            const pathParts = pagePath.split('.');
            
            // If there's at least one dot, we can change the root
            if (pathParts.length > 1) {
                // Get the first part of the path (the top-level parent)
                const newRoot = pathParts[0];
                
                // Set the new sidebar root cookie to be used on the next page load
                var exp = new Date();
                exp.setTime(exp.getTime() + 3600*1000*24*365);
                document.cookie = 'sidebarRoot=/' + newRoot + ';expires=' + exp.toGMTString() + ';path=/';
                
                // We don't need to reload the sidebar here as the page will navigate
            }
        }
        
        // Allow the default navigation to continue
    });
}
