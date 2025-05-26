// Mock jQuery to prevent issues
jest.mock('jquery', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        hasClass: jest.fn(),
        addClass: jest.fn(),
        removeClass: jest.fn(),
        append: jest.fn(),
        attr: jest.fn(),
        closest: jest.fn(),
        find: jest.fn(),
        length: 0
    }))
}));

// Mock $ global
global.$ = jest.fn(() => ({
    hasClass: jest.fn(),
    addClass: jest.fn(),
    removeClass: jest.fn(),
    append: jest.fn(),
    attr: jest.fn(),
    closest: jest.fn(),
    find: jest.fn(),
    length: 0
}));

beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});

describe('Sidebar 2.0 Context Menu Tests', () => {
    
    it('should return true for showSidebar2RunnablePageItems when node has test class', () => {
        const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
        
        // Mock the context menu option object
        const mockOpt = {
            $trigger: [{
                // Mock DOM element
            }]
        };
        
        // Mock jQuery closest and hasClass behavior
        const originalDollar = global.$;
        global.$ = jest.fn((element) => ({
            closest: jest.fn(() => ({
                hasClass: jest.fn((className) => className === 'test')
            }))
        }));
        
        const result = jsfile.showSidebar2RunnablePageItems(mockOpt);
        
        expect(result).toBe(true);
        
        global.$ = originalDollar;
    });
    
    it('should return true for showSidebar2RunnablePageItems when node has suite class', () => {
        const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
        
        // Mock the context menu option object
        const mockOpt = {
            $trigger: [{
                // Mock DOM element
            }]
        };
        
        // Mock jQuery closest and hasClass behavior
        const originalDollar = global.$;
        global.$ = jest.fn((element) => ({
            closest: jest.fn(() => ({
                hasClass: jest.fn((className) => className === 'suite')
            }))
        }));
        
        const result = jsfile.showSidebar2RunnablePageItems(mockOpt);
        
        expect(result).toBe(true);
        
        global.$ = originalDollar;
    });
    
    it('should return false for showSidebar2RunnablePageItems when node has neither test nor suite class', () => {
        const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
        
        // Mock the context menu option object
        const mockOpt = {
            $trigger: [{
                // Mock DOM element
            }]
        };
        
        // Mock jQuery closest and hasClass behavior
        const originalDollar = global.$;
        global.$ = jest.fn((element) => ({
            closest: jest.fn(() => ({
                hasClass: jest.fn(() => false) // Neither test nor suite
            }))
        }));
        
        const result = jsfile.showSidebar2RunnablePageItems(mockOpt);
        
        expect(result).toBe(false);
        
        global.$ = originalDollar;
    });
    
    it('should create tree node with proper type classes', () => {
        const jsfile = require('../bootstrap-plus/js/bootstrap-plus');
        
        // Since creating jQuery elements is complex to test, we'll test the logic indirectly
        // by checking that the function exists and can be called
        expect(typeof jsfile.createSidebar2TreeNode).toBe('function');
        
        // We can test with a simple mock that captures the call
        const originalDollar = global.$;
        let capturedTemplate = '';
        
        global.$ = jest.fn((template) => {
            if (typeof template === 'string') {
                capturedTemplate = template;
            }
            return {
                hasClass: jest.fn(),
                addClass: jest.fn(),
                removeClass: jest.fn(),
                append: jest.fn(),
                attr: jest.fn(),
                closest: jest.fn(),
                find: jest.fn(),
                length: 1
            };
        });
        
        // Test with a test item
        const testItem = {
            name: 'MyTest',
            path: 'MyTest',
            type: 'test',
            tags: []
        };
        
        const result = jsfile.createSidebar2TreeNode(testItem, 0);
        
        // Verify the function was called and template contains expected classes
        expect(capturedTemplate).toContain('test');
        expect(capturedTemplate).toContain('sidebar2-tree-node');
        
        global.$ = originalDollar;
    });
    
}); 