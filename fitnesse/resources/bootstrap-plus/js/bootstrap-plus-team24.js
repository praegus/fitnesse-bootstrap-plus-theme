
// if the document has been loaded, then get data from toolTipData.csv
function getTooltips()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "files/fitnesse/bootstrap-plus/csv/toolTipData.csv",false); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
// gets article height
function getArticleHeight(){
    if (document.querySelector('article') === undefined) {
    } else {
        var article = document.querySelector('article');
        return article.offsetHeight;
    }
}

function displayToolTip(text, height) {
    //initialization code
    var textarray = text.split(",");
    var PickedTip = Math.floor(Math.random() * textarray.length);
    var tooltip = document.createElement("div");
    var parent = document.querySelector('body');
    //checks what height article is and decides on what height to put the tooltip
    if(height < 220){
        tooltip.setAttribute('style','position:relative;top:520px;text-align:center;')
    }
    else if(height < 500){
        tooltip.setAttribute('style','position:relative;top:482px;text-align:center;')
    }else{
        tooltip.setAttribute('style','margin-top: 8%;text-align: center;');
    }
    //creates DOM element and appends it
    parent.appendChild(tooltip);
    tooltip.id = "tooltip";
    tooltip.innerHTML = '<img style="position:relative;" src="/files/fitnesse/bootstrap-plus/img/hint.png"><p style="display:inline;position:relative;" id="tooltip">' + textarray[PickedTip] + '</p>';
    //return for unit-testing
    return tooltip.getAttribute('style') + PickedTip + "," + textarray[PickedTip];
}
// callback makes sure toolTip function receives data at the same time
function callback(callback,param1,param2){
    callback(param1,param2);
}
//executes callback function when document is ready
$(document).ready(function () {
    callback(displayToolTip,getTooltips(),getArticleHeight());
});

try{
module.exports = displayToolTip;
}catch (e) {}