
// if the document has been loaded, then get data from toolTipData.csv
function getToolTips(callback){
    var tooltips;
    $.get("files/fitnesse/bootstrap-plus/csv/toolTipData.csv",function(data){
        tooltips = data;
        callback(tooltips);
    });

}
function displayToolTip(text) {
    //initialization code
    var textarray = text.split(",");
    var PickedTip = Math.floor(Math.random() * textarray.length);
    var textfield = document.getElementById("tooltip");
    textfield.innerHTML = textarray[PickedTip];

    return PickedTip+","+textarray[PickedTip];
}
//executes callback function when document is ready
$(document).ready(function () {
    getToolTips(displayToolTip);
});

try{
module.exports = {
    displayToolTip: displayToolTip
};
}catch (e) {}
