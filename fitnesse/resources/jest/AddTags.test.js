const clickFunction = require('bootstrap-plus/js/bootstrap-plus');

describe('US9 - Add tags', () => {
    test("Check keyboard event", () => {

        var li = document.createElement("li");
        li.innerHTML =
            "\t\t\t\t\t<i class=\"fa fa-file-o icon-static\" aria-hidden=\"true\"></i>&nbsp;<a href=\"TestSuiteDemo.FrontEndTests.SuiteTearDown\" class=\"static\">Suite Tear Down</a><i class=\"fas fa-plus-circle addTag\" style=\"visibility: hidden;\"></i>\n\t\t\t\t\t<span class=\"pageHelp\">: Stops browser after tests complete.</span>\n\t\t\t\t";

        expect(clickFunction.addTagInput(li)).toBe('not pressed')
    });

    test("Check current tag list", () => {
        const event = new KeyboardEvent('Keyup',{
            keycode:13,
        })


        var li = document.createElement("li");
        li.innerHTML =
            "\t\t\t\t\t<i class=\"fa fa-file-o icon-static\" aria-hidden=\"true\"></i>&nbsp;<a href=\"TestSuiteDemo.FrontEndTests.SuiteTearDown\" class=\"static\">Suite Tear Down</a><i class=\"fas fa-plus-circle addTag\" style=\"visibility: hidden;\"></i>\n\t\t\t\t\t<span class=\"pageHelp\">: Stops browser after tests complete.</span>\n\t\t\t\t";



    });
});