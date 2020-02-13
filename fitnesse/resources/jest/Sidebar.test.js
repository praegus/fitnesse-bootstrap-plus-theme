jest.mock('jquery');

beforeEach(() => jest.resetModules());

/*
 getSidebarContent
 */
it('Test if $.ajax has the correct params', () => {
    const $ = require('jquery');
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const dummyCallback = () => {
    };
    const expectedResult = {
        type: 'GET',
        url: expect.stringContaining('?responder=tableOfContents'),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: expect.any(Function),
        error: expect.any(Function)
    };

    jsfile.getSidebarContent(dummyCallback);

    // Now make sure that $.ajax was properly called
    expect($.ajax).toBeCalledWith(expectedResult);
});

it('Test the callback when $.ajax request is finished if the result is correct', () => {
    const $ = require('jquery');
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const callback = jest.fn();
    const expectedResult = require('./mockup-data/SidebarData');

    jsfile.getSidebarContent(callback);
    // Emulate the process by wich `$.ajax` would execute its own
    $.ajax.mock.calls[0 /*first call*/][0 /*first argument*/].success(expectedResult);
    const receivedResult = callback.mock.calls[0][0];

    expect(receivedResult).toEqual(expectedResult);
});

/*
 getMainWorkSpace
 */
it('Test if input "TestSuiteDemo.FrontEndTests" will return main work space "TestSuiteDemo"', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const expectedResult = 'TestSuiteDemo';

    const receivedResult = jsfile.getMainWorkSpace('TestSuiteDemo.FrontEndTests');

    expect(receivedResult).toEqual(expectedResult);
});

it('Test if input "TestSuiteDemo." will return main work space "TestSuiteDemo"', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const expectedResult = 'TestSuiteDemo';

    const receivedResult = jsfile.getMainWorkSpace('TestSuiteDemo.');

    expect(receivedResult).toEqual(expectedResult);
});

it('Test if input "TestSuiteDemo" will return main work space "TestSuiteDemo"', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const expectedResult = 'TestSuiteDemo';

    const receivedResult = jsfile.getMainWorkSpace('TestSuiteDemo');

    expect(receivedResult).toEqual(expectedResult);
});

/*
 placeSidebarContent
 */
it('Test if the recursion will return the correct html structure', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const sidebarData = require('./mockup-data/SidebarData');
    const neededHtml = '<ul id="sidebarContent"></ul>';
    const expected = {
        contain1: '<ul><li id="TestSuiteDemoBackEndTests">',
        contain2: '<ul><li id="TestSuiteDemoBackEndTestsT001AddCoursesByServiceCall">',
        contain3: '</ul></li><li id="TestSuiteDemoFrontEndTests">',
        contain4: '</ul></li><li id="TestSuiteDemoScenarioLibrary">',
        notContain1: '</div></li><li id="TestSuiteDemoFrontEndTests">',
        notContain2: '</ul><li id="TestSuiteDemoFrontEndTests">'
    };

    document.body.innerHTML = neededHtml;
    jsfile.placeSidebarContent(sidebarData);
    const receivedResult = document.getElementById('TestSuiteDemo').innerHTML;

    // Check if al the expections are true
    expect(receivedResult).toContain(expected.contain1);
    expect(receivedResult).toContain(expected.contain2);
    expect(receivedResult).toContain(expected.contain3);
    expect(receivedResult).toContain(expected.contain4);
    expect(receivedResult).not.toContain(expected.notContain1);
    expect(receivedResult).not.toContain(expected.notContain2);
});

/*
 getSidebarContentHtml
 */
it('Test if data input returns the correct html code', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const sidebarData = require('./mockup-data/SidebarData');
    const expectedResult =
        '<li id="TestSuiteDemo">' +
        '<div>' +
        '<i class="iconToggle iconWidth fa fa-angle-right" aria-hidden="true" title="show/hide"></i>' +
        '&nbsp;' +
        '<i class="fa fa-cogs icon-test" aria-hidden="true"></i>' +
        '&nbsp;' +
        '<a href="TestSuiteDemo" class="suite">Test Suite Demo</a>' +
        '</div>' +
        '</li>';

    const receivedResult = jsfile.getSidebarContentHtml(sidebarData[0]);

    expect(receivedResult).toEqual(expectedResult);
});


/*
 toggleIconClickEvent
 */
it('Test if the toggle icon will have a click function', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const sidebarData = require('./mockup-data/SidebarData');
    const neededHtml = '<ul id="sidebarContent"></ul>';

    document.body.innerHTML = neededHtml;
    jsfile.placeSidebarContent(sidebarData);
    jsfile.toggleIconClickEvent();
    const receivedResult = $('#sidebarContent .iconToggle');

    expect(Object.entries(receivedResult[0]).length).toBeGreaterThan(0);
});

/*
 collapseSidebarIcons
 */
it('Test if every toggle collapse expect the route you are in', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const sidebarData = require('./mockup-data/SidebarData');
    const path = '/TestSuiteDemo.FrontEndTests.PageObjects';
    const neededHtml = '<ul id="sidebarContent"></ul>';
    const expectedDisplayNone = '<ul style="display: none;">';
    const expectedDisplayBlock = '<ul style="display: block;">';

    document.body.innerHTML = neededHtml;
    jsfile.placeSidebarContent(sidebarData);
    jsfile.collapseSidebarIcons(path);
    const receivedBackEndTest = document.getElementById('TestSuiteDemoBackEndTests').innerHTML;
    const receivedFrontEndTest = document.getElementById('TestSuiteDemoFrontEndTests').innerHTML;

    expect(receivedBackEndTest).toContain(expectedDisplayNone);
    expect(receivedFrontEndTest).toContain(expectedDisplayBlock);
    expect(receivedFrontEndTest).not.toContain(expectedDisplayNone);
});

/*
 expandSidebarIcons
 */
it('Test if every toggle is expand', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const sidebarData = require('./mockup-data/SidebarData');
    const neededHtml = '<ul id="sidebarContent"></ul>';
    const expectedResult = '<ul style="display: none;">';

    document.body.innerHTML = neededHtml;
    jsfile.placeSidebarContent(sidebarData);
    jsfile.expandSidebarIcons();
    const receivedResult = document.getElementById('sidebarContent').innerHTML;

    expect(receivedResult).not.toContain(expectedResult);
});

it('Test if every toggle icon is expand', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const sidebarData = require('./mockup-data/SidebarData');
    const neededHtml = '<ul id="sidebarContent"></ul>';
    const expectedResult = 'fa-angle-right';

    document.body.innerHTML = neededHtml;
    jsfile.placeSidebarContent(sidebarData);
    jsfile.expandSidebarIcons();
    const receivedResult = document.getElementById('sidebarContent').innerHTML;

    expect(receivedResult).not.toContain(expectedResult);
});
