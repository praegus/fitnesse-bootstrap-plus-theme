// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
// Modified to adjust to FitNesse.org basic needs
var autoCompleteJson;

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  $("#spinner").show();
  var WORD = /([@>!$\w]\w*)([^|]*\|)?/, RANGE = 500;
  var autonames = [];
  var autocompletes = [];
  var pageDataUrl = window.location.pathname + "?names";
      $.ajax({
        url: pageDataUrl,
		async: true,
        cache: true,
        timeout: 20000,
        success: function(result) {
		    autonames = result.split(/\r?\n/);
        },
        error: function() {
          console.log("Error Accessing Child Page Names");
        }
      });

	if(window.location.pathname.indexOf("ScenarioLibrary") !== -1) {
	    var referrer = document.referrer;
	    if (referrer.slice(-1) == '?') {
	        referrer = referrer.slice(0, -1);
	        }
	    pageDataUrl = referrer + "?autoComplete";
	} else {
        pageDataUrl = window.location.pathname + "?autoComplete";
	}
      $.ajax({
        dataType: "json",
        url: pageDataUrl,
		async: true,
        cache: true,
        timeout: 20000,
        success: function(result) {
        autoCompleteJson = result;
            $.each(result.classes, function(cIndex, c) {
             autocompletes.push(c.readableName);
             $.each(c.availableMethods, function(mIndex, m) {
                var methodEntry = m.wikiText;
                autocompletes.push(methodEntry);
                });
             });
		     $.each(result.scenarios, function(sIndex, s) {
		     var scenarioEntry = s.wikiText;
                autocompletes.push(scenarioEntry);
		     });
		     $.each(result.variables, function(vIndex, v) {
		      autocompletes.push(v);
		     });
		     $("#spinner").remove();
		     $('.toggle-bar').show();
        },
        error: function() {
          console.log("Error Accessing Page Content from autoComplete Responder. Is it installed? See https://github.com/tcnh/FitNesseAutocompleteResponder");
        }
      });

  CodeMirror.registerHelper("hint", "fitnesse_anyword", function(editor, options) {
    var word = options && options.word || WORD;
    var range = options && options.range || RANGE;
    var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
    var end = cur.ch, start = end;
    while (start && word.test(curLine.charAt(start - 1))) --start;
    var curWord = start != end && curLine.slice(start, end).toLocaleLowerCase();


    var list = options && options.list || [], seen = {};
	function addIfMatch(newWord){
          if ((!curWord || newWord.toLocaleLowerCase().lastIndexOf(curWord, 0) == 0) && !seen.hasOwnProperty(newWord)) {
            seen[newWord] = true;
            list.push(newWord);
          }
	}


    var re = new RegExp(word.source, "g");
    for (var dir = -1; dir <= 1; dir += 2) {
      var line = cur.line, endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
      for (; line != endLine; line += dir) {
        var text = editor.getLine(line), m;
        while (m = re.exec(text)) {
			//Don't match myself
			if (line == cur.line && m.index == start) continue;
			addIfMatch(m[0]);
        }
      }
    }

	autonames.forEach(function (item, index, array) {
		addIfMatch(">" + item);
	});
	autocompletes.forEach(function (item, index, array) {
		addIfMatch(item);
	});

    return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
  });
});
