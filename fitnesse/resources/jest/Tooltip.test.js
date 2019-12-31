const tooltip = require('bootstrap-plus/js/bootstrap-plus-comakership');

//tests if DOM element is correct by giving different MOCK article heights
test('tooltip Correct DOM element test', () => {
    expect(tooltip.displayToolTip("text",200)).toBe("position:relative;top:520px;text-align:center;0,text");
    expect(tooltip.displayToolTip("text",300)).toBe("position:relative;top:482px;text-align:center;0,text");
    expect(tooltip.displayToolTip("text",600)).toBe("margin-top: 8%;text-align: center;0,text");
    //checks if editpage is being detected and the tooltip is adjusted accordingly
    var body = document.querySelector('body');
    body.className = "editPage";
    expect(tooltip.displayToolTip("text",600)).toBe("margin-top: 1%;text-align: center;0,text");
});
//checks if inputted CSV format data comes out correctly
test('tooltip Correct data randomization test', () => {
    //init code
    var text = "text1,text2,text3";
    var textarray = text.split(",");
    //splits off result from other test
    var result = tooltip.displayToolTip(text);
    var seperatedresult = result.split(";");
    //splits usable result
    var seperatedresult2 = seperatedresult[2].split(",");
    //checks if usable result is correct
    expect(textarray[seperatedresult2[0]]).toBe(seperatedresult2[1]);
});

