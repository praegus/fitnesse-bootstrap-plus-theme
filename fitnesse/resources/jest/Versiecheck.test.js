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
it('if currentversion property has an irregular key, expect corrected format', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const toolchainDummyData = require('./mockup-data/versionCheck/toolchainDummyData');
    const neededHTML = '<table id="versioncheck"></table>';
    document.body.innerHTML = neededHTML;
    jsfile.versionCheck(toolchainDummyData);
    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>toolchain fitnesse plugin</p></td>' +
        '<td><p>1.20-SNAPSHOT</p></td>' +
        '<td><p>1.20</p></td>' +
        '<td class="Up-to-date"><p>Up-to-date</p></td>' +
        '</tr>';
    expect(receivedResult).toMatch(expectedResult);
});

it('if version is outdated expect status to outdated', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const dummyData = require('./mockup-data/versionCheck/defaultDummyData');
    const neededHTML = '<table id="versioncheck"></table>';
    document.body.innerHTML = neededHTML;
    jsfile.versionCheck(dummyData);
    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>toolchain fixtures</p></td>' +
        '<td><p>1.16</p></td>' +
        '<td><p>1.19</p></td>' +
        '<td class="Outdated"><p>Outdated</p></td>' +
        '</tr>';
    expect(receivedResult).toMatch(expectedResult);
});

it('if version is up to date expect status to up to date', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    let dummyData = require('./mockup-data/versionCheck/defaultDummyData');
    const neededHTML = '<table id="versioncheck"></table>';
    document.body.innerHTML = neededHTML;
    dummyData[0].currentVersion = dummyData[0].latest;
    jsfile.versionCheck(dummyData);
    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>toolchain fixtures</p></td>' +
        '<td><p>1.19</p></td>' +
        '<td><p>1.19</p></td>' +
        '<td class="Up-to-date"><p>Up-to-date</p></td>' +
        '</tr>';
    expect(receivedResult).toMatch(expectedResult);
});

it('if version is ahead expect status to ahead', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    let dummyData = require('./mockup-data/versionCheck/defaultDummyData');
    const neededHTML = '<table id="versioncheck"></table>';

    document.body.innerHTML = neededHTML;
    dummyData[0].currentVersion = '1.20';


    jsfile.versionCheck(dummyData);

    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>toolchain fixtures</p></td>' +
        '<td><p>1.20</p></td>' +
        '<td><p>1.19</p></td>' +
        '<td class="Ahead"><p>Ahead</p></td>' +
        '</tr>';

    expect(receivedResult).toMatch(expectedResult);

});

it('if data is null expect table to be empty', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHTML = "<table id='versioncheck'></table>";
    document.body.innerHTML = neededHTML;
    jsfile.versionCheck();
    const receivedResult = document.getElementById('versioncheck').innerHTML;
    expect(receivedResult).toBe('');
});

it('currentversion only has a major version and is higher and should return ahead', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    let dummyData = require('./mockup-data/versionCheck/defaultDummyData');
    const neededHTML = '<table id="versioncheck"></table>';

    document.body.innerHTML = neededHTML;
    dummyData[0].currentVersion = '2';

    jsfile.versionCheck(dummyData);

    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>toolchain fixtures</p></td>' +
        '<td><p>2</p></td>' +
        '<td><p>1.19</p></td>' +
        '<td class="Ahead"><p>Ahead</p></td>' +
        '</tr>';

    expect(receivedResult).toMatch(expectedResult);
});

it('latestversion only has a major version and is higher and should return outdated', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    let dummyData = require('./mockup-data/versionCheck/defaultDummyData');
    const neededHTML = '<table id="versioncheck"></table>';

    document.body.innerHTML = neededHTML;
    dummyData[0].latest = '2';

    jsfile.versionCheck(dummyData);

    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>toolchain fixtures</p></td>' +
        '<td><p>1.16</p></td>' +
        '<td><p>2</p></td>' +
        '<td class="Outdated"><p>Outdated</p></td>' +
        '</tr>';

    expect(receivedResult).toMatch(expectedResult);
});

it('currentversion is snapshot version and should retun up-to-date', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    let dummyData = require('./mockup-data/versionCheck/defaultDummyData');
    const neededHTML = '<table id="versioncheck"></table>';

    document.body.innerHTML = neededHTML;
    dummyData[0].currentVersion = '1.19-SNAPSHOT';

    jsfile.versionCheck(dummyData);

    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>toolchain fixtures</p></td>' +
        '<td><p>1.19-SNAPSHOT</p></td>' +
        '<td><p>1.19</p></td>' +
        '<td class="Up-to-date"><p>Up-to-date</p></td>' +
        '</tr>';

    expect(receivedResult).toMatch(expectedResult);
});

it('if versions contain letters parse and return up-to-date', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const cornerCaseDummyData = require('./mockup-data/versionCheck/cornerCaseDummyData');
    const neededHTML = '<table id="versioncheck"></table>';

    document.body.innerHTML = neededHTML;

    jsfile.versionCheck(cornerCaseDummyData);

    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>google api services gmail</p></td>' +
        '<td><p>v1-rev102-1.25.0</p></td>' +
        '<td><p>v1-rev102-1.25.0</p></td>' +
        '<td class="Up-to-date"><p>Up-to-date</p></td>' +
        '</tr>';

    expect(receivedResult).toMatch(expectedResult);
});

it('if versions contain letters parse and return outdated', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    let cornerCaseDummyData = require('./mockup-data/versionCheck/cornerCaseDummyData');
    const neededHTML = '<table id="versioncheck"></table>';

    document.body.innerHTML = neededHTML;

    cornerCaseDummyData[0].latest = "v1-rev102-1.25.1";

    jsfile.versionCheck(cornerCaseDummyData);

    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>google api services gmail</p></td>' +
        '<td><p>v1-rev102-1.25.0</p></td>' +
        '<td><p>v1-rev102-1.25.1</p></td>' +
        '<td class="Outdated"><p>Outdated</p></td>' +
        '</tr>';

    expect(receivedResult).toMatch(expectedResult);
});

it('if versions contain letters parse and return ahead', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    let cornerCaseDummyData = require('./mockup-data/versionCheck/cornerCaseDummyData');
    const neededHTML = '<table id="versioncheck"></table>';

    document.body.innerHTML = neededHTML;

    cornerCaseDummyData[0].currentVersion = "v1-rev102-1.25.1";

    jsfile.versionCheck(cornerCaseDummyData);

    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>google api services gmail</p></td>' +
        '<td><p>v1-rev102-1.25.1</p></td>' +
        '<td><p>v1-rev102-1.25.0</p></td>' +
        '<td class="Ahead"><p>Ahead</p></td>' +
        '</tr>';

    expect(receivedResult).toMatch(expectedResult);
});

it('if a version in versions only contains characters parse and return up-to-date', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    let cornerCaseDummyData = require('./mockup-data/versionCheck/cornerCaseDummyData');
    const neededHTML = '<table id="versioncheck"></table>';

    document.body.innerHTML = neededHTML;

    cornerCaseDummyData[0].currentVersion = "v1-rev102-!%$%#!awdaw%$-1.25.1";
    cornerCaseDummyData[0].latest = "v1-rev102-!%$%#!awdaw%$-1.25.1";

    jsfile.versionCheck(cornerCaseDummyData);

    const receivedResult = document.getElementById('versioncheck').innerHTML;
    const expectedResult =
        '<tr class="check">' +
        '<td><p>google api services gmail</p></td>' +
        '<td><p>v1-rev102-!%$%#!awdaw%$-1.25.1</p></td>' +
        '<td><p>v1-rev102-!%$%#!awdaw%$-1.25.1</p></td>' +
        '<td class="Up-to-date"><p>Up-to-date</p></td>' +
        '</tr>';

    expect(receivedResult).toMatch(expectedResult);
});