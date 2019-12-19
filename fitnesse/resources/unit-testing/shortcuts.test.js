const shortcut = require('bootstrap-plus/js/bootstrap-plus-gold');

test('no duplicate elements',()=>{
    var key = new KeyboardEvent('keydown', {'Key': '?'});

    document.body.innerHTML =
        '<div>'+
        '<ul class="help-list"'>'

    document.dispatchEvent(key);
    console.log(shortcut(key));
});