// if the document has been loaded, then get data from toolTipData.csv
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "files/fitnesse/bootstrap-plus/csv/toolTipData.csv",
        dataType: "text",
        success: function(data) {
            displayToolTip(data);
        }
    });
});
// an array is made with the csv text,split then a random tooltip is chosen and displayed as injected DOM element in the body
//the function also checks if the page in question is the page with the editor since that page doesnt contain a footer
// after that it checks what the length of the page is, so it can display the tooltip at the appropriate position.
/*
function displayToolTip(text) {
    var textarray = text.split(",");
    var PickedTip = Math.floor(Math.random() * textarray.length);
    var article = document.querySelector('article');
    var tooltip = document.createElement("div");
    var body = document.querySelector('body');
    console.log(body.className);
    if(article.offsetHeight < 1000 && body.className != "editPage"){
        var parent = document.querySelector('footer');
        tooltip.setAttribute("style","margin-top: -4%;text-align: center;");
    }else{
        var parent = body;
        tooltip.setAttribute("style","width:400px;margin:-1% auto;height:20px;margin-top:22px;text-align:center");
}
    parent.appendChild(tooltip);
    tooltip.id = "tooltip";
    tooltip.innerHTML = '<img src="/files/fitnesse/bootstrap-plus/img/hint.png"><p id="tooltip">' + textarray[PickedTip] + '</p>';
}

 */
function displayToolTip(text) {
    var textarray = text.split(",");
    var PickedTip = Math.floor(Math.random() * textarray.length);
    var article = document.querySelector('article');
    var tooltip = document.createElement("div");
    var parent = document.querySelector('body');
    parent.appendChild(tooltip);
    tooltip.id = "tooltip";
    tooltip.setAttribute('style','margin-top: 7%;text-align: center;')
    tooltip.innerHTML = '<img style="position:relative;top:30px:" src="/files/fitnesse/bootstrap-plus/img/hint.png"><p style="position:relative;top:30px:" id="tooltip">' + textarray[PickedTip] + '</p>';
}
