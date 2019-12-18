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
// an array is made with the csv text,split then a random tooltip is chosen and displayed as injected DOM element in the bodygit r
function displayToolTip(text) {
    var textarray = text.split(",");
    var PickedTip = Math.floor(Math.random() * textarray.length);
    var article = document.querySelector('article');
    var tooltip = document.createElement("div");
    var parent = document.querySelector('body');
    parent.appendChild(tooltip);
    tooltip.id = "tooltip";
    if(article.offsetHeight < 400){
        tooltip.setAttribute('style','margin-top: 22%;text-align: center;')
    }else{
        tooltip.setAttribute('style','margin-top: 8%;text-align: center;');
    }

    tooltip.innerHTML = '<img style="position:relative;top:30px:" src="/files/fitnesse/bootstrap-plus/img/hint.png"><p style="position:relative;top:30px:" id="tooltip">' + textarray[PickedTip] + '</p>';
}