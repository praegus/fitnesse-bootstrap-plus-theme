jest.mock('jquery');

beforeEach(() => jest.resetModules());

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

