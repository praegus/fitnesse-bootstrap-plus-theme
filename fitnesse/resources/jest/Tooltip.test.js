const tooltip = require('bootstrap-plus/js/bootstrap-plus-team24');

//tests if DOM element is correct by giving different MOCK article heights
test('tooltip Correct DOM element test', () => {
    expect(tooltip("text",300)).toBe("margin-top: 22%;text-align: center;0,text");
    expect(tooltip("text",500)).toBe("margin-top: 8%;text-align: center;0,text");

});
//checks if inputted CSV format data comes out correctly
test('tooltip Correct data randomization test', () => {
    //init code
    var text = "text1,text2,text3";
    var textarray = text.split(",");
    //splits off result from other test
    var result = tooltip(text);
    var seperatedresult = result.split(";");
    //splits usable result
    var seperatedresult2 = seperatedresult[2].split(",");
    //checks if usable result is correct
    expect(textarray[seperatedresult2[0]]).toBe(seperatedresult2[1]);
});

