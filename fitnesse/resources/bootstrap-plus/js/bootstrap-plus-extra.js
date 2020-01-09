

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
            switch (newestversionurl) {
                case newestversionurl.includes("fitnesse"):
                    appkind = "FitNesse";
                    break;
                case newestversionurl.includes("fitnesse-bootstrap"):
                   appkind = "Bootstrap-plus"
                    break;
            }

            callback (newestversion,currentversion,appkind);

        })



    })


}

function versionCheck(newversion,currentversion,appkind) {
var versioncheck =  document.createElement("div");
var check;
if (currentversion <= newversion){
if (currentversion < newversion){
    check = document.createElement("p");
    check.className = "checkfailed";
    check.innerHTML = "- out of date";
}else if (currentversion == newversion){
    check = document.createElement("p");
    check.className = "checkpassed";
    check.innerHTML = "- up to date";
}
versioncheck.appendChild(check);


}else
    versioncheck.innerHTML = "something went wrong, check console log";
    versioncheck.appendChild(check);
console.log( "it appears that the current version of "+currentversion+" was higher than the newest version of "+newversion);
}

$(document).ready(function(){
var versiondiv = document.getElementById("versioncheck");
console.log(versiondiv);
if (versiondiv != undefined) {
    console.log("trigger");
    getVersionData(versionCheck, "http://localhost:9090/?fitNesseVersion", "https://api.github.com/repos/unclebob/fitnesse/tags");
    getVersionData(versionCheck, "files/fitnesse/bootstrap-plus/csv/bootstrap-version.csv", "https://api.github.com/repos/praegus/fitnesse-bootstrap-plus-theme/tags");

}});