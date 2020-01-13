
// if the document has been loaded, then get data from toolTipData.csv
// Get list of tooltips
function getToolTips(callback){
    $.get("files/fitnesse/bootstrap-plus/csv/toolTipData.csv",function(data){
        const tooltips = data;
        // Activate function displayToolTip
        callback(tooltips);
    });
}

// Picks random tooltip
function displayToolTip(text) {
    // Picks random tip
    const tipsArray = text.split(",");
    const pickedTip = Math.floor(Math.random() * tipsArray.length);

    placeToolTip(tipsArray, pickedTip);

    // Returns chosen tip in string for jest
    return pickedTip+","+tipsArray[pickedTip];
}

// Places picked tooltips on the page
function placeToolTip(tipsArray, pickedTip) {
    const textfield = document.getElementsByClassName("tooltip-text");
    console.log(textfield);
    textfield[0].innerHTML = tipsArray[pickedTip];
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
