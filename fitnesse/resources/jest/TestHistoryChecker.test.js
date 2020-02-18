jest.mock('jquery');

beforeEach(() => jest.resetModules());

// const $ = require('jquery');
it.skip('Test if $.ajax has the correct params', () => {
    const $ = require('jquery');
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const dummyCallback = () => {};
    const expectedResult = {
        type: 'GET',
        url: expect.stringContaining('?recentTestHistory'),
        contentType: 'charset=utf-8',
        success: expect.any(Function),
        error: expect.any(Function)
    };

    //MAKE CONST URL
    jsfile.getPageHistory('http://localhost:9090/?recentTestHistory', dummyCallback);

    // Now make sure that $.ajax was properly called
    expect($.ajax).toBeCalledWith(expectedResult);
});


it('Test if rows are no longer than 5', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const dataFile = require('./mockup-data/TestHistoryData');
    const neededHTML = '<div id="recentTestHistoryTable"></div>';
    const expectedResult = dataFile.expectedDataRowTest;

    document.body.innerHTML = neededHTML;
    jsfile.generateTestHistoryTable(dataFile.neededDataRowTest);
    const receivedResult = document.getElementById('recentTestHistoryTable').innerHTML;

    expect(receivedResult).toEqual(expectedResult);
});


it('Test if "Last 5 Result" column has the correct 5 cells', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const dataFile = require('./mockup-data/TestHistoryData');
    const neededHTML = '<div id="recentTestHistoryTable"></div>';
    const expectedResult = dataFile.expectedDataColumnTest;

    document.body.innerHTML = neededHTML;
    jsfile.generateTestHistoryTable(dataFile.neededDataColumnTest);
    const receivedResult = document.getElementById('recentTestHistoryTable').innerHTML;

    expect(receivedResult).toEqual(expectedResult);
});

