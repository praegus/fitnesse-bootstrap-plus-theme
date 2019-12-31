
var xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "http://central.maven.org/maven2/org/fitnesse/fitnesse/maven-metadata.xml",false);
xmlHttp.setRequestHeader('Content-type',"xml");
xmlHttp.send(null);
console.log(xmlHttp.responseText);

$(document).ready(function(){
$.get("http://central.maven.org/maven2/org/fitnesse/fitnesse/maven-metadata.xml",checkFunction);
});

function checkFunction(data){
    console.log(data);
}