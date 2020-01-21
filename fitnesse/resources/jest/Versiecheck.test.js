const versiecheck = require('bootstrap-plus/js/bootstrap-plus-extra');
describe('Versiechecker', function () {
    //mock table in innerhtml
    document.body.innerHTML = '<table id="versioncheck"><tbody></tbody></table>';
    test('expect current version to be up to date', () => {
        // test if version up to date
        expect(versiecheck.versionCheck(2,2,"testapp")).toBe("up-to-date")
    });
    test('expect current version to be outdated', () => {
        // test if version outdated
        expect(versiecheck.versionCheck(2,1,"testapp")).toBe("outdated")
    });
    test('expect current version to be too high', () => {
        // test if version too high
        expect(versiecheck.versionCheck(2,3,"testapp")).toBe("current version is to high")
    });
});