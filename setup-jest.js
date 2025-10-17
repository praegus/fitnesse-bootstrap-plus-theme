// Ensure jsdom has a sane default URL and a writable location
try {
  if (typeof window !== 'undefined' && window.location && typeof window.location === 'object') {
    // Replace location with a real URL instance we can mutate without jsdom navigation
    Object.defineProperty(window, 'location', {
      writable: true,
      value: new URL('http://localhost/FrontPage')
    });
    global.location = window.location;
  }
} catch (_) {}

// Bind jQuery to the jsdom window and expose globals
const jq = require('jquery');
global.$ = global.jQuery = jq;

// Provide minimal stubs for browser-only plugins used in code
if (!$.fn.resizable) {
  $.fn.resizable = function() { return this; };
}
if (!$.fn.contextMenu) {
  $.fn.contextMenu = function() { return this; };
}
$.ui = $.ui || { autocomplete: { filter: (arr) => arr, escapeRegex: (s) => s } };

// Testing Library matchers
try { require('@testing-library/jest-dom'); } catch (_) {}

// Mock $.ajax by default; tests can override per-suite
$.ajax = jest.fn();
