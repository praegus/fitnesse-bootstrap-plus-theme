/*
 Core unit tests migrated from legacy bootstrap-plus.test.js
*/

const pathToModule = '../bootstrap-plus/js/bootstrap-plus';

describe('Core helpers', () => {
  let mod;
  beforeAll(() => {
    // Ensure clean module load
    jest.resetModules();
    mod = require(pathToModule);
  });

  test('getCookie returns value when present', () => {
    document.cookie = 'foo=bar; other=baz';
    expect(mod.getCookie('foo')).toBe('bar');
  });

  test('getCookie returns empty string when missing', () => {
    document.cookie = 'foo=bar';
    expect(mod.getCookie('nope')).toBe('');
  });

  describe('isFilesPath', () => {
    const original = { ...location };
    afterAll(() => { Object.assign(location, original); });

    test('true for /files', () => {
      Object.defineProperty(location, 'pathname', { value: '/files', writable: true });
      expect(mod.isFilesPath()).toBe(true);
    });

    test('true for /files/...', () => {
      Object.defineProperty(location, 'pathname', { value: '/files/some/path', writable: true });
      expect(mod.isFilesPath()).toBe(true);
    });

    test('false for other paths', () => {
      Object.defineProperty(location, 'pathname', { value: '/FrontPage', writable: true });
      expect(mod.isFilesPath()).toBe(false);
    });
  });
});
