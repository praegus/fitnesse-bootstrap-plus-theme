
// if the document has been loaded, then get data from toolTipData.csv
function getTooltips()
{

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "files/fitnesse/bootstrap-plus/csv/toolTipData.csv", false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;

}
function getArticleHeight(){
    var article = document.querySelector('article');
    return article.offsetHeight;
}
// an array is made with the csv text,split then a random tooltip is chosen and displayed as injected DOM element in the bodygit r
function displayToolTip(text,height) {
    var textarray = text.split(",");
    var PickedTip = Math.floor(Math.random() * textarray.length);
    var tooltip = document.createElement("div");
    var parent = document.querySelector('body');
    parent.appendChild(tooltip);
    tooltip.id = "tooltip";
   // var heighttest = article.offsetHeight;
    if(height < 400){
        tooltip.setAttribute('style','margin-top: 22%;text-align: center;')
    }else{
        tooltip.setAttribute('style','margin-top: 8%;text-align: center;');
    }

    tooltip.innerHTML = '<img style="position:relative;top:30px:" src="/files/fitnesse/bootstrap-plus/img/hint.png"><p style="position:relative;top:30px:" id="tooltip">' + textarray[PickedTip] + '</p>';

    return tooltip.getAttribute('style') + PickedTip + "," + textarray[PickedTip];
}
function callback(callback,param1,param2){
    callback(param1,param2);
}
$(document).ready(function () {
    callback(displayToolTip,getTooltips(),getArticleHeight());
});


module.exports = displayToolTip;