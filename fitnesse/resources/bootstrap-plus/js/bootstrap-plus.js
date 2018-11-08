String.prototype.UcFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var signatureList = [];

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
    line = line.replace("||", "| |");
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

function getInfoForLine(line, returnParamCount) {
    var lineCells = getCellValues(line);
    var offset = 0;
    var useCell = true;
    var result = '';
    var params = 0;
    var relevantCells = lineCells.length;
    var ignoreParams = false;
    var validate = false;
    var firstCell = lineCells[0].toLowerCase().trim();
    if(reservedWords.includes(firstCell) || firstCell.startsWith("$")) {
            offset = 1;
            if(firstCell.indexOf('check') > -1) {
                relevantCells--;
            }
            if(firstCell.indexOf('script') > -1 ||
                firstCell.indexOf('storyboard') > -1 ||
                firstCell.indexOf('table') > -1 ||
                firstCell.indexOf('import') > -1 ||
                firstCell.indexOf('library') > -1||
                firstCell.indexOf('start') > -1) {
                ignoreParams = true;
            }
        }
    if(!lineCells[0].trim() == '') {
        for (var i = (0 + offset); i < relevantCells; i++) {
            if(useCell == true ) {
                result += lineCells[i].trim() + ' ';
                useCell = false;
            } else {
                useCell = true;
                if(!ignoreParams) {
                    params++;
                }
            }
        }
        if(returnParamCount) {
        result = result.trim();
        result += "#" + params}
    }
    return result;
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

var reservedWords = ['script', 'storyboard', 'comment', 'table', 'scenario', 'table template', 'show', 'ensure', 'reject', 'check', 'check not', 'start', 'push fixture', 'pop fixture', '!', '-!', '-'];

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
            var searchString = getInfoForLine(line, false);
            if(!$(".side-bar").is(":visible")){
                $(".side-bar").slideToggle();
            }
            $('#filter').val(searchString.trim());
            filterHelpList();
        };
   })();


   //Get definition on SHIFT-ALT-D or ctrl-comma
   $(document).keydown(function (e) {
       var evtobj = window.event? event : e;
       if ((evtobj.keyCode == 68 && evtobj.altKey && evtobj.shiftKey) || (evtobj.keyCode == 188 && evtobj.ctrlKey) ) {
       e.preventDefault();
            if($(".toggle-bar").attr('populated') === undefined) {
                 populateContext();
            }
            showDefinitions();
       }
   });

   //Validate on ctrl dot
      $(document).keydown(function (e) {
          var evtobj = window.event? event : e;
          if (evtobj.keyCode == 190 && evtobj.ctrlKey) {
          e.preventDefault();
               if($(".toggle-bar").attr('populated') === undefined) {
                    populateContext();
               }
               validateTestPage();
          }
      });

   var delay = (function(){
     var timer = 0;
     return function(callback, ms){
       clearTimeout (timer);
       timer = setTimeout(callback, ms);
     };
   })();

    $('body').on('click', '#theme-switch', function(e) {
               e.preventDefault();
               switchTheme();
               }
          );

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

    $('body').on('click', '#resync', function(e) {
         e.preventDefault();
         $('.toggle-bar').removeAttr('populated');
         $('.helper-content').remove()
         $.when(loadAutoCompletesFromResponder()).done(function(a){
             populateContext();
         })
    });

    $('body').on('click', '.validate', function() {
        if($(".toggle-bar").attr('populated') === undefined) {
             populateContext();
        }
        validateTestPage();
    });

    $('body').on('click', '.symbol', function() {
        var currentItem = $(this).attr('help-id');
        var variable = $("[for='help-" + currentItem + "'").text();
        $('.singleSymbolTableLine' + currentItem).toggle();
        $('.fullSymbolTable' + currentItem).toggle();
        $('.fullSymbolTable' + currentItem + ' tr:contains(' + variable + '=)').addClass('side-bar-tr-highlight');
    });

    function switchTheme() {
        if(localStorage.getItem('themeType') == 'dark') {
            localStorage.setItem('themeType', 'light');
            $('link[href="/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus-dark.css"]').attr('href','/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus.css');
        } else {
            localStorage.setItem('themeType', 'dark');
            $('link[href="/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus.css"]').attr('href','/files/fitnesse/bootstrap-plus/css/fitnesse-bootstrap-plus-dark.css');
        }
    }

    function isCommentLine(line) {
        var cells = getCellValues(line);
        if (cells[0].toLowerCase().trim().startsWith('#') ||
            cells[0].toLowerCase().trim().startsWith('*') ||
            cells[0].toLowerCase().trim() === '' ||
            cells[0].toLowerCase().trim() == 'note') {
            return true;
            }
        return false;
    }

    function makeMarker(msg, type) {
      var marker = document.createElement("div");
      marker.setAttribute("class", "CodeMirror-lint-marker-" + type);
      marker.setAttribute("title", msg)
      return marker;
    }

    function setvalidationBadge(messages) {
        if(messages == 0) {
            messages = "✓"
        }
        var badge = document.createElement("span");
        badge.setAttribute("class", "validate-badge");
        badge.setAttribute("id", "validate-badge");
        badge.innerHTML = messages;
        $(".button.validate").append(badge);
    }

    function validateTestPage() {
     $(".validate-badge").remove();
        var cm = $('.CodeMirror')[0].CodeMirror;
        var totalLines = cm.doc.size;
        var row = 0;
        var tableType = 'unknown';
        var noOfColumns;
        var msgs = 0;
        for (var i = 0; i < totalLines; i++) {
            var lineContent = cm.doc.getLine(i).trim();
            if(lineContent.startsWith("|") || lineContent.startsWith("!|") || lineContent.startsWith("-|") || lineContent.startsWith("-!|")) {
                  //Treat as a table line
                  if(row == 0) {
                       //determine the table type
                       var cleanLineContent = lineContent.replace(/([!-]*)(?=\|)/, '');
                       var firstCellVal = getCellValues(cleanLineContent)[0].toLowerCase().trim();
                       if(firstCellVal.indexOf('script') > -1 ||
                          firstCellVal.indexOf('scenario') > -1 ||
                          firstCellVal.indexOf('storyboard') > -1 ||
                          firstCellVal == 'table template') {
                            tableType = "script";
                       } else if(firstCellVal == 'import' || firstCellVal == 'library' || firstCellVal == 'comment') {
                          tableType = "ignore";
                       } else {
                          tableType = "treatAsDT";
                       }
                  } else if (!lineContent.startsWith("|")) {
                       var message = "only the first row can start with ! or -"
                       cm.setGutterMarker(i, "CodeMirror-lint-markers", makeMarker(message, "error"));
                       msgs++;
                       row++;
                       continue;
                  }
                  if(!lineContent.endsWith("|")) {
                       var message = "Missing end pipe"
                       cm.setGutterMarker(i, "CodeMirror-lint-markers", makeMarker(message, "error"));
                       msgs++;
                       row++;
                       continue;
                  } else {
                        if(tableType == "ignore") {
                            //ignore
                            cm.setGutterMarker(i, "CodeMirror-lint-markers", null);
                            row++;
                            continue;
                        } else if(tableType == "script") {
                            //Script tables
                            lineContent = lineContent.replace(/([!-]*)(?=\|)/, '')
                                .replace(/([a-z])([A-Z])/g, '$1 $2')
                                .replace(/([A-Z])([a-z])/g, ' $1$2')
                                .replace(/\ +/g, ' ').trim().toLowerCase();

                            //lineContent = lineContent.replace(/([A-Z])/g, " $1" ).trim().toLowerCase();
                            //lineContent = lineContent.replace(/ +(?= )/g,'');
                            var infoForLine = getInfoForLine(lineContent, true)
                            if(isCommentLine(lineContent)) {
                                cm.setGutterMarker(i, "CodeMirror-lint-markers", null);
                                continue;
                            }
                            if(!signatureList.includes(infoForLine) && !infoForLine.startsWith("#")) {
                                var message = "Unknown command: " + infoForLine.split("#")[0] +
                                                " (" + infoForLine.split("#")[1] + " parameters)";
                               cm.setGutterMarker(i, "CodeMirror-lint-markers", makeMarker(message, "warning"));
                               msgs++;
                               row++;
                               continue;
                            }
                        } else if (tableType == "treatAsDT") {
                            //Decision tables/datadriven scenariotables
                            if(row == 0) {
                            //Validate first line against context
                                lineContent = lineContent.replace(/([!-]*)(?=\|)/, '')
                                        .replace(/[\w\s]+:/, '') .replace(/([a-z])([A-Z])/g, '$1 $2')
                                        .replace(/([A-Z])([a-z])/g, ' $1$2')
                                        .replace(/\ +/g, ' ').trim().toLowerCase();
                                if(isCommentLine(lineContent)) {
                                    cm.setGutterMarker(i, "CodeMirror-lint-markers", null);
                                    continue;
                                }
                                var infoForLine = getInfoForLine(lineContent, true)
                                //ignore parameters for DT
                                infoForLine = infoForLine.replace(/#\d+$/, "#0");
                                if(!signatureList.includes(infoForLine) && !infoForLine.startsWith("#")) {
                                    var message = "Unknown command: " + infoForLine.split("#")[0] +
                                                    " (" + infoForLine.split("#")[1] + " parameters)";
                                   cm.setGutterMarker(i, "CodeMirror-lint-markers", makeMarker(message, "warning"));
                                   msgs++;
                                   row++;
                                   continue;
                                }
                            } else if(row == 1) {
                            //Get expected columncount for rest of table
                                if(isCommentLine(lineContent)) {
                                    cm.setGutterMarker(i, "CodeMirror-lint-markers", null);
                                    continue;
                                }
                                var cells = getCellValues(lineContent);
                                noOfColumns = cells.length;
                                row++;
                                continue;
                            } else {
                            //validate columncount
                                if(isCommentLine(lineContent)) {
                                    cm.setGutterMarker(i, "CodeMirror-lint-markers", null);
                                    continue;
                                }
                                if(getCellValues(lineContent).length != noOfColumns) {
                                   var message = "Column count is not equal to the first row's column number)";
                                   cm.setGutterMarker(i, "CodeMirror-lint-markers", makeMarker(message, "hint"));
                                   msgs++;
                                   row++;
                                   continue;
                                }
                            }
                        }
                        row++;
                  }
                  cm.setGutterMarker(i, "CodeMirror-lint-markers", null);
            } else {
                row = 0;
                tableType = "unknown";
                cm.setGutterMarker(i, "CodeMirror-lint-markers", null);
            }
        }
        setvalidationBadge(msgs);
   }

   function populateContext(){
       var helpList = "<div class=\"helper-content\" >";
       var helpId = 0;
       helpList += '<input type="text" class="form-control" id="filter" placeholder="Filter...">&nbsp;<button class="fa fa-undo" id="clearFilter" title="Clear Filter"></button>&nbsp;<button class="fa fa-refresh" id="resync" title="Reload Context"></button>';
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
                         signatureList.push(s.name
                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                            .replace(/([A-Z])([a-z])/g, ' $1$2')
                            .replace(/\ +/g, ' ')
                            .toLowerCase().trim() + '#' + s.parameters.length);
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
                 signatureList.push(c.readableName.toLowerCase() + '#0');
                 var sortedMethods = c.availableMethods.sort(dynamicSort("name"));
                  $.each(sortedMethods, function(mIndex, m) {
                        helpList += '<li class="item method"><span class="filterIt">' + m.name;
                        if(m.parameters) {
                            helpList += ' (' + m.parameters + ')';
                        }
                        helpList += '</span>';
                        helpList += '<i class="fa fa-plus-circle insert" aria-hidden="false" insertText="|' + m.wikiText + '" title="' + m.name + '"></i></li>';
                        if(m.parameters === undefined) {
                            signatureList.push(m.name.toLowerCase().trim() + '#0');
                        } else {
                            signatureList.push(m.name.toLowerCase().trim() + '#' + m.parameters.length);
                        }
                  });
                  helpList += '</ol></li>';
            });
            helpList += '</ol>';
            helpList += '</li>';

        helpList += '<li class="coll closed"><label for="tree-symbols">Slim symbols</label>';
                       helpList += '<input class="togglebox" type="checkbox" id="tree-symbols" />';
                       helpList += '<ol id="slimSymbols">'
                       var sortedSymbols = autoCompleteJson.variables.sort(dynamicSort("varName"));
                            $.each(sortedSymbols, function(sIndex, s) {
                                 helpList += '<li class="coll closed item">';
                                 helpList += '<label class="filterIt" for="help-' + helpId + '"><span>' + s.varName + '</span></label>';
                                 helpList += '<input class="togglebox" type="checkbox" id="help-' + helpId + '" />';
                                 helpList += '<ol>';
                                 helpList += '<li class="item symbol" help-id="' + helpId + '">';
                                 helpList += '<span class="singleSymbolTableLine' + helpId + '">' + s.html + '</span>';;
                                 helpList += '<span class="fullSymbolTable' + helpId + '" style="display: none">' + s.fullTable + '</span>';
                                 helpList += '</li>';
                                 helpList += '</ol></li>';
                                 helpId = helpId+1;
                            });
                            helpList += '</ol>';
                            helpList += '</li>';

        helpList += '</ol></div>';

       $(".side-bar").prepend(helpList);
       $(".toggle-bar").attr('populated', 'true');
   }

});

