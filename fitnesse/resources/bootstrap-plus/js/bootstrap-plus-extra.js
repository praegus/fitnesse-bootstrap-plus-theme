$(document).ready(
    $.get("http://localhost:9090/?testHistory", function (data) {
        var parser = new DOMParser();
        var testhistory = parser.parseFromString(data,'text/html');
        testhistory = testhistory.getElementsByTagName("table")[0];
        var tablerows = testhistory.getElementsByTagName("th");
        for (var i = 1;i<tablerows.length; i++) {
               var tablerowdate = tablerows[i].childNodes[3];
               var tablerowdate = tablerowdate.innerHTML.replace(/\D+/g,"").replace(",","").replace(":","").replace(/\ /g,"");
     console.log(tablerowdate);
        }


        document.body.appendChild(testhistory);

        console.log(testhistory);

    })
)