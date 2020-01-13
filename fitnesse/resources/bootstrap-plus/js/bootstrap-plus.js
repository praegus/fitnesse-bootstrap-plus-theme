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

   // Add hidden tag buttons upon entering overview page
    $(".test, .suite, .static").each(function() {
        $(this).after('<i class="fas fa-plus-circle addTag"></i>');
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

    // Add hover function to show add tag button
    $('.suite').parent().hover(
        function() {
            $(this).find('.addTag:first').css("visibility", "visible");
        }, function() {
            $(this).find('.addTag:first').css("visibility", "hidden");
        }
    );
    $('.static').parent().hover(
        function() {
            $(this).find('.addTag:first').css("visibility", "visible");
        }, function() {
            $(this).find('.addTag:first').css("visibility", "hidden");
        }
    );
    $('.test').parent().hover(
        function() {
            $(this).find('.addTag:first').css("visibility", "visible");
        }, function() {
            $(this).find('.addTag:first').css("visibility", "hidden");
        }
    );

    // Click add tag function
    $('.addTag').click(function() {
        //Remove all existing tag input fields
        $('.tagInputOverview').remove();
        //Add input field
        $(this).after('<input type="text" class="tagInputOverview">');
        $('.tagInputOverview').focus();
        //If "Enter" button is pressed
        $('.tagInputOverview').keyup(function(event) {
            if (event.keyCode == 13) {
                //Get current input value
                var inputValue = $('.tagInputOverview').val();
                //Call get current tag list function
                GetCurrentTagList($(this), inputValue);
            }
        });
    });

    //Get current tag list function
    function GetCurrentTagList(currentFile, newTags){
        //Get href value of the a tag
        var currentURL = currentFile.siblings('a').attr('href');

        //Get current tag list
        $.ajax({
            type: 'POST',
            url: "http://localhost:9090/" + currentURL,
            contentType: 'application/json; charset=utf-8',
            data : 'responder=tableOfContents',
            dataType: 'json',
            success: function(data){
                //Convert data object to string
                var currentTagList = data[0].tags.toString();
                //Convert input tags to lowercase
                var newTagsLowercase = newTags.toLowerCase();
                //Check if input tag exists in current tag list
                var checkIfExists = currentTagList.includes(newTagsLowercase);
                //If tag doesn't exist yet, post it
                if (checkIfExists === false){
                    //Combine the current tag list and the input tag(s) in 1 variable
                    var newTagList = currentTagList + ", " + newTagsLowercase;
                    //Send current href value, new tag list and input tag(s) to post tag function
                    postTag(currentURL, newTagList, newTagsLowercase);
                }
            }
        });
    }

    //Post new tag list function
    function postTag(currentURL, tagList, inputTag) {
        $.ajax({
            type: 'POST',
            url: "http://localhost:9090/" + currentURL,
            contentType: 'application/json; charset=utf-8',
            data : 'responder=updateTags&suites=' + tagList,
            dataType: 'json',
            success: function(data){
                //Add new tag span layout to page
                $("a[href$='" + currentURL + "']").after("<span class='tag'>" + inputTag + "</span>");
                //Remove input field
                $('.tagInputOverview').remove();
            }
        });
    }
});

