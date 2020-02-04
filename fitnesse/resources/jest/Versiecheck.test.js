jest.mock('jquery');
beforeEach(() => jest.resetModules());
//define dummy data
const dummyData = require('./mockup-data/versionCheck/defaultDummyData');
const toolchainDummyData = require('./mockup-data/versionCheck/toolchainDummyData');

it('Test if $.ajax has the correct params', () => {
    const dummyCallback = () => {
    };
    const expectedResult = {
        type: 'GET',
        url: expect.stringContaining('?mavenVersions'),
        contentType: 'charset=utf-8',
        success: expect.any(Function),
        error: expect.any(Function)
    };
    //MAKE CONST URL
    const $ = require('jquery');
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    jsfile.getVersionData(dummyCallback, 'http://localhost:9090/?mavenVersions');

    // Now make sure that $.ajax was properly called
    expect($.ajax).toBeCalledWith(expectedResult);
});
it('if currentversion property has an irregular key, correct it', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');

    expect(jsfile.versionCheck(toolchainDummyData)).toEqual(expect.objectContaining({currentVersion: '1.20-SNAPSHOT'}));
});

it('parse current version string to int correctly', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');

    expect(jsfile.versionCheck(dummyData)).toEqual(expect.objectContaining({formatCurrentVersion: 116}));
});

it('parse latest version string to int correctly', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');

    expect(jsfile.versionCheck(dummyData)).toEqual(expect.objectContaining({formatLatestVersion: 119}));
});

it('if version is outdated expect status to outdated', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');

    expect(jsfile.versionCheck(dummyData).status).toBe('Outdated');
});

it('if version is up to date expect status to up to date', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');

    expect(jsfile.versionCheck(toolchainDummyData).status).toBe('Up-to-date');
});

it('if version is ahead expect status to ahead', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');

 // take latest version, parse to int, add one, parse to string and send it to versioncheck to create the "ahead" state and check it
    dummyData[0].currentVersion = String(parseInt(dummyData[0].latest.replace(/\D/g, "")) + 1);
    expect(jsfile.versionCheck(dummyData).status).toBe("Ahead");

});
