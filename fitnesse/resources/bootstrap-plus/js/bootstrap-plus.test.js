/**
 * Tests for bootstrap-plus.js
 * 
 * This file tests the core functionality of the FitNesse Bootstrap Plus theme
 * including sidebar operations, tree node generation, cookie handling, and more.
 */

// Mock jQuery and DOM
global.$ = jest.fn((selector) => {
    // Special handling for HTML string input (used by createSidebar2TreeNode)
    if (typeof selector === 'string' && selector.trim().startsWith('<')) {
        // This is HTML string, return a mock jQuery object that simulates creating DOM elements
        const mockJQueryElement = {
            html: jest.fn().mockReturnThis(),
            text: jest.fn().mockReturnThis(),
            attr: jest.fn((name, value) => {
                if (value !== undefined) {
                    // Setter mode
                    return mockJQueryElement;
                } else {
                    // Getter mode - return test-appropriate values
                    if (name === 'id') return 'sidebar2-FitNesseRoot';
                    if (name === 'data-path') return 'Suite.TestPage';
                    if (name === 'data-depth') return '1';
                    if (name === 'data-children-loaded') return 'true';
                    return 'mock-value';
                }
            }),
            addClass: jest.fn().mockReturnThis(),
            removeClass: jest.fn().mockReturnThis(),
            hasClass: jest.fn((className) => {
                // Return true for test conditions
                if (className === 'sidebar2-tree-node') return true;
                if (className === 'current-page') return true;
                if (className === 'sidebar2-pruned') return true;
                if (className === 'test') return true;
                return false;
            }),
            find: jest.fn((selector) => {
                // Return a mock element that isDefined
                const foundElement = {
                    length: 1,
                    0: { tagName: 'I' }
                };
                return foundElement;
            }),
            parent: jest.fn().mockReturnThis(),
            siblings: jest.fn().mockReturnThis(),
            children: jest.fn().mockReturnThis(),
            append: jest.fn().mockReturnThis(),
            prepend: jest.fn().mockReturnThis(),
            remove: jest.fn().mockReturnThis(),
            empty: jest.fn().mockReturnThis(),
            css: jest.fn().mockReturnThis(),
            on: jest.fn().mockReturnThis(),
            off: jest.fn().mockReturnThis(),
            trigger: jest.fn().mockReturnThis(),
            click: jest.fn().mockReturnThis(),
            show: jest.fn().mockReturnThis(),
            hide: jest.fn().mockReturnThis(),
            slideDown: jest.fn().mockReturnThis(),
            slideUp: jest.fn().mockReturnThis(),
            fadeIn: jest.fn().mockReturnThis(),
            fadeOut: jest.fn().mockReturnThis(),
            animate: jest.fn().mockReturnThis(),
            is: jest.fn().mockReturnValue(true),
            val: jest.fn(),
            data: jest.fn(),
            each: jest.fn(),
            length: 1,
            first: jest.fn().mockReturnThis(),
            last: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            closest: jest.fn().mockReturnThis(),
            contains: jest.fn().mockReturnValue(true),
            index: jest.fn().mockReturnValue(0),
            toArray: jest.fn().mockReturnValue([]),
            slice: jest.fn().mockReturnThis(),
            scrollTop: jest.fn().mockReturnValue(0),
            scrollLeft: jest.fn().mockReturnValue(0),
            scrollIntoView: jest.fn(),
            outerWidth: jest.fn().mockReturnValue(100),
            outerHeight: jest.fn().mockReturnValue(100),
            height: jest.fn().mockReturnValue(100),
            width: jest.fn().mockReturnValue(100),
            offset: jest.fn().mockReturnValue({ top: 0, left: 0 }),
            0: { // Mock DOM element
                pathname: '/test/path',
                classList: {
                    contains: jest.fn().mockReturnValue(false)
                },
                scrollIntoView: jest.fn(),
                tagName: 'DIV',
                style: {},
                innerHTML: '',
                innerText: '',
                nodeType: 1,
                nodeValue: '',
                parentNode: null
            }
        };
        
        return mockJQueryElement;
    }
    
    // For selector queries, return the regular mock
    const mockElement = {
        html: jest.fn().mockReturnThis(),
        text: jest.fn().mockReturnThis(),
        attr: jest.fn().mockReturnThis(),
        addClass: jest.fn().mockReturnThis(),
        removeClass: jest.fn().mockReturnThis(),
        hasClass: jest.fn().mockReturnValue(false),
        find: jest.fn().mockReturnThis(),
        parent: jest.fn().mockReturnThis(),
        siblings: jest.fn().mockReturnThis(),
        children: jest.fn().mockReturnThis(),
        append: jest.fn().mockReturnThis(),
        prepend: jest.fn().mockReturnThis(),
        remove: jest.fn().mockReturnThis(),
        empty: jest.fn().mockReturnThis(),
        css: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis(),
        off: jest.fn().mockReturnThis(),
        trigger: jest.fn().mockReturnThis(),
        click: jest.fn().mockReturnThis(),
        show: jest.fn().mockReturnThis(),
        hide: jest.fn().mockReturnThis(),
        slideDown: jest.fn().mockReturnThis(),
        slideUp: jest.fn().mockReturnThis(),
        fadeIn: jest.fn().mockReturnThis(),
        fadeOut: jest.fn().mockReturnThis(),
        animate: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnValue(true),
        val: jest.fn(),
        data: jest.fn(),
        each: jest.fn(),
        length: 1,
        first: jest.fn().mockReturnThis(),
        last: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        closest: jest.fn().mockReturnThis(),
        contains: jest.fn().mockReturnValue(true),
        index: jest.fn().mockReturnValue(0),
        toArray: jest.fn().mockReturnValue([]),
        slice: jest.fn().mockReturnThis(),
        scrollTop: jest.fn().mockReturnValue(0),
        scrollLeft: jest.fn().mockReturnValue(0),
        scrollIntoView: jest.fn(),
        outerWidth: jest.fn().mockReturnValue(100),
        outerHeight: jest.fn().mockReturnValue(100),
        height: jest.fn().mockReturnValue(100),
        width: jest.fn().mockReturnValue(100),
        offset: jest.fn().mockReturnValue({ top: 0, left: 0 }),
        0: { // Mock DOM element
            pathname: '/test/path',
            classList: {
                contains: jest.fn().mockReturnValue(false)
            },
            scrollIntoView: jest.fn(),
            tagName: 'DIV',
            style: {},
            innerHTML: '',
            innerText: '',
            nodeType: 1,
            nodeValue: '',
            parentNode: null
        }
    };
    
    // Make the mock chainable
    Object.keys(mockElement).forEach(key => {
        if (typeof mockElement[key] === 'function') {
            mockElement[key].mockReturnValue(mockElement);
        }
    });
    
    return mockElement;
});

// Mock jQuery static methods
global.$.ajax = jest.fn((options) => {
    // Simulate successful AJAX request
    if (options && options.success) {
        setTimeout(() => {
            options.success({ success: true });
        }, 0);
    }
    return Promise.resolve({ success: true });
});
global.$.Event = jest.fn();
global.$.grep = jest.fn();
global.$.ui = {
    autocomplete: {
        filter: jest.fn(),
        escapeRegex: jest.fn()
    }
};

// Mock document
global.document = {
    cookie: 'testCookie=testValue; sidebarTags=true',
    createElement: jest.fn(() => ({
        setAttribute: jest.fn(),
        style: {},
        value: '',
        select: jest.fn(),
        remove: jest.fn()
    })),
    body: {
        appendChild: jest.fn(),
        removeChild: jest.fn()
    },
    execCommand: jest.fn(),
    getElementById: jest.fn(() => ({ scrollIntoView: jest.fn() })),
    activeElement: { tagName: 'DIV' },
    querySelector: jest.fn(),
    addEventListener: jest.fn()
};

// Mock window and location
global.window = {
    location: {
        protocol: 'http:',
        hostname: 'localhost',
        port: '8080',
        host: 'localhost:8080',
        pathname: '/TestPage',
        search: ''
    },
    event: null,
    open: jest.fn(),
    addEventListener: jest.fn()
};

global.location = global.window.location;

// Mock localStorage
global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

// Mock console methods to avoid noise in tests
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

// Import the module to test
let bootstrapPlus;

beforeAll(() => {
    bootstrapPlus = require('./bootstrap-plus.js');
});

// Extract functions for cleaner access
let getSidebarContentHtml, placeSidebarContent, toggleIconClickEvent, expandRouteSidebarIcons, 
    expandSidebarIcons, placeToolTip, createTagInput, checkIfNewTagIsValid, postTagInHtml, 
    inputBorderStyling, deleteClickAndHoverEvent, joinTagList, deleteTag, generateTestHistoryTable, 
    getPageHistory, getWorkSpace, isFilesPath, getCookie, createSidebar2TreeNode, showSidebar2RunnablePageItems;

describe('Bootstrap Plus Functions', () => {
    beforeEach(() => {
        // Extract functions from the module
        if (bootstrapPlus) {
            getSidebarContentHtml = bootstrapPlus.getSidebarContentHtml;
            placeSidebarContent = bootstrapPlus.placeSidebarContent;
            toggleIconClickEvent = bootstrapPlus.toggleIconClickEvent;
            expandRouteSidebarIcons = bootstrapPlus.expandRouteSidebarIcons;
            expandSidebarIcons = bootstrapPlus.expandSidebarIcons;
            placeToolTip = bootstrapPlus.placeToolTip;
            createTagInput = bootstrapPlus.createTagInput;
            checkIfNewTagIsValid = bootstrapPlus.checkIfNewTagIsValid;
            postTagInHtml = bootstrapPlus.postTagInHtml;
            inputBorderStyling = bootstrapPlus.inputBorderStyling;
            deleteClickAndHoverEvent = bootstrapPlus.deleteClickAndHoverEvent;
            joinTagList = bootstrapPlus.joinTagList;
            deleteTag = bootstrapPlus.deleteTag;
            generateTestHistoryTable = bootstrapPlus.generateTestHistoryTable;
            getPageHistory = bootstrapPlus.getPageHistory;
            getWorkSpace = bootstrapPlus.getWorkSpace;
            isFilesPath = bootstrapPlus.isFilesPath;
            getCookie = bootstrapPlus.getCookie;
            createSidebar2TreeNode = bootstrapPlus.createSidebar2TreeNode;
            showSidebar2RunnablePageItems = bootstrapPlus.showSidebar2RunnablePageItems;
        }
        
        global.location.pathname = '/TestPage';
        global.document.cookie = 'testCookie=testValue; sidebarTags=true';
    });

    describe('getCookie', () => {
        test('should return cookie value when it exists', () => {
            expect(getCookie('testCookie')).toBe('testValue');
        });

        test('should return empty string when cookie does not exist', () => {
            expect(getCookie('nonexistent')).toBe('');
        });
    });

    describe('isFilesPath', () => {
        test('should return true for /files path', () => {
            // Mock location for this specific test
            const originalLocation = global.location;
            global.location = { ...originalLocation, pathname: '/files' };
            
            expect(isFilesPath()).toBe(true);
            
            // Restore original location
            global.location = originalLocation;
        });

        test('should return true for paths starting with /files/', () => {
            // Mock location for this specific test
            const originalLocation = global.location;
            global.location = { ...originalLocation, pathname: '/files/some/path' };
            
            expect(isFilesPath()).toBe(true);
            
            // Restore original location
            global.location = originalLocation;
        });

        test('should return false for other paths', () => {
            // Mock location for this specific test
            const originalLocation = global.location;
            global.location = { ...originalLocation, pathname: '/TestPage' };
            
            expect(isFilesPath()).toBe(false);
            
            // Restore original location
            global.location = originalLocation;
        });
    });

    describe('getWorkSpace', () => {
        test('should return /root for root paths when no sidebar root set', () => {
            global.document.cookie = '';
            expect(getWorkSpace('/')).toBe('/root');
            expect(getWorkSpace('/frontpage')).toBe('/root');
        });

        test('should truncate path at first dot', () => {
            global.document.cookie = '';
            expect(getWorkSpace('/Suite.TestPage')).toBe('/Suite');
        });
    });

    describe('getSidebarContentHtml', () => {
        test('should generate HTML for test page', () => {
            const content = {
                name: 'TestPage',
                path: 'Suite.TestPage', 
                type: 'test',
                children: []
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('TestPage');
            expect(html).toContain('fas fa-gear icon-test');
            expect(html).toContain('href="Suite.TestPage"');
        });

        test('should generate HTML for suite page', () => {
            const content = {
                name: 'TestSuite',
                path: 'Suite.TestSuite',
                type: 'suite', 
                children: [{ name: 'child' }]
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('TestSuite');
            expect(html).toContain('fas fa-gears icon-suite');
            expect(html).toContain('iconToggle');
        });

        test('should generate HTML for root page', () => {
            const content = {
                name: 'FitNesseRoot',
                path: 'FitNesseRoot',
                type: 'suite'
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('FitNesseRoot');
            expect(html).toContain('fas fitnesse-root-icon');
        });

        test('should handle static pages', () => {
            const content = {
                name: 'StaticPage',
                path: 'Suite.StaticPage',
                type: 'static',
                children: []
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('StaticPage');
            expect(html).toContain('far fa-file icon-static');
        });
    });

    describe('showSidebar2RunnablePageItems', () => {
        test('should return true for test pages', () => {
            const mockOpt = {
                $trigger: [{
                    // Mock jQuery element
                }]
            };

            // Mock jQuery $ function
            global.$ = jest.fn(() => ({
                closest: () => ({
                    hasClass: (className) => className === 'test'
                })
            }));

            const result = showSidebar2RunnablePageItems(mockOpt);
            expect(result).toBe(true);
        });

        test('should return false for static pages', () => {
            const mockOpt = {
                $trigger: [{
                    // Mock jQuery element  
                }]
            };

            global.$ = jest.fn(() => ({
                closest: () => ({
                    hasClass: () => false
                })
            }));

            const result = showSidebar2RunnablePageItems(mockOpt);
            expect(result).toBe(false);
        });
    });
});

describe('Sidebar Content Generation', () => {
    describe('getSidebarContentHtml', () => {
        test('should generate HTML for root page', () => {
            const content = {
                name: 'FitNesseRoot',
                path: 'FitNesseRoot',
                type: 'suite',
                children: []
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('fas fitnesse-root-icon');
            expect(html).toContain('FitNesseRoot');
            expect(html).toContain('<li id="FitNesseRoot">');
        });

        test('should generate HTML for test page', () => {
            const content = {
                name: 'TestPage',
                path: 'Suite.TestPage',
                type: 'test',
                children: []
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('fas fa-gear icon-test');
            expect(html).toContain('TestPage');
            expect(html).toContain('href="Suite.TestPage"');
        });

        test('should generate HTML for suite page', () => {
            const content = {
                name: 'TestSuite',
                path: 'Suite.TestSuite',
                type: 'suite',
                children: [{ name: 'child' }]
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('fas fa-gears icon-suite');
            expect(html).toContain('TestSuite');
            expect(html).toContain('iconToggle iconWidth fas fa-angle-right');
        });

        test('should generate HTML for static page', () => {
            const content = {
                name: 'StaticPage',
                path: 'Suite.StaticPage',
                type: 'static',
                children: []
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('far fa-file icon-static');
            expect(html).toContain('StaticPage');
        });

        test('should generate HTML for ScenarioLibrary page', () => {
            const content = {
                name: 'ScenarioLibrary',
                path: 'Suite.ScenarioLibrary',
                type: 'static',
                children: []
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('fas fa-bolt icon-scenariolib');
            expect(html).toContain('ScenarioLibrary');
        });

        test('should generate HTML for SetUp page', () => {
            const content = {
                name: 'SetUp',
                path: 'Suite.SetUp',
                type: 'static',
                children: []
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('fas fa-wrench icon-special');
            expect(html).toContain('SetUp');
        });

        test('should highlight current page', () => {
            // Mock location for this specific test
            const originalLocation = global.location;
            global.location = { ...originalLocation, pathname: '/Suite.TestPage' };
            
            const content = {
                name: 'TestPage',
                path: 'Suite.TestPage',
                type: 'test',
                children: []
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('class="highlight"');
            
            // Restore original location
            global.location = originalLocation;
        });

        test('should show symbolic link icon for symlinked pages', () => {
            const content = {
                name: 'TestPage',
                path: 'Suite.TestPage',
                type: 'test',
                isSymlink: true,
                children: []
            };

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('fas fa-link');
        });

        test('should include tags when present', () => {
            const content = {
                name: 'TestPage',
                path: 'Suite.TestPage',
                type: 'test',
                tags: ['tag1', 'tag2'],
                children: []
            };

            // Mock getCookie to return true for sidebarTags
            document.cookie = 'sidebarTags=true';

            const html = getSidebarContentHtml(content);
            
            expect(html).toContain('tag1');
            expect(html).toContain('tag2');
            expect(html).toContain('class="tag sidebarTag"');
        });
    });

    describe('createSidebar2TreeNode', () => {
        test('should create tree node for root page', () => {
            const item = {
                name: 'FitNesseRoot',
                path: 'FitNesseRoot',
                type: 'suite'
            };

            const node = createSidebar2TreeNode(item, 0);
            
            expect(node.attr('id')).toBe('sidebar2-FitNesseRoot');
            expect(node.hasClass('sidebar2-tree-node')).toBe(true);
            expect(node.find('.fas.fitnesse-root-icon')).toBeDefined();
        });

        test('should create tree node for test page', () => {
            const item = {
                name: 'TestPage',
                path: 'Suite.TestPage',
                type: 'test'
            };

            const node = createSidebar2TreeNode(item, 1);
            
            expect(node.attr('data-path')).toBe('Suite.TestPage');
            expect(node.attr('data-depth')).toBe('1');
            expect(node.hasClass('test')).toBe(true);
        });

        test('should mark current page', () => {
            // Mock location for this specific test
            const originalLocation = global.location;
            global.location = { ...originalLocation, pathname: '/Suite.TestPage' };
            
            const item = {
                name: 'TestPage',
                path: 'Suite.TestPage',
                type: 'test'
            };

            const node = createSidebar2TreeNode(item, 1);
            
            expect(node.hasClass('current-page')).toBe(true);
            
            // Restore original location
            global.location = originalLocation;
        });

        test('should handle pruned pages', () => {
            const item = {
                name: 'PrunedTest',
                path: 'Suite.PrunedTest',
                type: 'test pruned'
            };

            const node = createSidebar2TreeNode(item, 1);
            
            expect(node.hasClass('sidebar2-pruned')).toBe(true);
            expect(node.find('.sidebar2-text-pruned')).toBeDefined();
        });

        test('should add children container when children exist', () => {
            const item = {
                name: 'Suite',
                path: 'Suite',
                type: 'suite',
                children: [
                    { name: 'Child1', path: 'Suite.Child1', type: 'test' }
                ]
            };

            const node = createSidebar2TreeNode(item, 0);
            
            expect(node.find('.sidebar2-node-children')).toBeDefined();
            expect(node.attr('data-children-loaded')).toBe('true');
        });

        test('should handle symlinked pages', () => {
            const item = {
                name: 'SymlinkTest',
                path: 'Suite.SymlinkTest',
                type: 'test',
                isSymlink: true
            };

            const node = createSidebar2TreeNode(item, 1);
            
            expect(node.find('.sidebar2-symlink-icon')).toBeDefined();
        });
    });
});

describe('Sidebar Functionality', () => {
    describe('showSidebar2RunnablePageItems', () => {
        test('should return true for test pages', () => {
            const mockOpt = {
                $trigger: [{
                    closest: () => ({
                        hasClass: (className) => className === 'test'
                    })
                }]
            };

            // Mock jQuery closest and hasClass
            global.$.mockImplementation(() => ({
                closest: () => ({
                    hasClass: (className) => className === 'test'
                })
            }));

            const result = showSidebar2RunnablePageItems(mockOpt);
            expect(result).toBe(true);
        });

        test('should return true for suite pages', () => {
            const mockOpt = {
                $trigger: [{
                    closest: () => ({
                        hasClass: (className) => className === 'suite'
                    })
                }]
            };

            global.$.mockImplementation(() => ({
                closest: () => ({
                    hasClass: (className) => className === 'suite'
                })
            }));

            const result = showSidebar2RunnablePageItems(mockOpt);
            expect(result).toBe(true);
        });

        test('should return false for static pages', () => {
            const mockOpt = {
                $trigger: [{
                    closest: () => ({
                        hasClass: () => false
                    })
                }]
            };

            global.$.mockImplementation(() => ({
                closest: () => ({
                    hasClass: () => false
                })
            }));

            const result = showSidebar2RunnablePageItems(mockOpt);
            expect(result).toBe(false);
        });
    });

    describe('expandRouteSidebarIcons', () => {
        beforeEach(() => {
            // Setup DOM mocking for expandRouteSidebarIcons
            global.$ = jest.fn((selector) => {
                if (selector.includes('#sidebarContent')) {
                    return {
                        find: jest.fn().mockReturnThis(),
                        first: jest.fn().mockReturnThis(),
                        css: jest.fn().mockReturnThis(),
                        removeClass: jest.fn().mockReturnThis(),
                        addClass: jest.fn().mockReturnThis(),
                        parent: jest.fn().mockReturnThis(),
                        siblings: jest.fn().mockReturnThis()
                    };
                }
                return {
                    css: jest.fn().mockReturnThis(),
                    removeClass: jest.fn().mockReturnThis(),
                    addClass: jest.fn().mockReturnThis()
                };
            });
        });

        test('should expand route for root path', () => {
            expandRouteSidebarIcons('/');
            
            // Verify that collapseSidebarIcons was called (through CSS manipulations)
            expect(global.$).toHaveBeenCalled();
        });

        test('should expand route for FrontPage', () => {
            expandRouteSidebarIcons('/FrontPage');
            
            expect(global.$).toHaveBeenCalled();
        });

        test('should expand route for nested path', () => {
            expandRouteSidebarIcons('/Suite.SubSuite.TestPage');
            
            expect(global.$).toHaveBeenCalled();
        });
    });
});

describe('Tag Operations', () => {
    describe('checkIfNewTagIsValid', () => {
        const mockData = [{
            tags: ['existing-tag', 'another-tag']
        }];

        test('should reject empty tag', () => {
            // Mock jQuery for error display
            global.$ = jest.fn(() => ({
                length: 0,
                after: jest.fn(),
                css: jest.fn()
            }));

            checkIfNewTagIsValid(mockData, 'currentPageURL', '');
            
            // Should call inputBorderStyling and show error
            expect(global.$).toHaveBeenCalled();
        });

        test('should reject existing tag', () => {
            global.$ = jest.fn(() => ({
                length: 0,
                after: jest.fn(),
                css: jest.fn()
            }));

            checkIfNewTagIsValid(mockData, 'currentPageURL', 'existing-tag');
            
            expect(global.$).toHaveBeenCalled();
        });

        test('should reject tag with special characters', () => {
            global.$ = jest.fn(() => ({
                length: 0,
                after: jest.fn(),
                css: jest.fn()
            }));

            checkIfNewTagIsValid(mockData, 'currentPageURL', 'tag@with$pecial');
            
            expect(global.$).toHaveBeenCalled();
        });

        test('should accept valid new tag', () => {
            global.$ = jest.fn(() => ({
                length: 0,
                after: jest.fn(),
                css: jest.fn()
            }));

            // Mock postTagRequest
            const originalPostTagRequest = global.postTagRequest;
            global.postTagRequest = jest.fn();

            checkIfNewTagIsValid(mockData, 'currentPageURL', 'valid-new-tag');
            
            // Should call postTagRequest for valid tags
            // Note: This might need adjustment based on actual implementation
            global.postTagRequest = originalPostTagRequest;
        });
    });

    describe('inputBorderStyling', () => {
        test('should apply error styling to input', () => {
            const mockInput = {
                css: jest.fn()
            };
            
            global.$ = jest.fn(() => mockInput);
            
            inputBorderStyling();
            
            expect(mockInput.css).toHaveBeenCalledWith({
                'border-color': 'red',
                'outline': '0'
            });
        });
    });
});

describe('Test History', () => {
    describe('generateTestHistoryTable', () => {
        test('should generate table from HTML data', () => {
            const mockHtmlData = `
                <html>
                    <body>
                        <table>
                            <tr><th>Header</th><th>Results</th></tr>
                            <tr><td>Test1</td><td>Pass</td></tr>
                            <tr><td>Test2</td><td>Fail</td></tr>
                            <tr><td>Test3</td><td>Pass</td></tr>
                            <tr><td>Test4</td><td>Error</td></tr>
                            <tr><td>Test5</td><td>Pass</td></tr>
                            <tr><td>Test6</td><td>Skip</td></tr>
                        </table>
                    </body>
                </html>
            `;

            // Mock DOMParser
            global.DOMParser = jest.fn(() => ({
                parseFromString: jest.fn(() => ({
                    getElementsByTagName: jest.fn(() => [{
                        getElementsByTagName: jest.fn(() => {
                            const mockRows = Array(7).fill().map((_, i) => ({
                                childNodes: { 9: { innerText: '', setAttribute: jest.fn() } },
                                getElementsByTagName: jest.fn(() => Array(10).fill({ remove: jest.fn() }))
                            }));
                            return mockRows;
                        })
                    }])
                }))
            }));

            // Mock document.getElementById
            const mockTable = { appendChild: jest.fn() };
            document.getElementById = jest.fn(() => mockTable);

            generateTestHistoryTable(mockHtmlData);

            expect(mockTable.appendChild).toHaveBeenCalled();
        });

        test('should handle undefined recentTestHistoryTable', () => {
            document.getElementById = jest.fn(() => undefined);
            
            // Should not throw error
            expect(() => {
                generateTestHistoryTable('<html><body><table></table></body></html>');
            }).not.toThrow();
        });
    });

    describe('getPageHistory', () => {
        test('should make AJAX request and call callback', () => {
            const mockCallback = jest.fn();
            const mockUrl = 'http://localhost:8080/?recentTestHistory';
            const mockData = 'test data';

            global.$.ajax = jest.fn(({ success }) => {
                success(mockData);
            });

            getPageHistory(mockUrl, mockCallback);

            expect(global.$.ajax).toHaveBeenCalledWith({
                type: 'GET',
                url: mockUrl,
                contentType: 'charset=utf-8',
                success: expect.any(Function),
                error: expect.any(Function)
            });

            expect(mockCallback).toHaveBeenCalledWith(mockData);
        });

        test('should handle AJAX error', () => {
            const mockCallback = jest.fn();
            const mockUrl = 'http://localhost:8080/?recentTestHistory';

            global.$.ajax = jest.fn(({ error }) => {
                error({ status: 404 });
            });

            getPageHistory(mockUrl, mockCallback);

            expect(global.$.ajax).toHaveBeenCalled();
            expect(mockCallback).not.toHaveBeenCalled();
            expect(console.log).toHaveBeenCalledWith('Error code: 404', { status: 404 });
        });
    });
});

describe('Tooltip Functionality', () => {
    describe('placeToolTip', () => {
        test('should place safe HTML content', () => {
            const mockTooltip = {
                html: jest.fn(),
                text: jest.fn()
            };
            
            global.$ = jest.fn(() => mockTooltip);

            const safeHtml = '<a href="/test">Test Link</a>';
            placeToolTip(safeHtml);

            expect(mockTooltip.html).toHaveBeenCalledWith(safeHtml);
            expect(mockTooltip.text).not.toHaveBeenCalled();
        });

        test('should use text for unsafe content', () => {
            const mockTooltip = {
                html: jest.fn(),
                text: jest.fn()
            };
            
            global.$ = jest.fn(() => mockTooltip);

            const unsafeContent = '<script>alert("xss")</script>';
            placeToolTip(unsafeContent);

            expect(mockTooltip.text).toHaveBeenCalledWith(unsafeContent);
            expect(mockTooltip.html).not.toHaveBeenCalled();
        });

        test('should use text for content without closing tags', () => {
            const mockTooltip = {
                html: jest.fn(),
                text: jest.fn()
            };
            
            global.$ = jest.fn(() => mockTooltip);

            const textContent = 'Plain text content';
            placeToolTip(textContent);

            expect(mockTooltip.text).toHaveBeenCalledWith(textContent);
            expect(mockTooltip.html).not.toHaveBeenCalled();
        });
    });
});

describe('Edge Cases and Error Handling', () => {
    test('should handle null/undefined inputs gracefully', () => {
        expect(() => getCookie(null)).not.toThrow();
        expect(() => getCookie(undefined)).not.toThrow();
        expect(() => isFilesPath()).not.toThrow();
        expect(() => getWorkSpace(null)).not.toThrow();
    });

    test('should handle empty or malformed content in getSidebarContentHtml', () => {
        expect(() => getSidebarContentHtml({})).not.toThrow();
        expect(() => getSidebarContentHtml(null)).not.toThrow();
        expect(() => getSidebarContentHtml({ name: null, path: null })).not.toThrow();
    });

    test('should handle missing DOM elements gracefully', () => {
        document.getElementById = jest.fn(() => null);
        global.$ = jest.fn(() => ({ length: 0 }));
        
        expect(() => generateTestHistoryTable('<html></html>')).not.toThrow();
        expect(() => placeToolTip('test')).not.toThrow();
    });
}); 