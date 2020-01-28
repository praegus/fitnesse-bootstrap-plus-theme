jest.mock('jquery');

beforeEach(() => jest.resetModules());

// it('calls into $.ajax with the correct params', () => {
//     const $ = require('jquery');
//     const jsfile = require('./User');
//
//     // Call into the function we want to test
//     const dummyCallback = () => {};
//     jsfile.fetchCurrent(dummyCallback);
//
//     // Now make sure that $.ajax was properly called during the previous
//     // 2 lines
//     expect($.ajax).toBeCalledWith({
//         success: expect.any(Function),
//         type: 'GET',
//         url: 'http://example.com/currentUser',
//     });
// });

// it('calls the callback when $.ajax requests are finished', () => {
//     const $ = require('jquery');
//     const jsfile = require('./User');
//
//     // Create a mock function for our callback
//     const callback = jest.fn();
//     jsfile.fetchCurrent(callback);
//
//     // Now we emulate the process by which `$.ajax` would execute its own
//     // callback
//     $.ajax.mock.calls[0 /*first call*/][0 /*first argument*/].success({
//         firstName: 'Bobby',
//         lastName: 'Marley',
//     });
//
//     // And finally we assert that this emulated call by `$.ajax` incurred a
//     // call back into the mock function we provided as a callback
//     expect(callback.mock.calls[0 /*first call*/][0 /*first arg*/]).toEqual({
//         fullName: 'Bobby Marley',
//         loggedIn: true,
//     });
// });