jest.mock('jquery');

beforeEach(() => jest.resetModules());


it('Test if data input returns the correct html code', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const sidebarData = require('./mockup-data/SidebarData');
    const expectedResult =
        '<li id="TestSuiteDemo">' +
        '<div>' +
        '<i class="fa fa-cogs icon-test" aria-hidden="true" title="show/hide"></i>' +
        '&nbsp;' +
        '<a href="TestSuiteDemo" class="suite">Test Suite Demo</a>' +
        '</div>' +
        '</li>';

    const receivedResult = jsfile.getSidebarContentHtml(sidebarData[0]);

    expect(receivedResult).toEqual(expectedResult);
});

it('Test if input "TestSuiteDemo.FrontEndTests" will return main work space "TestSuiteDemo"', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const expectedResult = 'TestSuiteDemo';

    const receivedResult = jsfile.getCurrentWorkSpace('TestSuiteDemo.FrontEndTests');

    expect(receivedResult).toEqual(expectedResult);
});

it('Test if input "TestSuiteDemo." will return main work space "TestSuiteDemo"', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const expectedResult = 'TestSuiteDemo';

    const receivedResult = jsfile.getCurrentWorkSpace('TestSuiteDemo.');

    expect(receivedResult).toEqual(expectedResult);
});

it('Test if input "TestSuiteDemo" will return main work space "TestSuiteDemo"', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const expectedResult = 'TestSuiteDemo';

    const receivedResult = jsfile.getCurrentWorkSpace('TestSuiteDemo');

    expect(receivedResult).toEqual(expectedResult);
});

it('Test if the recursion will return the correct html structure', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const sidebarData = require('./mockup-data/SidebarData');
    const neededHtml = '<ul id="sidebarContent"></ul>';
    // Check the correct order of the string
    const expectedContain1 = '<ul><li id="BackEndTests">';
    const expectedContain2 = '<ul><li id="T001AddCoursesByServiceCall">';
    const expectedContain3 = '</ul></li><li id="FrontEndTests">';
    const expectedContain4 = '</ul></li><li id="ScenarioLibrary">';
    const expectedNotContain1 = '</div></li><li id="FrontEndTests">';
    const expectedNotContain2 = '</ul><li id="FrontEndTests">';

    document.body.innerHTML = neededHtml;
    jsfile.placeSidebarContent(sidebarData);
    const receivedResult = document.getElementById('TestSuiteDemo').innerHTML;

    // Check if al the expections are true
    expect(receivedResult).toContain(expectedContain1);
    expect(receivedResult).toContain(expectedContain2);
    expect(receivedResult).toContain(expectedContain3);
    expect(receivedResult).toContain(expectedContain4);
    expect(receivedResult).not.toContain(expectedNotContain1);
    expect(receivedResult).not.toContain(expectedNotContain2);
});

it('Test if the suite icon will have a click function', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const sidebarData = require('./mockup-data/SidebarData');
    const neededHtml = '<ul id="sidebarContent"></ul>';

    document.body.innerHTML = neededHtml;
    jsfile.placeSidebarContent(sidebarData);
    const receivedResult = $('#sidebarContent .fa-cogs');

    expect(Object.entries(receivedResult[0]).length).toBeGreaterThan(0);
});
