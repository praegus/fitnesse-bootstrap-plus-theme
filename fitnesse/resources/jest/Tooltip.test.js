jest.mock('jquery');

beforeEach(() => jest.resetModules());

//checks if inputted CSV format data comes out correctly
it.skip('check if call is with correct parameters', () => {
    const $ = require('jquery');
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const dummyCallback = () => {};
    const expectedResult = {
        type: 'GET',
        url: 'files/fitnesse/bootstrap-plus/txt/toolTipData.txt',
        contentType: 'charset=utf-8',
        success: expect.any(Function),
        error: expect.any(Function)
    };

    jsfile.getToolTips(dummyCallback);

    expect($.ajax).toBeCalledWith(expectedResult);
});

it('Check if links work correctly', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHTML = '<div id="tooltip-div"><p id="tooltip-text"></p></div>';
    const expectedResult = 'A';

    document.body.innerHTML = neededHTML;
    jsfile.placeToolTip('this is a <a>Link</a>this is a <a>Link</a>');

    const receivedResult = document.getElementById('tooltip-text').getElementsByTagName('a')[0].tagName;

    expect(receivedResult).toMatch(expectedResult);
});

it('Check if other elements is not as element but as text', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHTML = '<div id="tooltip-div"><p id="tooltip-text"></p></div>';
    const expectedResult = 'this is a <div>div</div>';

    document.body.innerHTML = neededHTML;
    jsfile.placeToolTip('this is a <div>div</div>');

    const receivedResult = document.getElementById('tooltip-text').innerText;
    const receivedResult2 = document.getElementById('tooltip-text').getElementsByTagName('div')[0];

    expect(receivedResult).toMatch(expectedResult);
    expect(receivedResult2).toBe(undefined);

});

it('Check if there is a script tag, tooltip will not be displayed as html', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHTML = '<div id="tooltip-div"><p id="tooltip-text"></p></div>';
    const expectedResult = 'this is a <a>Link</a>this is a <a>Link</a><script>';

    document.body.innerHTML = neededHTML;
    jsfile.placeToolTip('this is a <a>Link</a>this is a <a>Link</a><script>');

    const receivedResult = document.getElementById('tooltip-text').innerText;
    const receivedResult2 = document.getElementById('tooltip-text').getElementsByTagName('a')[0];

    expect(receivedResult).toMatch(expectedResult);
    expect(receivedResult2).toBe(undefined);
});

it('Check if null', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHTML = '<div id="tooltip-div"><p id="tooltip-text"></p></div>';
    const expectedResult = '';

    document.body.innerHTML = neededHTML;
    jsfile.placeToolTip('');
    const receivedResult = document.getElementById('tooltip-text').innerText;

    expect(receivedResult).toMatch(expectedResult);
});
