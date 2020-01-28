jest.mock('jquery');

beforeEach(() => jest.resetModules());

it('calls into $.ajax with the correct params', () => {
    const $ = require('jquery');
    const fetchCurrentUser = require('../bootstrap-plus/js/test');

    // Call into the function we want to test
    const dummyCallback = () => {};
    // fetchCurrentUser(dummyCallback);
    fetchCurrentUser.fetchCurrentUser(dummyCallback);

    // Now make sure that $.ajax was properly called during the previous
    // 2 lines
    expect($.ajax).toBeCalledWith({
        success: expect.any(Function),
        type: 'GET',
        url: 'http://example.com/yay',
    });
});