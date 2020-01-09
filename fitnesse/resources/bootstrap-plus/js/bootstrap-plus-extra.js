

function getVersionData(callback,currentversionurl,newestversionurl){
    var newestversion;
    var currentversion;
    var appkind;

    $.get(currentversionurl,function(data) {
        currentversion = data.replace(/\./g,"");



        $.get(newestversionurl,function(data) {
            var versions = [];
            for (var i = 0; i < data.length; i++) {
                data[i].name = data[i].name.replace(/\D/g, "");
                if (data[i].name == "") {
                    data.splice(i, 1);
                }
                data[i].name = parseInt(data[i].name);
                versions.push(data[i].name);
            }

            versions.sort();
            versions.reverse();
            newestversion = versions[0];
            if (newestversionurl.includes("fitnesse-bootstrap")){
                appkind = "Bootstrap-plus";
            }
            else if (newestversionurl.includes("fitnesse")){
                appkind = "FitNesse";
            }

            callback (newestversion,currentversion,appkind,newestversionurl);

        })



    })


}

function versionCheck(newversion,currentversion,appkind,newesturl) {
var versiontable = document.getElementById("versioncheck");
var versiontablebody =  versiontable.getElementsByTagName("tbody")[0];
var versioncheck =  document.createElement("tr");
    versioncheck.className = "check";
var text =  document.createElement("td");
    text.innerHTML = appkind +" Release v"+currentversion;
var check = document.createElement("td");
var outdated = false;

if (currentversion <= newversion){
if (currentversion < newversion){
    outdated = true
    check.className = "checkfailed";
    check.innerHTML = " outdated";
    var updateurl = newesturl.replace("api.","").replace("/repos","").replace("/tags","");
    var linktr = document.createElement("tr");
    var linktd = document.createElement("td");
    var link = document.createElement("a");
    var linktext = document.createElement("p");
    linktext.innerHTML = "please update "+appkind;
    link.href = updateurl;
    link.innerHTML = " here";
    link.setAttribute("target","_blank");
    linktd.className = "update";
    linktd.setAttribute("colspan","2");
    linktd.appendChild(linktext);
    linktd.appendChild(link);
    linktr.appendChild(linktd);


}else if (currentversion == newversion){
    check.className = "checkpassed";
    check.innerHTML = " up-to-date";

}
versioncheck.appendChild(text);
versioncheck.appendChild(check);
versiontablebody.appendChild(versioncheck);
if (outdated == true){
    versiontablebody.appendChild(linktr);
}



}else{
  check.innerHTML = "something went wrong, check console log";
check.className = "checkerror";
    versioncheck.appendChild(check);
    versiontablebody.appendChild(versioncheck);
console.log( "it appears that the current version of "+currentversion+" was higher than the newest version of "+newversion);
}}
$(document).ready(function(){
var versiondiv = document.getElementById("versioncheck");
console.log(versiondiv);
if (versiondiv != undefined) {
    console.log("trigger");
    getVersionData(versionCheck, "http://localhost:9090/?fitNesseVersion", "https://api.github.com/repos/unclebob/fitnesse/tags");
    getVersionData(versionCheck, "files/fitnesse/bootstrap-plus/csv/bootstrap-version.csv", "https://api.github.com/repos/praegus/fitnesse-bootstrap-plus-theme/tags");

}});