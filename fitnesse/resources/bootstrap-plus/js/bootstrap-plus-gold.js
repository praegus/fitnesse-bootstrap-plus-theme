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
function displayToolTip(text) {
    var textarray = text.split(",");
    var PickedTip = Math.floor(Math.random() * textarray.length);
    var body = document.querySelector('body');
    var tooltip = document.createElement("div");
    body.appendChild(tooltip);
    tooltip.id = "tooltip";
    tooltip.innerHTML = '<img src="/files/fitnesse/bootstrap-plus/img/hint.png"><p id="tooltip">' + textarray[PickedTip] + '</p>';
}