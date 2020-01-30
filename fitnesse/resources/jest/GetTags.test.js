jest.mock('jquery');

beforeEach(() => jest.resetModules());

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
        url: expect.any(String),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: expect.any(Function),
        error: expect.any(Function)
    });
});

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

    const mockData = require('./testData');

    $.ajax.mock.calls[0 /*first call*/][0 /*first argument*/].success(mockData);

    expect(callback.mock.calls[0 /*first call*/][0 /*first arg*/]).toEqual(mockData);
});

// it('check input field styling if input is a duplicate', () => {
//     const $ = require('jquery');
//     const functions = require('../bootstrap-plus/js/bootstrap-plus');
//
//     document.body.innerHTML = '<input type="text" class="tagInputOverview">';
//
//     const mockData = require('./testData');
//
//     const testURL = "TestSuiteDemo.FrontEndTests.SuiteSetUp";
//     const testTag = "Test1";
//     functions.GetCurrentTagListAfterSuccess(mockData, testURL, testTag);
//
//     expect(functions.GetCurrentTagListAfterSuccess(mockData, testURL, testTag)).toEqual("same tag");
// });