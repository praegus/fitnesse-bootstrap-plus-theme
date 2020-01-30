jest.mock('jquery');

beforeEach(() => jest.resetModules());

describe('testHistoryCheck', function () {
    // const $ = require('jquery');
    it('Test if $.ajax has the correct params', () => {
        const $ = require('jquery');
        const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
        const dummyCallback = () => {
        };
        const expectedResult = {
            type: 'GET',
            url: expect.stringContaining('?testHistory&format=sorted'),
            contentType: 'charset=utf-8',
            success: expect.any(Function),
            error: expect.any(Function)
        };
        //MAKE CONST URL
        jsfile.getPageHistory('http://localhost:9090/?testHistory&format=sorted', dummyCallback);

        // Now make sure that $.ajax was properly called
        expect($.ajax).toBeCalledWith(expectedResult);
    });

    it('Test is data of get is correct in html', () => {
        const $ = require('jquery');
        const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
        const callback = jest.fn();
        const tableData = require('./resources/testHistory/table.xml');
        const neededHTML = '<div id="testHistoryTable"></div>';

        document.body.innerHTML = neededHTML;
        jsfile.generateTestHistoryTable(tableData);
        console.log(jsfile.generateTestHistoryTable(tableData));

        $.ajax.mock.calls[0 /*first call*/][0 /*first argument*/].success(expectedResult);
        const receivedResult = callback.mock.calls[0][0];

        expect(receivedResult).toEqual(expectedResult);
    });

});
