var signatureList = [];

function autoSave() {
    var cm = document.querySelector('.CodeMirror').CodeMirror;
    if ($('[name="responder"]').attr('value') == 'saveData' && !cm.doc.isClean()) {
        $('#pageContent').val(cm.doc.getValue());
        savePage($('[name="f"]').attr('action'));
        var warning = 'Autosave is enabled. To discard any changes, use the cancel button. ';
    } else if ($('[name="responder"]').attr('value') == 'addChild') {
        var warning = 'Autosave is enabled, but new pages need to be saved manually the first time!';
    }
    if (warning.length > 0) {
        $('#editorMessage').addClass('bootstrap-plus-warn');
        $('#editorMessage').text(warning);
    }
    return false;
}

function savePage(target) {
    $.ajax({
        url: target,
        type: 'POST',
        data: $('[name="f"]').serialize(),
        success: function (data) {
            document.querySelector('.CodeMirror').CodeMirror.doc.markClean();
            //Only reload helper if helper is closed
            if ($('#helper-bar').is(':hidden')) {
                $('.toggle-bar').removeAttr('populated');
                $('#collapseCHelpText').removeAttr('populated');
                $('.helper-content').remove();
                $.when(loadAutoCompletesFromResponder()).done(function (a) {
                    populateContext();
                });
            } else {
                setNewContextBadge();
            }

            if ($('.toggle-bar').attr('populated') === undefined && $('#collapseCHelpText').attr('populated') === undefined) {
                populateContext();
            }

            validateTestPage();
        }
    });
}

function filterHelpList() {
    // Declare variables
    var input, filter;
    input = document.getElementById('filter');
    filter = input.value.toUpperCase();
    $('.togglebox').each(function () {
        $(this).prop('checked', false);
    });
    $('li.coll').each(function () {
        $(this).removeClass('open');
        $(this).addClass('closed');
        $(this).removeAttr('style');
    });
    $('.filterIt').each(function () {
        var parents = $(this).parents('li.coll');
        $(this).parent('li').removeAttr('style');
        if (!$(this).parent('li').hasClass('method')) {
            $(this).parent('li').removeClass('open');
            $(this).parent('li').addClass('closed');
        }

        if (filter == '') {
            $(this).parent('li').removeAttr('style');
            $(this).parent('li.coll').removeClass('open');
            $(this).parent('li.coll').addClass('closed');
        } else {
            if ($(this).attr('title').toUpperCase().indexOf(filter) > -1) {
                //expand if match
                parents.each(function () {
                    $(this).children('input').each(function () {
                        $(this).prop('checked', true);
                    });
                    $(this).removeClass('closed');
                    $(this).addClass('open');
                });
                $(this).parent('li').show();
            } else {
                var itemContainer = $(this).parent('li.coll');
                itemContainer.children('input').prop('checked', false);
                $(this).parent('li').removeAttr('style');
                $(this).parent('li').hide();
            }
        }
    });

    //hide all items that are not expanded
    if (filter != '') {
        $('input').each(function () {
            if (!$(this).is(':checked')) {
                $(this).closest('li').hide();
            }
        });
    }
}

function getCellValues(line) {
    line = line.replace('||', '| |');
    var pattern = /(!-.+-!|[^|]+)/g;
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
    var sequentialArgs = false;
    var validate = false;
    var firstCell = lineCells[0].toLowerCase().trim();
    if (reservedWords.includes(firstCell) || firstCell.startsWith('script:') || (firstCell.startsWith('$') && firstCell.endsWith('='))) {
        offset = 1;
        if (firstCell.startsWith('check')) {
            relevantCells--;
        }
        if ((!firstCell.endsWith('=')) &&
            (firstCell.indexOf('table') > -1 ||
                firstCell.startsWith('import') ||
                firstCell.startsWith('library') ||
                firstCell.startsWith('start'))) {
            ignoreParams = true;
        }
        if ((!firstCell.endsWith('=')) &&
            (firstCell.startsWith('script') ||
                firstCell.endsWith('script') ||
                firstCell.startsWith('storyboard'))) {
            sequentialArgs = true;
        }
        if (firstCell.startsWith('script:')) {
            offset = 0;
            lineCells[0] = lineCells[0].split(':')[1].trim();
        }
    }
    if (!lineCells[0].trim() == '') {
        var underscoreScenario = false;
        for (var i = (0 + offset); i < relevantCells; i++) {
            if (useCell == true) {
                if (/\W_(?=\W|$)/.test(lineCells[i])) {
                    underscoreScenario = true;
                    lineCells[i] = lineCells[i].replaceAll(/\W_(?=\W|$)/, '');
                } else if (lineCells[i].trim().endsWith(';')) {
                    sequentialArgs = true;
                    lineCells[i] = lineCells[i].replaceAll(';', '');
                }
                result += lineCells[i].trim() + ' ';
                useCell = false;
            } else {
                if (!sequentialArgs) {
                    useCell = true;
                }
                if (!ignoreParams) {
                    if (underscoreScenario) {
                        params = params + lineCells[i].split(',').length;
                    } else {
                        params++;
                    }
                }
            }
        }
        if (returnParamCount) {
            result = result.trim();
            result += '#' + params;
        }
    }
    return result;
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
        return result * sortOrder;
    };
}

function indexesOf(string, regex) {
    var match,
        indexes = {};

    regex = new RegExp(regex);

    while (match = regex.exec(string)) {
        if (!indexes[match[0]]) indexes[match[0]] = [];
        indexes[match[0]].push(match.index);
    }

    return indexes;
}

function populateContext() {
    var helpList = '<div class="helper-content" >';
    var helpId = 0;
    helpList += '<input type="text" class="form-control" id="filter" placeholder="Filter...">&nbsp;<button class="fa fa-undo" id="clearFilter" title="Clear Filter"></button>&nbsp;<button class="fa fa-refresh" id="resync" title="Reload Context"></button>';
    helpList += '<ol id="side-bar-tree" class="tree">';

    helpList += '<li class="coll closed"><label for="tree-scenarios">Scenario\'s</label>';
    helpList += '<input class="togglebox" type="checkbox" id="tree-scenarios" />';
    helpList += '<ol id="scenarios">';
    var sortedScenarios = autoCompleteJson.scenarios.sort(dynamicSort('name'));
    $.each(sortedScenarios, function (sIndex, s) {
        helpList += '<li class="coll closed">';
        helpList += '<label for="help-' + helpId + '"><span>' + s.contexthelp + '</span></label>';
        helpList += '<i class="filterIt fa fa-plus-circle insert" aria-hidden="false" insertText="|' + s.wikiText + '" title="' + s.name.UcFirst() + '"></i>';
        helpList += '<input class="togglebox" type="checkbox" id="help-' + helpId + '" />';
        helpList += '<ol>';
        helpId = helpId + 1;
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
    helpList += '<ol id="fixtures">';
    var sortedClasses = autoCompleteJson.classes.sort(dynamicSort('readableName'));
    $.each(sortedClasses, function (cIndex, c) {
        helpList += '<li class="coll closed">';
        helpList += '<label for="help-' + helpId + '">' + c.readableName.UcFirst() + '</label>';
        helpList += '<input class="togglebox" type="checkbox" id="help-' + helpId + '" />';
        helpId = helpId + 1;
        helpList += '<ol>';
        helpList += '<li class="coll closed">';
        helpList += '<label class="constructors "for="help-' + helpId + '"><span><i>Constructors</i></span></label>';
        helpList += '<input class="togglebox" type="checkbox" id="help-' + helpId + '" />';
        helpId = helpId + 1;
        helpList += '<ol>';
        helpList += '<li class="item javadoc">';
        helpList += '<ul>';

        $.each(c.constructors, function (index, cstr) {
            signatureList.push(cstr.readableName.toLowerCase() + '#' + cstr.parameters.length);

            helpList += '<li class="docItem">';
            helpList += '<i class="filterIt fa fa-plus-circle insert" aria-hidden="false" insertText="' + cstr.usage + '" title="' + c.readableName + '"></i>';
            helpList += '<b>' + cstr.usage + '</b><br />';

            if (cstr.hasOwnProperty('docString') && cstr['docString']) {
                helpList += cstr.docString.replace(/(?:\r\n|\r|\n)/g, '<br>');
            }
            helpList += '</li>';

        });
        helpList += '</ul>';
        helpList += '</li>';
        helpList += '</ol>';
        helpList += '</li>';

        var sortedMethods = c.methods.sort(dynamicSort('name'));
        $.each(sortedMethods, function (mIndex, m) {
            var labelCss = '';
            if (m.annotations && m.annotations.includes('Deprecated')) {
                labelCss += 'deprecated';
            }

            helpList += '<li class="coll closed">';
            helpList += '<label class="' + labelCss + '" for="help-' + helpId + '"><span>' + m.contexthelp;

            helpList += '</span></label>';
            helpList += '<i class="filterIt fa fa-plus-circle insert" aria-hidden="false" insertText="' + m.usage + '" title="' + m.readableName + '"></i>';
            helpList += '<input class="togglebox" type="checkbox" id="help-' + helpId + '" />';
            helpId = helpId + 1;

            helpList += '<ol>';

            helpList += '<li class="item javadoc">';

            if (m.hasOwnProperty('docString') && m['docString']) {
                helpList += '<h5>Description:</h5>';
                helpList += m.docString.replace(/(?:\r\n|\r|\n)/g, '<br>');
                helpList += '<br />&nbsp;<br />';
            }
            if (m.hasOwnProperty('parameters') && m.parameters.length > 0) {
                helpList += '<h5>Parameters:</h5>';
                helpList += '<ul>';
                $.each(m.parameters, function (p, param) {
                    helpList += '<li class="docItem"><b>' + param.type + '</b>';
                    if (param.hasOwnProperty('name')) {
                        helpList += ' ' + param.name;
                        if (param.hasOwnProperty('description')) {
                            helpList += ': <i>' + param.description + '</i>';
                        }
                    }
                    helpList += '</li>';
                });
                helpList += '</ul><br />';
            }
            if (m.hasOwnProperty('returnType') && m['returnType']) {
                helpList += '<h5>Returns:</h5>';
                helpList += m.returnType;
                if (m.hasOwnProperty('returnDescription')) {
                    helpList += ': <i>' + m.returnDescription + '</i>';
                }
                helpList += '<br />';
            }
            if (m.hasOwnProperty('exceptions') && m.exceptions.length > 0) {
                helpList += '<h5>Throws:</h5>';
                helpList += '<ul>';
                $.each(m.exceptions, function (e, ex) {
                    helpList += '<li class="docItem">' + ex + '</li>';
                });
                helpList += '</ul>';
            }

            helpList += '</li>';
            helpList += '</ol>';

            if (m.parameters === undefined) {
                signatureList.push(m.readableName.toLowerCase().trim() + '#0');
            } else {
                signatureList.push(m.readableName.toLowerCase().trim() + '#' + m.parameters.length);
            }
            helpList += '</li>';
        });
        helpList += '</ol></li>';
    });
    helpList += '</ol>';
    helpList += '</li>';

    helpList += '<li class="coll closed"><label for="tree-symbols">Slim symbols</label>';
    helpList += '<input class="togglebox" type="checkbox" id="tree-symbols" />';
    helpList += '<ol id="slimSymbols">';
    var sortedSymbols = autoCompleteJson.variables.sort(dynamicSort('varName'));
    $.each(sortedSymbols, function (sIndex, s) {
        helpList += '<li class="coll closed">';
        helpList += '<label class="filterIt" for="help-' + helpId + '" title="' + s.varName + '"><span>' + s.varName + '</span></label>';
        helpList += '<input class="togglebox" type="checkbox" id="help-' + helpId + '" />';
        helpList += '<ol>';
        helpList += '<li class="item symbol" help-id="' + helpId + '">';
        helpList += '<span class="singleSymbolTableLine' + helpId + '">' + s.html + '</span>';
        ;
        helpList += '<span class="fullSymbolTable' + helpId + '" style="display: none">' + s.fullTable + '</span>';
        helpList += '</li>';
        helpList += '</ol></li>';
        helpId = helpId + 1;
    });
    helpList += '</ol>';
    helpList += '</li>';

    helpList += '</ol></div>';


    // Check if sidebar is on of off
    if ($('#closedContextHelp').length !== 0) {
        $('#contextHelpContent').html(helpList);
        $('#collapseCHelpText').attr('populated', 'true');
    } else {
        $('.side-bar').prepend(helpList);
        $('.toggle-bar').attr('populated', 'true');
    }

}

function validateTestPage() {
    $('.validate-badge').remove();
    var cm = $('.CodeMirror')[0].CodeMirror;
    var totalLines = cm.doc.size;
    var row = 0;
    var tableType = 'unknown';
    var noOfColumns;
    var msgs = 0;
    for (var i = 0; i < totalLines; i++) {
        cm.setGutterMarker(i, 'CodeMirror-lint-markers', null);
        var lineContent = cm.doc.getLine(i).trim();
        if (lineContent.startsWith('|') || lineContent.startsWith('!|') || lineContent.startsWith('-|') || lineContent.startsWith('-!|')) {
            //Treat as a table line
            if (row == 0) {
                //determine the table type
                var cleanLineContent = lineContent.replace(/([!-]*)(?=\|)/, '');
                var firstCellVal = getCellValues(cleanLineContent)[0].toLowerCase().trim();
                if (firstCellVal.startsWith('conditional')) {
                    tableType = 'conditional';
                } else if (firstCellVal.indexOf('script') > -1 ||
                    firstCellVal.indexOf('scenario') > -1 ||
                    firstCellVal.indexOf('storyboard') > -1 ||
                    firstCellVal == 'table template') {
                    tableType = 'script';
                } else if (firstCellVal.indexOf('query:') > -1) {
                    tableType = 'query';
                } else if (firstCellVal == 'import' || firstCellVal == 'library' || firstCellVal == 'comment') {
                    tableType = 'ignore';
                } else {
                    tableType = 'treatAsDT';
                }
            } else if (!lineContent.startsWith('|')) {
                var message = 'only the first row can start with ! or -';
                cm.setGutterMarker(i, 'CodeMirror-lint-markers', makeMarker(message, 'error'));
                msgs++;
                row++;
                continue;
            }
            if (!lineContent.endsWith('|')) {
                var message = 'Missing end pipe';
                cm.setGutterMarker(i, 'CodeMirror-lint-markers', makeMarker(message, 'error'));
                msgs++;
                row++;
                continue;
            } else {
                if (tableType == 'ignore') {
                    //ignore
                    cm.setGutterMarker(i, 'CodeMirror-lint-markers', null);
                    row++;
                    continue;
                } else if (tableType == 'script') {
                    //Script tables

                    lineContent = lineContent.replace(/([!-]*)(?=\|)/, '')
                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                    .replace(/([A-Z])([a-z])/g, ' $1$2')
                    .replace(/\ +/g, ' ').trim().toLowerCase();

                    var infoForLine = getInfoForLine(lineContent, true);
                    if (isCommentLine(lineContent)) {
                        cm.setGutterMarker(i, 'CodeMirror-lint-markers', null);
                        continue;
                    }

                    if (!signatureList.includes(infoForLine) && !infoForLine.startsWith('#')) {
                        var message = 'Unknown command: ' + infoForLine.split('#')[0] +
                            ' (' + infoForLine.split('#')[1] + ' parameters)';
                        cm.setGutterMarker(i, 'CodeMirror-lint-markers', makeMarker(message, 'warning'));
                        msgs++;
                        row++;
                        continue;
                    }
                } else if (tableType == 'conditional') {
                    if (row == 1) {
                        var cells = getCellValues(lineContent);
                        if (cells.length > 1) {
                            var message = 'First row of conditional script should have only one cell containing the condition.';
                            cm.setGutterMarker(i, 'CodeMirror-lint-markers', makeMarker(message, 'error'));
                            msgs++;
                        }
                        tableType = 'script';
                        row++;
                        continue;
                    }
                } else if (tableType == 'query') {
                    if (row == 0) {
                        var infoForLine = getInfoForLine(lineContent, true);
                        infoForLine = infoForLine.split(':')[1];
                        //Treat as a DT from next row (column count from row 1, etc)
                        tableType = 'treatAsDT';
                        if (!signatureList.includes(infoForLine) && !infoForLine.startsWith('#')) {
                            var message = 'Unknown command: ' + infoForLine.split('#')[0] +
                                ' (' + infoForLine.split('#')[1] + ' parameters)';
                            cm.setGutterMarker(i, 'CodeMirror-lint-markers', makeMarker(message, 'warning'));
                            msgs++;
                            row++;
                            continue;
                        }
                    }
                } else if (tableType == 'treatAsDT') {
                    var ignoreParams;
                    var map_of_maps;
                    //Decision tables/datadriven scenariotables/table templates
                    if (row == 0) {
                        ignoreParams = false;
                        map_of_maps = false;
                        if (isCommentLine(lineContent)) {
                            cm.setGutterMarker(i, 'CodeMirror-lint-markers', null);
                            continue;
                        }
                        //special cases
                        // DDT:/Table: etc.
                        if (/^\|\s?\w+(?:\s+)?:.*$/.test(lineContent)) {
                            ignoreParams = true;
                        }

                        //Map of maps fixture
                        if (lineContent.includes('map of maps fixture')) {
                            map_of_maps = true;
                        }

                        //Validate first line against context
                        lineContent = lineContent.replace(/([!-]*)(?=\|)/, '')
                        .replace(/[\w\s]+:/, '').replace(/([a-z])([A-Z])/g, '$1 $2')
                        .replace(/([A-Z])([a-z])/g, ' $1$2')
                        .replace(/\ +/g, ' ').trim().toLowerCase();

                        var infoForLine = getInfoForLine(lineContent, false);

                        //Get parameter count from next line in a DT
                        if (!ignoreParams) {
                            var paramCells = getCellValues(cm.doc.getLine(i + 1).trim());
                            infoForLine = infoForLine.trim() + '#' + paramCells.length;
                        } else {
                            infoForLine = infoForLine.trim() + '#0';
                        }
                        if (!signatureList.includes(infoForLine) && !infoForLine.startsWith('#')) {
                            var message = 'Unknown command: ' + infoForLine.split('#')[0] +
                                ' (' + infoForLine.split('#')[1] + ' parameters)';
                            cm.setGutterMarker(i, 'CodeMirror-lint-markers', makeMarker(message, 'warning'));
                            msgs++;
                            row++;
                            continue;
                        }
                    } else if (row == 1) {
                        //Get expected columncount for rest of table
                        if (isCommentLine(lineContent)) {
                            cm.setGutterMarker(i, 'CodeMirror-lint-markers', null);
                            continue;
                        }
                        var cells = getCellValues(lineContent);
                        noOfColumns = cells.length;
                        row++;
                        continue;
                    } else {
                        var message;
                        var type;
                        var msg = false;
                        //validate columncount
                        if (isCommentLine(lineContent)) {
                            cm.setGutterMarker(i, 'CodeMirror-lint-markers', null);
                            continue;
                        }

                        if (map_of_maps && !cm.doc.getLine(i + 1).startsWith('|')) {
                            var ok = true;
                            getCellValues(lineContent).forEach(function (cell) {
                                if (!(cell.trim().length == 0) && !(cell.trim().startsWith('$') && cell.trim().endsWith('='))) {
                                    message = 'Map of maps allows only symbol assignments in the final row.';
                                    type = 'warning';
                                    msg = true;
                                }
                            });
                        } else if (getCellValues(lineContent).length != noOfColumns) {
                            message = 'Column count is not equal to the first row\'s column number';
                            type = 'hint';
                            msg = true;
                        }
                        if (msg) {
                            cm.setGutterMarker(i, 'CodeMirror-lint-markers', makeMarker(message, type));
                            msgs++;
                        }

                        row++;
                        continue;
                    }
                }

                row++;
            }
            cm.setGutterMarker(i, 'CodeMirror-lint-markers', null);
        } else {
            row = 0;
            tableType = 'unknown';
            cm.setGutterMarker(i, 'CodeMirror-lint-markers', null);
        }
    }
    setvalidationBadge(msgs);
    return msgs;
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
    var marker = document.createElement('div');
    marker.setAttribute('class', 'CodeMirror-lint-marker-' + type);
    marker.setAttribute('title', msg);
    return marker;
}

function setvalidationBadge(messages) {
    if (messages == 0) {
        messages = '✓';
    }
    var badge = document.createElement('span');
    badge.setAttribute('class', 'validate-badge');
    badge.setAttribute('id', 'validate-badge');
    badge.innerHTML = messages;
    $('.button.validate').append(badge);
}

function setNewContextBadge() {
    var badge = document.createElement('span');
    badge.setAttribute('class', 'newContext-badge');
    badge.setAttribute('id', 'newContext-badge');
    badge.setAttribute('title', 'Document has changed since last context sync!');
    badge.innerHTML = '★';
    $('#resync').append(badge);
}

var reservedWords = ['script', 'debug script', 'conditional script', 'storyboard', 'comment', 'table',
    'scenario', 'conditional scenario', 'looping scenario', 'table template', 'show',
    'ensure', 'reject', 'check', 'check not', 'start', 'push fixture', 'pop fixture', '!', '-!', '-'];

$(document).ready(function () {
    var showDefinitions = (function showDefinitions() {
        return function () {
            var cmEditor = $('.CodeMirror')[0].CodeMirror;
            var lineNr = cmEditor.doc.getCursor().line;
            var line = cmEditor.doc.getLine(lineNr);
            var searchString = getInfoForLine(line, false);
            if (!$('#contextHelp').is(':visible')) {
                $('.side-bar').slideToggle();
            }
            $('#filter').val(searchString.trim());
            filterHelpList();
        };
    })();

    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    //Get definition on SHIFT-ALT-D or ctrl-comma
    $(document).keydown(function (e) {
        var evtobj = window.event ? event : e;
        //Get definition on SHIFT-ALT-D or ctrl-comma
        if ((evtobj.keyCode == 68 && evtobj.altKey && evtobj.shiftKey) || (evtobj.keyCode == 188 && evtobj.ctrlKey)) {
            e.preventDefault();

            if ($('.toggle-bar').attr('populated') === undefined && $('#collapseCHelpText').attr('populated') === undefined) {
                populateContext();
            }
            if($('#contextHelp').hasClass('displayNone')) {
                switchCollapseContextHelp();
            }
            showDefinitions();
        }
        //toggle  context helper on alt-2
        if ((evtobj.keyCode == 50 && evtobj.altKey)) {
            e.preventDefault();
            switchCollapseContextHelp();
            if ($('.toggle-bar').attr('populated') === undefined && $('#collapseCHelpText').attr('populated') === undefined) {
                populateContext();
            }
        }

        //Validate on ctrl dot
        if (evtobj.keyCode == 190 && evtobj.ctrlKey) {
            e.preventDefault();
            if ($('.toggle-bar').attr('populated') === undefined && $('#collapseCHelpText').attr('populated') === undefined) {
                populateContext();
            }
            validateTestPage();
        }
        //AutoSave on enter
        if (getCookie('autoSave') == 'true' && e.keyCode === 13) {
            autoSave();
        }
    });

    $('body').on('click', '.toggle-bar', function (e) {
            e.preventDefault();
            if ($('.toggle-bar').attr('populated') === undefined) {
                populateContext();
            }
            $('.side-bar').slideToggle();
        }
    );

    $('body').on('click', '#cancelEdit', function (e) {
        e.preventDefault();
        var location = $(this).attr('href');

        if ($('[name="responder"]').attr('value') == 'saveData' && getCookie('autoSave') == 'true') {
            $('#pageContent').val(document.originalContent);
            $.ajax({
                url: $('[name="f"]').attr('action'),
                type: 'POST',
                data: $('[name="f"]').serialize(),
                success: function (data) {
                    window.location.href = location;
                }
            });
        } else {
            window.location.href = location;
        }
    });

    $('body').on('keyup', '#filter', function () {
        delay(function () {
            filterHelpList();
        }, 600);
    });

    $('body').on('click', '.insert', function () {
        var cmEditor = $('.CodeMirror')[0].CodeMirror;
        var textToInsert = $(this).attr('insertText');
        cmEditor.doc.replaceSelection(textToInsert + '\n');
    });

    $('body').on('click', '#clearFilter', function (e) {
        e.preventDefault();
        $('#filter').val('');
        filterHelpList();
    });

    $('body').on('click', '#resync', function (e) {
        e.preventDefault();
        $('.toggle-bar').removeAttr('populated');
        $('#collapseCHelpText').removeAttr('populated');
        $('.helper-content').remove();
        $.when(loadAutoCompletesFromResponder()).done(function (a) {
            populateContext();
        });
    });

    $('body').on('click', '.validate', function () {
        if ($('.toggle-bar').attr('populated') === undefined && $('#collapseCHelpText').attr('populated') === undefined) {
            populateContext();
        }
        validateTestPage();
    });

    $('body').on('click', '.symbol', function () {
        var currentItem = $(this).attr('help-id');
        var variable = $('[for=\'help-' + currentItem + '\'').text();
        $('.singleSymbolTableLine' + currentItem).toggle();
        $('.fullSymbolTable' + currentItem).toggle();
        $('.fullSymbolTable' + currentItem + ' tr:contains(' + variable + '=)').addClass('side-bar-tr-highlight');
    });

    // Context help sidebar
    $('body').on('click', '#collapseCHelpDiv', function (e) {
            e.preventDefault();
            switchCollapseContextHelp();
            if ($('#collapseCHelpText').attr('populated') === undefined) {
                populateContext();
            }
        }
    );
});

function switchCollapseContextHelp() {
    if ($('#contextHelp').hasClass('displayNone')) {
        $('#collapseCHelpDiv').addClass('collapseCHelpDivColor');
        $('#contextHelp').removeClass('displayNone');
    } else {
        $('#collapseCHelpDiv').removeClass('collapseCHelpDivColor');
        $('#contextHelp').addClass('displayNone');
    }
}