jest.mock('jquery');

beforeEach(() => jest.resetModules());

it('Check if Bootstrap, toolchain, FitNesse and/or hsac are present, if they are then their release notes are shown', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHTML = '<table id="versioncheck"></table>';
    document.body.innerHTML = neededHTML;

    var text = '[{"groupid": "org.fitnesse","artifactid": "fitnesse","currentVersion": "20200308","latest": "20200404"},' +
        '{"groupid": "nl.hsac","artifactid": "hsac-fitnesse-fixtures","currentVersion": "4.9.1","latest": "4.14.0"},' +
        '{"groupid": "nl.praegus","artifactid": "toolchain-fixtures","currentVersion": "1.17","latest": "1.21"},' +
        '{"groupid": "nl.praegus","artifactid": "toolchain-fitnesse-plugin","version": "2.0.4-SNAPSHOT","latest": "2.0.3"}]';
    var obj = JSON.parse(text);
    jsfile.versionCheck(obj);

    const expectedData = '<tr class="check"><td><p>fitnesse</p></td><td><p>20200308</p></td><td><p>20200404</p></td><td class="Outdated"><p>Outdated</p></td><td><p><a href="http://fitnesse.org/FitNesse.ReleaseNotes" target="_blank">Fitnesse</a></p></td></tr><tr class="check"><td><p>hsac fitnesse fixtures</p></td><td><p>4.9.1</p></td><td><p>4.14.0</p></td><td class="Outdated"><p>Outdated</p></td><td><p><a href="https://github.com/fhoeben/hsac-fitnesse-fixtures/releases" target="_blank">Hsac fixture</a></p></td></tr><tr class="check"><td><p>toolchain fixtures</p></td><td><p>1.17</p></td><td><p>1.21</p></td><td class="Outdated"><p>Outdated</p></td><td><p></p></td></tr><tr class="check"><td><p>toolchain fitnesse plugin</p></td><td><p>2.0.4-SNAPSHOT</p></td><td><p>2.0.3</p></td><td class="Ahead"><p>Ahead</p></td><td><p><a href="https://github.com/praegus/toolchain-fitnesse-plugin/releases" target="_blank">Toolchain plugin release notes</a> / <a href="https://github.com/praegus/fitnesse-bootstrap-plus-theme/releases" target="_blank">Bootstrap+ </a></p></td></tr>';
    const receivedData = document.getElementById('versioncheck').innerHTML;
    expect(expectedData).toMatch(receivedData);
});

it('Check if bootstrap, toolchain, FitNesse or hsac are present, if not then their release notes are not present', () => {
    const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
    const neededHTML = '<table id="versioncheck"></table>';
    document.body.innerHTML = neededHTML;

    var text = '[{"groupid": "org.test","artifactid": "test","currentVersion": "20200308","latest": "20200404"},' +
        '{"groupid": "nl.test2","artifactid": "test2","currentVersion": "4.9.1","latest": "4.14.0"},' +
        '{"groupid": "nl.test3","artifactid": "test3","currentVersion": "1.17","latest": "1.21"}]';
    var obj = JSON.parse(text);
    jsfile.versionCheck(obj);

    const expectedData = '<table id="versioncheck"> <tbody> <tr><td colspan="5"> <b>Versioncheck</b> </td> </tr><tr> <td><b>Name</b></td> <td><b>Current Version</b></td> <td><b>Newest version</b></td> <td><b>Status</b></td> <td><b>Release Notes</b></td> </tr> <tr class="check"><td><p>test</p></td><td><p>20200308</p></td><td><p>20200404</p></td><td class="Outdated"><p>Outdated</p></td><td><p></p></td></tr><tr class="check"><td><p>test2</p></td><td><p>4.9.1</p></td><td><p>4.14.0</p></td><td class="Outdated"><p>Outdated</p></td><td><p></p></td></tr><tr class="check"><td><p>test3</p></td><td><p>1.17</p></td><td><p>1.21</p></td><td class="Outdated"><p>Outdated</p></td><td><p></p></td></tr><tr class="check"></tr></tbody> </table>';
    const receivedData = document.getElementById('versioncheck').innerHTML;
    expect(expectedData).toMatch(receivedData);
});

