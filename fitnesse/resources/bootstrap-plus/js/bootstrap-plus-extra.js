$(document).ready(
    $.get("http://localhost:9090/?dashboardTestHistory", function (data) {
      var check = document.getElementById("testHistoryTable");  
      if (check != undefined){
            var parser = new DOMParser();
            var parserhtml = parser.parseFromString(data, 'text/html');
            var table = parserhtml.getElementsByTagName("table")[0];
            check.appendChild(table);   
      }
         
      
    })
);