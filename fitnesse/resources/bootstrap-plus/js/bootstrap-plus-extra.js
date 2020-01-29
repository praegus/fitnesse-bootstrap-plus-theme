$(document).ready(
    $.get("http://localhost:9090/?testHistory&format=sorted", function (data) {
      var check = document.getElementById("testHistoryTable");  
      if (check != undefined){
            var parser = new DOMParser();
            var parserhtml = parser.parseFromString(data, 'text/html');
            var table = parserhtml.getElementsByTagName("table")[0];
            var rows = table.getElementsByTagName("tr");
            var resultsReportTd = rows[0].childNodes[9];
            // set colspan
            resultsReportTd.innerText = "Last 5 Results";
            resultsReportTd.setAttribute("colspan",5);

            if(rows.length > 5){
                var rowNumberToSlice = rows.length - 5;
                $(rows,"tr").slice(-rowNumberToSlice).remove();
            }
            for (var i=1;i<rows.length;i++){
                var cells = rows[i].getElementsByTagName("td");
                    if (cells.length > 9){
                        var colNumberToSlice = cells.length - 9;
                        $(cells,"td").slice(-colNumberToSlice).remove();
                    }
            }


            check.appendChild(table);
      }
         
      
    })
);