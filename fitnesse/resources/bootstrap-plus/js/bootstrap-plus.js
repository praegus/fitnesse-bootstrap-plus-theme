// Needed for Jest
try{
    module.exports = {
        getSidebarContent: getSidebarContent
    };
}catch (e) {}

String.prototype.UcFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


/**
 * [Gets the cookie value if the cookie key exists in the right format]
 * @param  {[string]} name [name of the cookie]
 * @return {[string]}      [value of the cookie]
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
    for(var i=0; i<str.length;i++) {
        if (str[i] === "[") {
            if (nesting == 0) { result += '<span class="symbol-data">'; }
            else { result += str[i]; }
            nesting++;
            inSymbol = true;
        }
        else if (str[i] === "]") {
            nesting--;

            if(nesting > 0) {
                result += str[i];
            } else if (inSymbol) {
                result += '</span>';
                inSymbol = false;
            }
        }
        else {
            result += str[i];
        }
    }
    return result.replace(/&lt;-|-&gt;/g, '');
}

/*
    DOCUMENT READY START
*/
$( document ).ready(function() {
   //If the first row is hidden, don't use header row styling
   $('tr.hidden').each(function() {
        $(this).next().addClass('slimRowColor0').removeClass('slimRowTitle');
   });
   $(".test").each(function() {
        $(this).before('<i class="fa fa-cog icon-suite" aria-hidden="true"></i>&nbsp;');
   });
   $(".suite").each(function() {
        $(this).before('<i class="fa fa-cogs icon-test" aria-hidden="true" title="show/hide"></i>&nbsp;');
   });
   $(".static").each(function() {
        $(this).before('<i class="fa fa-file-o icon-static" aria-hidden="true"></i>&nbsp;');
   });
   $('.contents li a').each(function() {
       var item = $(this)
       var orig = item.html();
       var tags = orig.match(/\((.*)\)/);
       if (tags) {
            var nwhtml = orig.replace(/\(.*\)/, '');
            item.html(nwhtml);
            var tagList = tags[1].split(', ');
            $.each(tagList, function(i, tag){
                var tagbadge = document.createElement("span");
                    tagbadge.setAttribute("class", "tag");
                    tagbadge.innerText = tag;
                item.after(tagbadge);
               });
       }
   });

    // Add hidden tag buttons upon entering overview page
    $(".test, .suite, .static").each(function () {
        $(this).wrap("<div class='addTagDiv'></div>");
        $(this).after('<i class="fas fa-plus-circle addTag"></i>');
    });

    //Do not use jQuery, as it rebuilds dom elements, breaking the failure nav

    [].forEach.call(document.getElementsByTagName('td'), cell => {
        if(cell.innerHTML.match(/((?![^<>]*>)\$[\w]+=?)/g)) {
             cell.innerHTML = cell.innerHTML.replace(/((?![^<>]*>)\$[\w]+=?)/g,'<span class="page-variable">$1</span>');
        }
        if(cell.innerHTML.match(/(\$`.+`)/g)) {
             cell.innerHTML = cell.innerHTML.replace(/(\$`.+`)/g, '<span class="page-expr">$1</span>');
        }
    });

   if(getCookie('collapseSymbols') == 'true') {
       $("td").contents().filter(function() {
            return this.nodeType == 3 && this.nodeValue.indexOf('->') >= 0 | this.nodeValue.indexOf('<-') >= 0; })
                .each( function(cell) {
                    if (this.parentNode != null && this.parentNode != undefined) {
                        this.parentNode.innerHTML = processSymbolData(this.parentNode.innerHTML);
                    }
                });

       $('.symbol-data').prev('.page-variable, .page-expr').each(function() {
            $(this).addClass('canToggle');
            $(this).addClass('closed');
       });

       $('.canToggle').click(function() {
            if($(this).hasClass('closed')) {
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


   $('#alltags').change(function() {
        if(this.checked) {
            $("#filtertags").attr('name', 'runTestsMatchingAllTags');
        } else {
            $("#filtertags").attr('name', 'runTestsMatchingAnyTag');
        }
   });

   $('.fa-cogs').click(function() {
        $(this).siblings('ul').toggle();
   });

    $('body').on('click', '#prefs-switch', function(e) {
           e.preventDefault();
           $('.settings-panel').toggle();
           }
      );

    $('body').on('click', '#theme-switch', function(e) {
           e.preventDefault();
           switchTheme();
           }
      );

    $('body').on('click', '#collapse-switch', function(e) {
           e.preventDefault();
           switchCollapse();
           }
      );

    $('body').on('click', '#autoSave-switch', function(e) {
               e.preventDefault();
               switchAutoSave();
               }
          );

    $('body').on('click', '#sidebar-switch', function(e) {
            e.preventDefault();
            switchSidebar();
        }
    );


    $('body').on('click', '.coll', function() {
                if($(this).children("input").is(":checked")) {
                    $(this).removeClass("closed");
                    $(this).addClass("open");
                } else {
                    $(this).removeClass("open");
                    $(this).addClass("closed");
                }
            });

    function switchTheme() {
        if(getCookie('themeType') == 'bootstrap-plus-dark') {
            document.cookie = "themeType=bootstrap-plus";
            $('link[href="/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus-dark.css"]').attr('href','/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus.css');
            $('#theme-switch').removeClass('fa-toggle-on');
            $('#theme-switch').addClass('fa-toggle-off');
        } else {
            document.cookie = "themeType=bootstrap-plus-dark";
            $('link[href="/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus.css"]').attr('href','/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus-dark.css');
            $('#theme-switch').removeClass('fa-toggle-off');
            $('#theme-switch').addClass('fa-toggle-on');
        }
    }

    function switchCollapse() {
            if(getCookie('collapseSymbols') == 'true') {
                document.cookie = "collapseSymbols=false";
                $('#collapse-switch').removeClass('fa-toggle-on');
                $('#collapse-switch').addClass('fa-toggle-off');
            } else {
                document.cookie = "collapseSymbols=true";
                $('#collapse-switch').removeClass('fa-toggle-off');
                $('#collapse-switch').addClass('fa-toggle-on');
            }
        }

    function switchAutoSave() {
            if(getCookie('autoSave') == 'true') {
                document.cookie = "autoSave=false";
                $('#autoSave-switch').removeClass('fa-toggle-on');
                $('#autoSave-switch').addClass('fa-toggle-off');
            } else {
                document.cookie = "autoSave=true";
                $('#autoSave-switch').removeClass('fa-toggle-off');
                $('#autoSave-switch').addClass('fa-toggle-on');
            }
        }

    function switchSidebar() {
        if(getCookie('sidebar') == 'true') {
            document.cookie = "sidebar=false";
            $('#sidebar-switch').removeClass('fa-toggle-on');
            $('#sidebar-switch').addClass('fa-toggle-off');
            $('#sidebar').addClass('displayNone');
        } else {
            document.cookie = "sidebar=true";
            $('#sidebar-switch').removeClass('fa-toggle-off');
            $('#sidebar-switch').addClass('fa-toggle-on');
            $('#sidebar').removeClass('displayNone');
            getSidebarContent();
        }
    }

    if (!location.pathname.includes('FrontPage') && getCookie('sidebar') == 'true') {
        getSidebarContent();
    }

    //Add hover function to type of page
    function tagButtonHover(pageType) {
        $('.' + pageType).parent().hover(
            function () {
                $(this).find('.addTag:first').css("visibility", "visible");
            }, function () {
                $(this).find('.addTag:first').css("visibility", "hidden");
            }
        );
    }

    tagButtonHover("test");
    tagButtonHover("static");
    tagButtonHover("suite");

    // Click add tag function
    $('.addTag').click(function () {
        addTagInput($(this));
    });
});
/*
    DOCUMENT READY END
*/

/*
    SIDEBAR FUNCTIONS START
*/
// Sidebar content
function getSidebarContent() {
    let currentWorkspace = location.pathname;
    if (currentWorkspace.includes('.')) {
        const strIndex = location.pathname.indexOf(".");
        console.log(strIndex);
        currentWorkspace = currentWorkspace.slice(0, strIndex);
    }
    $.ajax({
        type: 'GET',
        url: "http://" + location.host + currentWorkspace + "?responder=tableOfContents",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (contentArray) {
            placeSidebarContent(contentArray);

            $('#sidebarContent .fa-cogs').click(function() {
                $(this).parent().siblings('ul').toggle();
            });
        },
        error: function (xhr) {
            alert('An error ' + xhr.status + ' occurred. Look at the console (F12 or Ctrl+Shift+I) for more information.');
            console.log("Error code: " + xhr.status);
            console.log(xhr);
        }
    });
}

function placeSidebarContent(contentArray) {
    console.log(contentArray);
    // Empty sidebar content
    $('#sidebarContent').html("");

    contentArray.forEach(layerOne => {
        // Place the li in the html
        $('#sidebarContent').append(getSidebarContentHtml(layerOne));

        // If there are children
        if (layerOne.children) {
            sidebarContentLayerLoop(layerOne.name.replace(/\s/g,''), layerOne.children);
        }
    });
}

function sidebarContentLayerLoop(suiteName, children) {
    // Place new ul in the correct suite (li)
    $('#' + suiteName).append('<ul></ul>');

    // Loop through the children
    children.forEach(content => {
        // Place new li in the new made ul
        $('#' + suiteName).find('ul').first().append(getSidebarContentHtml(content));

        // If there are children
        if (content.children) {
            sidebarContentLayerLoop(content.name.replace(/\s/g,''), content.children)
        }
    });
}

// Generate the li for the html
function getSidebarContentHtml(content) {
    const iconClass = content.type.includes('suite') ? "fa fa-cogs icon-test" : content.type.includes('test') ? "fa fa-cog icon-suite": "fa fa-file-o icon-static";
    const prunedClass = content.type.includes('pruned') ? " pruned": "";
    const highlight = location.pathname == ('/' + content.path) ? 'id="highlight"' : '';

    const htmlContent =
        '<li id="' + content.name.replace(/\s/g,'') + '">' +
            '<div ' + highlight + '>' +
                '<i class="' + iconClass + '" aria-hidden="true" title="show/hide"></i>' +
                '&nbsp;' +
                '<a href="' + content.path + '" class="' + content.type + prunedClass + '">' + content.name + '</a>' +
            '</div>' +
        '</li>';
    return htmlContent;
}
/*
    SIDEBAR FUNCTIONS END
*/

function addTagInput(currentAddTagButton) {
    //Remove all existing tag input fields
    $('.tagInputOverview').remove();
    //Add input field
    $(currentAddTagButton).after('<input type="text" class="tagInputOverview">');

    //Add focus after clicking button
    $('.tagInputOverview').focus();

    $('.tagInputOverview').focusout(function () {
        $('.tagInputOverview').remove();
    });

    $('.tagInputOverview').keyup(function (event) {
        //If "Enter" button is pressed
        if (event.keyCode == 13) {
            //Get current input value & replace empty spaces at the start/end of input
            const inputValue = $('.tagInputOverview').val().trim();
            //Get href value of the a tag
            const currentURL = $(currentAddTagButton).siblings('a').attr('href');
            //Call get current tag list function
            GetCurrentTagList(currentURL, inputValue);
        }
    });
}

//Get current tag list function
function GetCurrentTagList(currentURL, newTags) {
    //Get current tag list
    $.ajax({
        type: 'GET',
        url: "http://" + location.host + "/" + currentURL + "?responder=tableOfContents",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            //Convert data object to string
            const currentTagList = data[0].tags.join(", ");
            //Convert input tags to lowercase
            const lowerCaseTags = newTags.toLowerCase();
            //Check if there are any tags currently present
            if (currentTagList.length > 0) {
                //Check if input tag exists in current tag list
                const checkIfExists = currentTagList.includes(lowerCaseTags);
                //If tag doesn't exist yet, post it
                if (checkIfExists === false) {
                    //Combine the current tag list and the input tag(s) in 1 variable
                    const newTagList = currentTagList + ", " + lowerCaseTags;
                    //Send current href value, new tag list and input tag(s) to post tag function
                    postTag(currentURL, newTagList, newTags);
                } else {
                    $('.tagInputOverview').css({
                        "border-color": "red",
                        "outline": "0"
                    });
                }
            }
            //If there are no tags present only post the input tags
            else {
                postTag(currentURL, lowerCaseTags, newTags);
            }
        },
        error: function (xhr) {
            alert('An error ' + xhr.status + ' occurred. Look at the console (F12 or Ctrl+Shift+I) for more information.');
            console.log("Error code: " + xhr.status);
            console.log(xhr);
        }
    });
}

//Post new tag list function
function postTag(currentURL, tagList, inputTag) {
    $.ajax({
        type: 'POST',
        url: "http://" + location.host + "/" + currentURL,
        contentType: 'application/json; charset=utf-8',
        data: 'responder=updateTags&suites=' + tagList,
        dataType: 'json',
        success: function (data) {
            //Add new tag span layout to page
            $("a[href$='" + currentURL + "']").parent().after("<span class='tag'>" + inputTag + "</span>");
            //Remove input field
            $('.tagInputOverview').remove();
        },
        error: function (xhr) {
            alert('An error ' + xhr.status + ' occurred. Look at the console (F12 or Ctrl+Shift+I) for more information.');
            console.log("Error code: " + xhr.status);
            console.log(xhr);
        }
    });
}