String.prototype.UcFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function filterHelpList() {
        // Declare variables
        var input, filter;
        input = document.getElementById('filter');
        filter = input.value.toUpperCase();
        $(".togglebox").each(function(){ $(this).prop('checked', false); });
        $("li.coll").each(function() {
            $(this).removeClass( 'open' );
            $(this).addClass( 'closed' );
            $(this).removeAttr( 'style' );
            });
        $(".filterIt").each(function() {
            var parents = $(this).parents("li.coll");
            $(this).parent("li").removeAttr( 'style' );
            if(!$(this).parent("li").hasClass("method")){
                $(this).parent("li").removeClass("open");
                $(this).parent("li").addClass("closed");
                }

            if(filter == ""){
                $(this).parent("li").removeAttr( 'style' );
                $(this).parent("li.coll").removeClass( 'open' );
                $(this).parent("li.coll").addClass( 'closed' );
            } else {
                if ($(this).text().toUpperCase().indexOf(filter) > -1){
                //expand if match
                    parents.each(function(){
                         $(this).children("input").each(function(){
                             $(this).prop('checked', true);
                             });
                         $(this).removeClass("closed");
                         $(this).addClass("open");
                         });
                    $(this).parent("li").show();
                } else {
                    var itemContainer = $(this).parent("li.coll");
                    itemContainer.children("input").prop('checked', false);
                    $(this).parent("li").removeAttr( 'style' );
                    $(this).parent("li").hide();
                }
            }
        });

        //hide all items that are not expanded
        if(filter != "") {
            $('input').each(function(){
            if(!$(this).is(':checked')){
                $(this).closest("li").hide();
                }
            });
        }
    }

function getCellValues(line) {
    var pattern = /([^|]+)/g;
    var match;
    var cells = [];
    do {
        match = pattern.exec(line);
        if (match) {
            cells.push(match[0]);
        }
    } while (match);
    return cells;
    }

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
        return result * sortOrder;
    }
}

var fitnesseWords = ['show', 'ensure', 'reject', 'check', 'check not', 'note'];

$( document ).ready(function() {
   $(".test").each(function() {
        $(this).before('<i class="fa fa-cog icon-suite" aria-hidden="true"></i>&nbsp;');
   });
   $(".suite").each(function() {
        $(this).before('<i class="fa fa-cogs icon-test" aria-hidden="true" title="show/hide"></i>&nbsp;');
   });
   $(".static").each(function() {
        $(this).before('<i class="fa fa-file-o icon-static" aria-hidden="true"></i>&nbsp;');
   });

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

   var showDefinitions = (function showDefinitions() {
        return function(){
            var cmEditor = $('.CodeMirror')[0].CodeMirror;
            var lineNr = cmEditor.doc.getCursor().line;
            var line = cmEditor.doc.getLine(lineNr);
            var lineCells = getCellValues(line);
            var offset = 0;
            var useCell = true;
            var searchString = '';
            var relevantCells = lineCells.length;
            if(fitnesseWords.includes(lineCells[0].trim())) {
                offset = 1;
                if(lineCells[0].trim().indexOf('check') > -1) {
                    relevantCells--;
                }
            }
            for (var i = (0 + offset); i < relevantCells; i++) {
                if(useCell == true ) {
                    searchString += lineCells[i].trim() + ' ';
                    useCell = false;
                } else {
                    useCell = true;
                }
            }
            if(!$(".side-bar").is(":visible")){
                $(".side-bar").slideToggle();
            }
            $('#filter').val(searchString.trim());
            filterHelpList();
        };
   })();





   //Get definition on SHIFT-ALT-D
   $(document).keydown(function (e) {
       var evtobj = window.event? event : e
       if (evtobj.keyCode == 68 && evtobj.altKey && evtobj.shiftKey) {
       e.preventDefault();
            if($(".toggle-bar").attr('populated') === undefined) {
                 populateContext();
            }
            showDefinitions();
       }
   });

   var delay = (function(){
     var timer = 0;
     return function(callback, ms){
       clearTimeout (timer);
       timer = setTimeout(callback, ms);
     };
   })();

    $('body').on('click', '.toggle-bar', function(e) {
           e.preventDefault();
           if($(".toggle-bar").attr('populated') === undefined) {
              populateContext();
           }
           $(".side-bar").slideToggle()
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

    $('body').on('keyup', '#filter', function() {
        delay(function(){
          filterHelpList();
        }, 600 );
    });

    $('body').on('click', '.insert', function() {
         var cmEditor = $('.CodeMirror')[0].CodeMirror;
         var textToInsert = $( this ).attr( 'insertText' );
         cmEditor.doc.replaceSelection(textToInsert + '\n');
    });

    $('body').on('click', '#clearFilter', function(e) {
               e.preventDefault();
               $('#filter').val('');
               filterHelpList();
          });

   function populateContext(){
       var helpList = "";
       var helpId = 0;
       helpList += '<input type="text" class="form-control" id="filter" placeholder="Filter...">&nbsp;<button class="fa fa-undo" id="clearFilter"></button>';
       helpList += '<ol id="side-bar-tree" class="tree">';

        helpList += '<li class="coll closed"><label for="tree-scenarios">Scenario\'s</label>';
               helpList += '<input class="togglebox" type="checkbox" id="tree-scenarios" />';
               helpList += '<ol id="scenarios">'
               var sortedScenarios = autoCompleteJson.scenarios.sort(dynamicSort("name"));
                    $.each(sortedScenarios, function(sIndex, s) {
                         helpList += '<li class="coll closed item">';
                         helpList += '<label class="filterIt" for="help-' + helpId + '"><span>' + s.name.UcFirst() + '</span></label>';
                         helpList += '<i class="fa fa-plus-circle insert" aria-hidden="false" insertText="|' + s.wikiText + '" title="' + s.name.UcFirst() + '"></i>';
                         helpList += '<input class="togglebox" type="checkbox" id="help-' + helpId + '" />';
                         helpList += '<ol>';
                         helpId = helpId+1;
                         helpList += '<li class="item scenario">';
                         helpList += s.html;
                         helpList += '</li>';
                         helpList += '</ol></li>';
                    });
                    helpList += '</ol>';
                    helpList += '</li>';

        helpList += '<li class="coll closed"><label for="tree-fixtures">Fixtures</label>';
           helpList += '<input class="togglebox" type="checkbox" id="tree-fixtures" />';
           helpList += '<ol id="fixtures">'
            var sortedClasses = autoCompleteJson.classes.sort(dynamicSort("readableName"));
            $.each(sortedClasses, function(cIndex, c) {
                 helpList += '<li class="coll closed">';
                 helpList += '<label for="help-' + helpId + '">' + c.readableName.UcFirst() + '</label>';
                 helpList += '<input class="togglebox" type="checkbox" id="help-' + helpId + '" />';
                 helpId = helpId+1;
                 helpList += '<ol>';
                 var sortedMethods = c.availableMethods.sort(dynamicSort("name"));
                  $.each(sortedMethods, function(mIndex, m) {
                        helpList += '<li class="item method"><span class="filterIt">' + m.name;
                        if(m.parameters) {
                            helpList += ' (' + m.parameters + ')';
                        }
                        helpList += '</span>';
                        helpList += '<i class="fa fa-plus-circle insert" aria-hidden="false" insertText="|' + m.wikiText + '" title="' + m.name + '"></i></li>';
                  });
                  helpList += '</ol></li>';
            });
            helpList += '</ol>';
            helpList += '</li>';

        helpList += '</ol>';

       $(".side-bar").append(helpList);
       $(".toggle-bar").attr('populated', 'true');
   }
});

