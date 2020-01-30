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

    //This is for testHistoryChecker
    if ((location.pathname === '/FrontPage' || location.pathname === '/' ) && !location.search.includes('?')) {
        getPageHistory('http://localhost:9090/?testHistory&format=sorted', generateTestHistoryTable);
    }

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
});

function getPageHistory(url, callback ) {
    // Needed for unit testing
    // const $ = require('jquery');
    $.ajax({
        type: 'GET',
        url: url,
        contentType: 'charset=utf-8',
        success: data => callback(data),
        error: function (xhr) {
            alert('An error ' + xhr.status + ' occurred. Look at the console (F12 or Ctrl+Shift+I) for more information.');
            console.log("Error code: " + xhr.status, xhr);
        }
    });
}

function generateTestHistoryTable(data) {
        var check = document.getElementById("testHistoryTable");
        if (check !== undefined){
            var parser = new DOMParser();
            var parserhtml = parser.parseFromString(data, 'text/xml');
            var table = parserhtml.getElementsByTagName("table")[0];
            var rows = table.getElementsByTagName("tr");
            var resultsReportTd = rows[0].childNodes[9];
            // set colspan
            resultsReportTd.innerText = "Last 5 Results";
            resultsReportTd.setAttribute("colspan",5);

            if(rows.length > 5){
                var rowNumberToSlice = rows.length - 5;
                $(rows,"tr").slice(-rowNumberToSlice).remove();
            }
            for (var i = 1; i < rows.length; i++){
                var cells = rows[i].getElementsByTagName("td");
                if (cells.length > 9){
                    var colNumberToSlice = cells.length - 9;
                    $(cells, "td").slice(-colNumberToSlice).remove();
                }
            }
            check.appendChild(table);
        }
        return table;
}
try {
    module.exports = {
        generateTestHistoryTable: generateTestHistoryTable,
        getPageHistory : getPageHistory
    };
} catch (e) {
}
