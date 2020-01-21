$(document).ready(
    $.get("http://localhost:9090/recentChanges", function (data) {
      console.log(data);



    })
);