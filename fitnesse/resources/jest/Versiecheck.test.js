jest.mock('jquery');

describe('versiecheck', function () {
    const $ = require('jquery');
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    var dummyData = [ {"groupid": "nl.praegus", "artifactid": "toolchain-fixtures", "currentVersion": "1.16", "latest": "1.19"}];
    var toolchainDummyData =  [{"groupid": "nl.praegus", "artifactid": "toolchain-fitnesse-plugin", "version": "1.20-SNAPSHOT", "latest": "1.20"}];
test('Test if $.ajax has the correct params', () => {
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
    jsfile.getVersionData(dummyCallback,'http://localhost:9090/?mavenVersions');

    // Now make sure that $.ajax was properly called
    expect($.ajax).toBeCalledWith(expectedResult);
});
test('Correct toolchain version property correction',()=>{
console.log(jsfile.versionCheck(toolchainDummyData));
    expect(jsfile.versionCheck(toolchainDummyData)).toEqual(expect.objectContaining({currentVersion:"1.20-SNAPSHOT"}));
});

test('correct current version data formatting',()=>{

expect(jsfile.versionCheck(dummyData)).toEqual(expect.objectContaining({formatCurrentVersion:116}));
});

test('correct latest version data formatting',()=>{

expect(jsfile.versionCheck(dummyData)).toEqual(expect.objectContaining({formatLatestVersion:119}));
});

test('if version is outdated expect status to outdated',()=>{

expect(jsfile.versionCheck(dummyData).status).toBe("Outdated");
});

    test('if version is up to date expect status to up to date',()=>{

        expect(jsfile.versionCheck(toolchainDummyData).status).toBe("Up-to-date");
    });

    test('if version is ahead expect status to ahead',()=>{


        dummyData[0].currentVersion = parseInt(dummyData[0].latest.replace(/\D/g, ""))+1;
console.log(dummyData);
        expect(jsfile.versionCheck(dummyData).status).toBe("Outdated");

    });
});
