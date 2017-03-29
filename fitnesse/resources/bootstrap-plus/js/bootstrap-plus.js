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

$( document ).ready(function() {
   $(".test").each(function() {
        $(this).before('<i class="fa fa-cog icon-suite" aria-hidden="true"></i>&nbsp;');
   });
   $(".suite").each(function() {
        $(this).before('<i class="fa fa-cogs icon-test" aria-hidden="true"></i>&nbsp;');
   });
   $(".static").each(function() {
        $(this).before('<i class="fa fa-file-o icon-static" aria-hidden="true"></i>&nbsp;');
   });

   var showDefinitions = (function showDefinitions() {
        return function(){
            var cmEditor = $('.CodeMirror')[0].CodeMirror;
            var lineNr = cmEditor.doc.getCursor().line;
            var line = cmEditor.doc.getLine(lineNr);
            var firstCell = line.match(/[a-zA-Z0-9 _-]+/);
            if(!$(".side-bar").is(":visible")){
                $(".side-bar").slideToggle();
            }
            $('#filter').val(firstCell[0].trim());
            filterHelpList();
        };
   })();

   var insertAtCursor = (function insertAtCursor(line) {
           return function(){
               var cmEditor = $('.CodeMirror')[0].CodeMirror;
               var lineNr = cmEditor.doc.getCursor().line;
               var line = cmEditor.doc.getLine(lineNr);
               var firstCell = line.match(/[a-zA-Z0-9 _-]+/);
               if(!$(".side-bar").is(":visible")){
                   $(".side-bar").slideToggle();
               }
               $('#filter').val(firstCell[0].trim());
               filterHelpList();
           };
      })();


   //Get definition on SHIFT-ALT-D
   $(document).keydown(function (e) {
       var evtobj = window.event? event : e
       if (evtobj.keyCode == 68 && evtobj.altKey && evtobj.shiftKey) {
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

   function populateContext(){
       var helpList = "";
       var helpId = 0;
       helpList += '<input type="text" class="form-control" id="filter" placeholder="Filter...">';
       helpList += '<ol id="side-bar-tree" class="tree">';

        helpList += '<li class="coll closed"><label for="tree-scenarios">Scenario\'s</label>';
               helpList += '<input class="togglebox" type="checkbox" id="tree-scenarios" />';
               helpList += '<ol id="scenarios">'
                    $.each(autoCompleteJson.scenarios, function(sIndex, s) {
                         helpList += '<li class="coll closed">';
                         helpList += '<label class="filterIt" for="help-' + helpId + '">' + s.name.UcFirst() + '</label>';
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
            $.each(autoCompleteJson.classes, function(cIndex, c) {
                 helpList += '<li class="coll closed">';
                 helpList += '<label for="help-' + helpId + '">' + c.readableName.UcFirst() + '</label>';
                 helpList += '<input class="togglebox" type="checkbox" id="help-' + helpId + '" />';
                 helpId = helpId+1;
                 helpList += '<ol>';
                  $.each(c.availableMethods, function(mIndex, m) {
                        helpList += '<li class="item method"><span class="filterIt">' + m.name;
                        if(m.parameters) {
                            helpList += ' (' + m.parameters + ')';
                        }
                        helpList += '</span></li>';
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

