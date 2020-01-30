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

/*
    DELETE TAGS TESTS START
*/
// joinTagList
it('check if tags are joined', () => {
//     const functions = require('../bootstrap-plus/js/bootstrap-plus');
//
//     document.body.innerHTML =
//         '<li>' +
//         '<i class="fa fa-cog icon-suite" aria-hidden="true"></i>' +
//         '<div class="addTagDiv">' +
//         '<a href="TestSuiteDemo.BackEndTests.T002RetrieveDataFromXas" class="test">T 002 Retrieve Data From Xas </a><i class="fas fa-plus-circle addTag" style="visibility: hidden;"></i>' +
//         '</div>' +
//         '<span class="tag">test2 <i class="fas fa-times deleteTagButton" style="display: none;"></i></span>' +
//         '<span class="tag">test4 <i class="fas fa-times deleteTagButton" style="display: none;"></i></span>' +
//         '<span class="tag">test1 <i class="fas fa-times deleteTagButton" style="display: none;"></i></span>' +
//         '</li>';
//
//     const chosenTag = "test2";
//
//     expect(functions.formDeleteTagList(chosenTag)).toEqual("test4, test1");
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

