jest.mock('jquery');
beforeEach(() => jest.resetModules());
//define dummy data

it('Test if $.ajax has the correct params', () => {
    //MAKE CONST URL
    const $ = require('jquery');
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const dummyCallback = () => {
    };
    const expectedResult = {
        type: 'GET',
        url: expect.stringContaining('?mavenVersions'),
        contentType: 'charset=utf-8',
        success: expect.any(Function),
        error: expect.any(Function)
    };

    jsfile.getVersionData(dummyCallback, 'http://localhost:9090/?mavenVersions');

    // Now make sure that $.ajax was properly called
    expect($.ajax).toBeCalledWith(expectedResult);
});

it('if currentversion property has an irregular key, correct it', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const toolchainDummyData = require('./mockup-data/versionCheck/toolchainDummyData');

    const expectedResult = {currentVersion: '1.20-SNAPSHOT'};
    const receivedResult = jsfile.versionCheck(toolchainDummyData);

    expect(receivedResult).toEqual(expect.objectContaining(expectedResult));
});

it('parse current version string to int correctly', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const dummyData = require('./mockup-data/versionCheck/defaultDummyData');

    const expectedResult = {formatCurrentVersion: 116};
    const receivedResult = jsfile.versionCheck(dummyData);

    expect(receivedResult).toEqual(expect.objectContaining(expectedResult));
});

it('parse latest version string to int correctly', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const dummyData = require('./mockup-data/versionCheck/defaultDummyData');

    const expectedResult = {formatLatestVersion: 119};
    const receivedResult = jsfile.versionCheck(dummyData);

    expect(receivedResult).toEqual(expect.objectContaining(expectedResult));
});

it('if version is outdated expect status to outdated', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const dummyData = require('./mockup-data/versionCheck/defaultDummyData');


    const receivedResult = jsfile.versionCheck(dummyData);

    expect(receivedResult.status).toBe('Outdated');
});

it('if version is up to date expect status to up to date', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    let dummyData = require('./mockup-data/versionCheck/defaultDummyData');

    // make current version equal latest version to create the "up-to-date" state
    dummyData[0].currentVersion = dummyData[0].latest;

    const receivedResult = jsfile.versionCheck(dummyData);

    expect(receivedResult.status).toBe('Up-to-date');
});

it('if version is ahead expect status to ahead', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    let dummyData = require('./mockup-data/versionCheck/defaultDummyData');

    // take latest version, parse to int, add one, parse to string and send it to versioncheck to create the "ahead" state and check it
    dummyData[0].currentVersion = String(parseInt(dummyData[0].latest.replace(/\D/g, "")) + 1);

    const receivedResult = jsfile.versionCheck(dummyData);

    expect(receivedResult.status).toBe("Ahead");

});

it('if data is null expect it to be undefined', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');

    const receivedResult = jsfile.versionCheck();

    expect(receivedResult).toBe(undefined);
});
