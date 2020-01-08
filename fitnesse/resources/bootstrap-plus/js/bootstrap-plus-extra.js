
$(document).ready(getVersionData,getCurrentVersion);
function getVersionData(callback){
    var versions;
    $.get("https://api.github.com/repos/unclebob/fitnesse/tags",function(data) {
        versions = data;
        callback(versions);
    })}
function getCurrentVersion(callback){
    var versions;
    $.get("localhost:9090/?fitnesseVersion",function(data) {
        currentversion = data;
        console.log(data);
        callback(currentversion);
    })}


function versionCheck(data,currentversion) {
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

   console.log(versions);
}
getVersionData(versionCheck);