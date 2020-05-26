// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
// Modified to adjust to FitNesse.org basic needs
// Extended version to use ?autoComplete responder (com.github.tcnh)

var autoCompleteJson;
var autocompletes = [];

function loadAutoCompletesFromResponder() {
    $('.navbar #spinner').show();
    $('.toggle-bar').hide();
    $('#closedContextHelp #spinner').show();
    $('#collapseCHelpDiv').hide();
    if (window.location.pathname.indexOf('ScenarioLibrary') !== -1
        || window.location.pathname.indexOf('SetUp') !== -1
        || window.location.pathname.indexOf('TearDown') !== -1
        || window.location.href.indexOf('?new') !== -1) {
        pageDataUrl = window.location.origin + '/' + getCookie('latestContext') + '?autoComplete';
    } else {
        pageDataUrl = window.location.pathname.split('?')[0] + '?autoComplete';
    }
    autocompletes = [];
    return $.ajax({
        dataType: 'json',
        url: pageDataUrl,
        async: true,
        cache: true,
        timeout: 20000,
        success: function (result) {
            autoCompleteJson = result;
            $.each(result.classes, function (cIndex, c) {
                $.each(c.constructors, function (constrIndex, constructor) {
                    autocompletes.push(constructor.usage.substring(2));
                });
                autocompletes.push(c.readableName);
                $.each(c.methods, function (mIndex, m) {
                    var methodEntry = m.usage.substring(2);
                    autocompletes.push(methodEntry);
                });
            });
            $.each(result.scenarios, function (sIndex, s) {
                var scenarioEntry = s.wikiText;
                autocompletes.push(scenarioEntry);
            });
            $.each(result.variables, function (vIndex, v) {
                autocompletes.push(v.varName);
            });
            $('.navbar #spinner').hide();
            $('.toggle-bar').show();
            $('#closedContextHelp #spinner').hide();
            $('#collapseCHelpDiv').show();
        },
        error: function () {
            console.log('Unable to retrieve page context from autoComplete Responder. Is it installed?');
        }
    });
}

(function (mod) {
    if (typeof exports == 'object' && typeof module == 'object') // CommonJS
        mod(require('../../codemirror'));
    else if (typeof define == 'function' && define.amd) // AMD
        define(['../../codemirror'], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function (CodeMirror) {
    'use strict';
    $('#spinner').show();
    var WORD = /([@>!$\w]\w*)([^|]*\|)?/, RANGE = 500;
    var autonames = [];
    var pageDataUrl = window.location.pathname + '?names';
    $.ajax({
        url: pageDataUrl,
        async: true,
        cache: true,
        timeout: 20000,
        success: function (result) {
            autonames = result.split(/\r?\n/);
        },
        error: function () {
            console.log('Error Accessing Child Page Names');
        }
    });

    loadAutoCompletesFromResponder();

    autonames.forEach(function (item, index, array) {
        autocompletes.push('>' + item);
    });

    autocompletes.push('script');
    autocompletes.push('debug script');
    autocompletes.push('storyboard');
    autocompletes.push('table template');
    autocompletes.push('conditional script');
    autocompletes.push('conditional scenario');
    autocompletes.push('looping scenario');
    autocompletes.push('!today');
    autocompletes.push('!today (dd-MM-yyyy)');
    autocompletes.push('!monday');
    autocompletes.push('!tuesday');
    autocompletes.push('!wednesday');
    autocompletes.push('!thursday');
    autocompletes.push('!friday');
    autocompletes.push('!saturday');
    autocompletes.push('!sunday');
    autocompletes.push('!randomBSN');
    autocompletes.push('!randomInt');
    autocompletes.push('!randomString');
    autocompletes.push('!randomEmail');
    autocompletes.push('!monthsFromToday');
    autocompletes.push('!lastDayOfMonth');
    autocompletes.push('!weekDaysFromToday');
    autocompletes.push('!define');
    autocompletes.push('!defineDefault');
    autocompletes.push('!defineFromProperties');
    autocompletes.push('!defineDefaultFromProperties');
    autocompletes.push('!randomIBAN');
    autocompletes.push('!randomPostalCode');
    autocompletes.push('!randomDutchLicensePlate');
    autocompletes.push('!randomUuid ');

    CodeMirror.registerHelper('hint', 'fitnesse_anyword', function (editor, options) {
        var word = options && options.word || WORD;
        var range = options && options.range || RANGE;
        var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
        var end = cur.ch, start = end;
        while (start && "|".indexOf(curLine.charAt(start - 1)) <0) --start;
        var curWord = start != end && curLine.slice(start, end).toLocaleLowerCase();

        var matches = new Set();

        function populateAutoCompletes() {
            const fuse = new Fuse(autocompletes);
            const options = {
              threshold: 0.0
            }
            const results = fuse.search(curWord, options);

            results.forEach(function (result) {
                matches.add(result.item);
                });
            }

        if(curWord.length > 0) {
            populateAutoCompletes();
        }
        var searchResults = Array.from(matches);
        return {list: searchResults, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
    });
});
