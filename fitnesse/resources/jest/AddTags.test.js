const clickFunction = require('bootstrap-plus/js/bootstrap-plus');

describe('US9 - Add tags', () => {
    test("Check keyboard event", () => {
        console.log(clickFunction.addTagInput)
        var li = document.createElement("li");
        li.innerHTML =
            "\t\t\t\t\t<i class=\"fa fa-file-o icon-static\" aria-hidden=\"true\"></i>&nbsp;<a href=\"TestSuiteDemo.FrontEndTests.SuiteTearDown\" class=\"static\">Suite Tear Down</a><i class=\"fas fa-plus-circle addTag\" style=\"visibility: hidden;\"></i>\n\t\t\t\t\t<span class=\"pageHelp\">: Stops browser after tests complete.</span>\n\t\t\t\t";

        expect(clickFunction.addTagInput(li)).toBe('not pressed')
    });

    test("Check current tag list", () => {
        console.log(clickFunction.GetCurrentTagList)
        var li = document.createElement("li");
        li.innerHTML =
            "\t\t\t\t\t<i class=\"fa fa-file-o icon-static\" aria-hidden=\"true\"></i>&nbsp;<a href=\"TestSuiteDemo.FrontEndTests.SuiteTearDown\" class=\"static\">Suite Tear Down</a><i class=\"fas fa-plus-circle addTag\" style=\"visibility: hidden;\"></i>\n\t\t\t\t\t<span class=\"pageHelp\">: Stops browser after tests complete.</span>\n\t\t\t\t";

        //Get current input value & replace empty spaces at the end of input
        var inputValue = "test5";
        //Get href value of the a tag
        var currentURL = $(li).siblings('a').attr('href');

        expect(clickFunction.GetCurrentTagList(currentURL, inputValue)).toBe(currentURL + " " + inputValue);
    });
});