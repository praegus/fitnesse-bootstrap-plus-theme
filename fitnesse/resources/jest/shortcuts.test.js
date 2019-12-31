const shortcut = require('bootstrap-plus/js/bootstrap-plus-team24');

test('no duplicate elements',()=>{
    // initialize new keyboard event
    var key = new KeyboardEvent('keydown', {'key': '?'});
   // create DOM element so function doesnt make an error
    document.body.innerHTML =
        '<div>'+
        '<ul class="help-list">';
    // expect the length of all DOM elements with the class "help-list" wich is 2
 expect(shortcut.Createshortcuts(key)).toBe(2);
 expect(shortcut.Createshortcuts("urlfound")).toBe(2);
});