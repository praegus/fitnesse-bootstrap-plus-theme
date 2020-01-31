jest.mock('jquery');

beforeEach(() => jest.resetModules());

/*
    BOTH ADD AND DELETE START
*/
// postTagRequest
it('calls into $.ajax with the correct params', () => {
    const $ = require('jquery');
    const functions = require('../bootstrap-plus/js/bootstrap-plus');

    // Call into the function we want to test
    const dummyCallback = () => {};
    const url = "http://localhost:9090/TestSuiteDemo.BackEndTests.T002RetrieveDataFromXas"
    // fetchCurrentUser(dummyCallback);
    functions.postTagRequest(dummyCallback, url, "", {});
    // Now make sure that $.ajax was properly called during the previous
    // 2 lines
    expect($.ajax).toBeCalledWith({
        type: 'POST',
        url: expect.any(String),
        contentType: 'application/json; charset=utf-8',
        data: expect.stringContaining('responder=updateTags&suites='),
        dataType: 'json',
        success: expect.any(Function),
        error: expect.any(Function)
    });
});

/*
    ADD TAGS TESTS START
*/
// createTagInput
it('Test if the tag input element will show up', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHtml =
        '<div id="addTagDiv">' +
            '<i id="addTagButton" class="fas fa-plus-circle addTag"></i>' +
        '</div>';
    const expectedValue =
        '<div id="addTagDiv">' +
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
            '<i id="addTagButton" class="fas fa-plus-circle addTag"></i>' +
        '</div>';

    document.body.innerHTML = neededHtml;
    functions.createTagInput('#addTagButton');
    const receivedResult = $('#addTagDiv .tagInputOverview');

    expect(Object.entries(receivedResult[0]).length).toBeGreaterThan(0);
});

// GetCurrentTagList
it('calls into $.ajax with the correct params', () => {
    const $ = require('jquery');
    const functions = require('../bootstrap-plus/js/bootstrap-plus');

    // Call into the function we want to test
    const dummyCallback = () => {};
    // fetchCurrentUser(dummyCallback);
    functions.GetCurrentTagList(dummyCallback);

    // Now make sure that $.ajax was properly called during the previous
    // 2 lines
    expect($.ajax).toBeCalledWith({
        type: 'GET',
        url: expect.stringContaining('?responder=tableOfContents'),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: expect.any(Function),
        error: expect.any(Function)
    });
});

// GetCurrentTagList
it('calls the callback when $.ajax requests are finished', () => {
    const $ = require('jquery');
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    // const testFunctions = require('../bootstrap-plus/js/test');

    // Create a mock function for our callback
    const callback = jest.fn();
    // const testURL = "TestSuiteDemo.BackEndTests.T002RetrieveDataFromXas";
    const testURL = "TestSuiteDemo.FrontEndTests.SuiteSetUp";
    const testTag = "Test7";
    functions.GetCurrentTagList(testURL, testTag, callback);
    // testFunctions.fetchCurrentUser(testURL, testTag, callback);

    const mockData = require('./mockup-data/TagsData');

    $.ajax.mock.calls[0 /*first call*/][0 /*first argument*/].success(mockData);

    expect(callback.mock.calls[0 /*first call*/][0 /*first arg*/]).toEqual(mockData);
});

// checkIfNewTagIsValid
it('Test if the tag input element has functions', () => {
    const functions = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHtml =
        '<div id="addTagDiv">' +
        '<i id="addTagButton" class="fas fa-plus-circle addTag"></i>' +
        '</div>';

    document.body.innerHTML = neededHtml;
    functions.createTagInput('#addTagButton');
    const receivedResult = $('#addTagDiv .tagInputOverview');

    expect(Object.entries(receivedResult[0]).length).toBeGreaterThan(0);
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

