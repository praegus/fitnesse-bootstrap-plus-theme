const tooltip = require('bootstrap-plus/js/bootstrap-plus-extra');
//checks if inputted CSV format data comes out correctly
test('tooltip Correct data randomization test', () => {
    document.body.innerHTML=
        '<p id="tooltip">'+'</p>';

    //init code
    var text = "text1,text2,text3";
    var textarray = text.split(",");
    //splits off result from other test
    var result = tooltip.displayToolTip(text)
    //splits usable result
    var seperatedresult = result[2].split(",");
    expect(textarray[seperatedresult[0]]).toBe(seperatedresult[1]);
});

