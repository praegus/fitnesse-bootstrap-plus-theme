$(document).ready(
    $.get("http://localhost:9090/?dashboardTestHistory", function (data) {
      var parser = new DOMParser();
      var parserhtml = parser.parseFromString(data, 'text/html');
      var article = document.getElementsByTagName("article")[0];
      var table = parserhtml.getElementsByTagName("table")[0];
      article.appendChild(table);
    })
);