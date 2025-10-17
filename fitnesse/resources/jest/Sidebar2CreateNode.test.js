/*
 Additional Sidebar node creation tests migrated from legacy file
*/

const pathToModule = '../bootstrap-plus/js/bootstrap-plus';

describe('Sidebar2 createSidebar2TreeNode (details)', () => {
  let createSidebar2TreeNode;
  beforeEach(() => {
    jest.resetModules();
    ({ createSidebar2TreeNode } = require(pathToModule));
  });

  test('root page renders special icon and id', () => {
    // Capture template passed to $ during node creation
    const originalDollar = global.$;
    let captured = '';
    global.$ = jest.fn((tpl) => {
      if (typeof tpl === 'string') captured = tpl;
      return { append: jest.fn(), find: jest.fn(() => ({ length: 0 })), attr: jest.fn(), length: 1 };
    });

    const item = { name: 'FitNesseRoot', path: 'FitNesseRoot', type: 'suite' };
    const node = createSidebar2TreeNode(item, 0);

    expect(captured).toContain('sidebar2-tree-node');
    expect(captured).toContain('fitnesse-root-icon');
    expect(node).toBeTruthy();

    global.$ = originalDollar;
  });

  test('marks current page when location matches', () => {
    const originalPath = location.pathname;
    Object.defineProperty(location, 'pathname', { value: '/Suite.TestPage', writable: true });

    const originalDollar = global.$;
    let captured = '';
    global.$ = jest.fn((tpl) => {
      if (typeof tpl === 'string') captured = tpl;
      return { append: jest.fn(), find: jest.fn(() => ({ length: 0 })), attr: jest.fn(), length: 1 };
    });

    const item = { name: 'TestPage', path: 'Suite.TestPage', type: 'test' };
    createSidebar2TreeNode(item, 1);

    expect(captured).toContain('current-page');

    global.$ = originalDollar;
    Object.defineProperty(location, 'pathname', { value: originalPath, writable: true });
  });

  test('adds children container and marks data-children-loaded for depth 0', () => {
    const originalDollar = global.$;
    const mockNode = {
      append: jest.fn(),
      attr: jest.fn(),
      find: jest.fn(() => ({ length: 0 })),
      length: 1,
    };
    global.$ = jest.fn((tpl) => (typeof tpl === 'string' ? mockNode : mockNode));

    const item = { name: 'Suite', path: 'Suite', type: 'suite', children: [{ name: 'Child', path: 'Suite.Child', type: 'test' }] };
    const node = createSidebar2TreeNode(item, 0);

    expect(mockNode.append).toHaveBeenCalled();
    expect(mockNode.attr).toHaveBeenCalledWith('data-children-loaded', 'true');
    expect(node).toBeTruthy();

    global.$ = originalDollar;
  });

  test('renders symlink icon when isSymlink=true', () => {
    const originalDollar = global.$;
    let captured = '';
    global.$ = jest.fn((tpl) => {
      if (typeof tpl === 'string') captured = tpl;
      return { append: jest.fn(), find: jest.fn(() => ({ length: 0 })), attr: jest.fn(), length: 1 };
    });

    const item = { name: 'Symlink', path: 'Suite.Symlink', type: 'test', isSymlink: true };
    createSidebar2TreeNode(item, 1);

    expect(captured).toContain('sidebar2-symlink-icon');

    global.$ = originalDollar;
  });
});
