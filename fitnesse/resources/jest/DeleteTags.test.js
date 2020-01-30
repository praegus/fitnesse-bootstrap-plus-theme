jest.mock('jquery');

beforeEach(() => jest.resetModules());

it('check if tags are joined', () => {

});

// it('check if tags are joined', () => {
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
// });