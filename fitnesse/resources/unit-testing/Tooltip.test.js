const tooltip = require('bootstrap-plus/js/bootstrap-plus-gold');


test('tooltip syling test', () => {
    console.log(tooltip("text",300));
    expect(expect(tooltip("text",300)).toBe("margin-top: 22%;text-align: center;0,text"));
    expect(expect(tooltip("text",500)).toBe("margin-top: 8%;text-align: center;0,text"));

});

test('tooltip Correct data test', () => {
    var text = "text1,text2,text3";
    var textarray = text.split(",");


    var result = tooltip(text);
    var seperatedresult = result.split(";");
    var seperatedresult2 = seperatedresult[2].split(",");
console.log();

    expect(textarray[0]).toBe(seperatedresult2[1]);
});

