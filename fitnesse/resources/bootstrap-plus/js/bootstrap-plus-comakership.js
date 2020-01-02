/*
$(document).ready(createCORSRequest);
function createCORSRequest() {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {

        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.open("get", "http://central.maven.org/maven2/org/fitnesse/fitnesse/maven-metadata.xml", true);

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open("get", "http://central.maven.org/maven2/org/fitnesse/fitnesse/maven-metadata.xml");

    } else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}

var xhr = createCORSRequest('GET', "http://central.maven.org/maven2/org/fitnesse/fitnesse/maven-metadata.xml");
if (!xhr) {
    throw new Error('CORS not supported');
}
*/
$(document).ready(getVersionData);

function getVersionData(callback){
    var versions;
 $.get("https://api.github.com/repos/unclebob/fitnesse/tags",function(data){
     versions = data;
     callback(versions);
    });

}
$.get("/FitNesse.ReleaseNotes",function(data){
    var parser = new DOMParser();
    var XMLversions = parser.parseFromString(data,"text/xml");
  console.log(XMLversions);

});
function versionCheck(data) {
    var versions = []
   for (var i=0; i < data.length; i++){
       data[i].name = data[i].name.replace(/\D/g,'');
       if (data[i].name == ""){
           data.splice(i,1);
       }
       data[i].name = parseInt(data[i].name);
       versions.push(data[i].name);
   }
   versions.sort();
   versions.reverse();
   console.log(versions);
   console.log(versions[0]);
}
getVersionData(versionCheck);