jest.mock('jquery');

beforeEach(() => jest.resetModules());
/*
    ADD TAGS TESTS START
*/
// createTagInput
it('Test if the tag input element will show up', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHtml =
        '<div id="addTagDiv">' +
            '<a href="TestSuiteDemo.FrontEndTests.SuiteTearDown" class="static">Suite Tear Down </a>' +
            '<i id="addTagButton" class="fas fa-plus-circle addTag"></i>' +
        '</div>';
    const expectedValue =
        '<div id="addTagDiv">' +
            '<a href="TestSuiteDemo.FrontEndTests.SuiteTearDown" class="static">Suite Tear Down </a>' +
            '<i id="addTagButton" class="fas fa-plus-circle addTag"></i>' +
                '<input type="text" class="tagInputOverview">' +
        '</div>';

    document.body.innerHTML = neededHtml;
    functions.createTagInput('#addTagButton');
    const receivedResult = document.getElementById('addTagDiv').outerHTML;

    expect(receivedResult).toMatch(expectedValue);
});

// createTagInput
it('Test if the tag input element has functions', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHtml =
        '<div id="addTagDiv">' +
            '<a href="TestSuiteDemo.FrontEndTests.SuiteTearDown" class="static">Suite Tear Down </a>' +
            '<i id="addTagButton" class="fas fa-plus-circle addTag"></i>' +
        '</div>';

    document.body.innerHTML = neededHtml;
    functions.createTagInput('#addTagButton');
    const receivedResult = $('#addTagDiv .tagInputOverview');

    expect(Object.entries(receivedResult[0]).length).toBeGreaterThan(0);
});

// checkIfNewTagIsValid
it('Test if the tag input is valid expect tag to already exists', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const newTags = 'test case';
    const expectedValue = '<div class="tagErrorMessage">Tag';
    const neededHtml =
        '<div id="addTagDiv">'+
            '<i id="addTagButton" class="fas fa-plus-circle addTag"></i>' +
                '<input type="text" class="tagInputOverview">' +
        '</div>';

    document.body.innerHTML = neededHtml;
    functions.checkIfNewTagIsValid([{ tags: [ "test case", 'testing' ] }], 'TestSuiteDemo.BackEndTests', newTags);
    const receivedResult = document.getElementById('addTagDiv').outerHTML;

    expect(receivedResult).toContain(expectedValue);
});

// checkIfNewTagIsValid
it('Test if the tag input is valid expect tag to have special characters', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const newTags = 'testcase!';
    const expectedValue = '<div class="tagErrorMessage">`~!';
    const neededHtml =
        '<div id="addTagDiv">' +
            '<i id="addTagButton" class="fas fa-plus-circle addTag"></i>' +
            '<input type="text" class="tagInputOverview">' +
        '</div>';

    document.body.innerHTML = neededHtml;
    functions.checkIfNewTagIsValid([{ tags: [ "test case", 'testing' ] }], 'TestSuiteDemo.BackEndTests', newTags);
    const receivedResult = document.getElementById('addTagDiv').outerHTML;

    expect(receivedResult).toContain(expectedValue);
});

// checkIfNewTagIsValid
it('Test if the tag input is valid expect to be correct', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const newTags = 'test';
    const expectedValue = '<div class="tagErrorMessage">';
    const neededHtml =
        '<div id="addTagDiv">' +
            '<i id="addTagButton" class="fas fa-plus-circle addTag"></i>' +
                '<input type="text" class="tagInputOverview">' +
        '</div>';

    document.body.innerHTML = neededHtml;
    functions.checkIfNewTagIsValid([{ tags: [ "test case", 'testing' ] }], 'TestSuiteDemo.BackEndTests', newTags);
    const receivedResult = document.getElementById('addTagDiv').outerHTML;

    expect(receivedResult).not.toContain(expectedValue);
});

// postTagInHtml
it('Test if tag span & delete tag button has been added in the li', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const successData = '{status: "OK"}';
    const neededValues = {currentPageURL: "TestSuiteDemo.FrontEndTests.ScenarioLibrary", newTags: "test1"};
    const neededHtml =
        '<div class="contents">' +
            '<li id="toTest">' +
                '<div class="addTagDiv">' +
                    '<a href="TestSuiteDemo.FrontEndTests.ScenarioLibrary" class="static">Scenario Library</a>' +
                '</div>' +
            '</li>' +
        '</div>';
    const expectedValue =
        '<div class="contents">' +
            '<li id="toTest">' +
                '<div class="addTagDiv">' +
                    '<a href="TestSuiteDemo.FrontEndTests.ScenarioLibrary" class="static">Scenario Library</a>' +
                '</div>' +
                '<span class="tag">test1 <i class="fas fa-times deleteTagButton"></i></span>' +
            '</li>' +
        '</div>';

    document.body.innerHTML = neededHtml;
    functions.postTagInHtml(successData, neededValues);
    const receivedResult = document.getElementsByClassName('contents')[0].outerHTML;

    expect(receivedResult).toMatch(expectedValue);
});

// inputBorderStyling
it('Test if input element has red border', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHtml = '<input type="text" class="tagInputOverview">';
    const expectedValue = '<input type="text" class="tagInputOverview" style="border-color: red; outline: 0;">';

    document.body.innerHTML = neededHtml;
    functions.inputBorderStyling();
    const receivedResult = document.getElementsByClassName('tagInputOverview')[0].outerHTML;

    expect(receivedResult).toMatch(expectedValue);
});

/*
    DELETE TAGS TESTS START
*/
// deleteClickAndHoverEvent
it('Test if delete tag button will have a click and hover function', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHtml = '<span class="tag">test1<i class="fas fa-times deleteTagButton" style="display: none;"></span>';

    document.body.innerHTML = neededHtml;
    const deleteTagButton = '.deleteTagButton';
    functions.deleteClickAndHoverEvent(deleteTagButton);
    const receivedResult = document.getElementsByClassName('deleteTagButton');

    expect(Object.entries(receivedResult[0]).length).toBeGreaterThan(0);
});

// joinTagList
it('Test if chosen tag is removed out of the current tag list', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const chosenTag = 'test2';
    const neededHtml =
        '<span class="tag">test1</span>' +
        '<span class="tag">test2</span>';
    const expectedValue = 'test1';

    document.body.innerHTML = neededHtml;
    const currentTagArray = document.getElementsByClassName('tag');
    const receivedResult = functions.joinTagList(chosenTag, currentTagArray);

    expect(receivedResult).toMatch(expectedValue);
});

// deleteTag
it('Test if current tag span is correctly removed', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHtml =
        '<li id="toTest">' +
        '<span id="remove" class="tag">test2</span>' +
        '<span class="tag">test1</span>' +
        '</li>';
    const expectedValue =
        '<li id="toTest">' +
        '<span class="tag">test1</span>' +
        '</li>';

    document.body.innerHTML = neededHtml;
    const currentTagSpan = document.getElementById('remove');
    functions.deleteTag(undefined, {currentTagSpan});
    const receivedResult = document.getElementById('toTest').outerHTML;

    expect(receivedResult).toMatch(expectedValue);
});

