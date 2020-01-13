/*
=== FITNESSE VERSION CHECKER ===
this is a function wich checks the version of fitnesse and the toolchain wich contains bootstrap.
 further update checks are possible by adding some simple code snippets as described below

 at the bottom of this function there will be a number 1 at this number youll find callbacks. you can add your own callback to add a version check
 using format: getVersionData(versionCheck, [oldversionurl], [newversionurl]);
 fields with [] are expected to be replaced with actual values.
 old version expects a version number. this may contain letters as the function cleans it off letters and parses to int
 old version expects a link to the github api towards tags. this may contain letters as the function cleans it off letters and parses to int
 ==================================
*/
function getVersionData(callback,currentversionurl,newestversionurl){
    // various inits for global use in function
    var newestversion;
    var currentversion;
    var appkind;
// gets current function
    $.get(currentversionurl,function(data) {
        // removes incoming data of any dots or letters
        currentversion = data.replace(/\./g,"").replace(/\D/g, "");
        //gets newestversion
        $.get(newestversionurl,function(data) {
            //init
            var versions = [];
            // for loop on the length of data
            for (var i = 0; i < data.length; i++) {
                // cleas the data.name from any letters
                data[i].name = data[i].name.replace(/\D/g, "");
                // removes potential empty array entrys
                if (data[i].name == "") {
                    data.splice(i, 1);
                }
                // parses data.name into an int so its sortable
                data[i].name = parseInt(data[i].name);
                // pushes data.name into versions for further use
                versions.push(data[i].name);
            }
            // as the release list from github is unsorted(wich is weird), versions gets sorted
            versions.sort();
            // sort puts small first so we revers te array so we know the biggest is always first
            versions.reverse();
            // assing the newest version to newest version
            newestversion = versions[0];
            // generates text for in version checker ***** THIS CAN BE OPTIMIZED BY USING THE URL DYNAMICALLY
           appkind = newestversionurl.split("/");
           appkind = appkind[5].replace(/\-/g," ");
            // callback
            callback (newestversion,currentversion,appkind,newestversionurl);
            //error handling
        }).fail(function (){
            console.log("the version checker ran into an error");
        })
        //error handling
    }).fail(function (){
        console.log("the version checker ran into an error");
    })
}

function versionCheck(newversion,currentversion,appkind,newesturl) {
    //various inits for global use within function
var versiontable = document.getElementById("versioncheck");
var versiontablebody =  versiontable.getElementsByTagName("tbody")[0];
var versioncheck =  document.createElement("tr");
var texttd =  document.createElement("td");
var checktd = document.createElement("td");
var text = document.createElement("p");
var outdated = false;
//generates text for version checker
    text.innerHTML = appkind +" Release v"+currentversion;
    //set classname
    versioncheck.className = "check";
//checks if the current version is equal or lower then the newest for error handling
if (currentversion <= newversion){
    // checks if current version is lower than new version
if (currentversion < newversion){
    //various inits
    outdated = true;
    var updateurl = newesturl.replace("api.","").replace("/repos","").replace("/tags","");
    var updatebutton = document.createElement("BUTTON");
    updatebutton.className = "btn btn-primary";
    updatebutton.innerHTML = "Update";
    updatebutton.setAttribute("onClick","window.open('"+updateurl+"','_blank')");
    //set classnames for css
    checktd.className = "checkfailed";
    // set inner html
    checktd.innerHTML = " outdated - ";
    // set various atributes
    // make table content by appending
//checks if current version is equal to new version
}else if (currentversion == newversion){
    //set innerhtml
    checktd.className = "checkpassed";
    checktd.innerHTML = " up-to-date";
}
// generates table content
versioncheck.appendChild(texttd);
versioncheck.appendChild(checktd);
texttd.appendChild(text);
versiontablebody.appendChild(versioncheck);
//if current version is outdated it also appends content to give the user a link to update
if (outdated == true){
checktd.appendChild(updatebutton)
}
//part of error handling, this is what happends when current version is higher than the new version
}else{
    //set inner html to notify something went wrong
  checktd.innerHTML = "something went wrong, check console log";
checktd.className = "checkerror";
// generate content by appending
    versioncheck.appendChild(checktd);
    versiontablebody.appendChild(versioncheck);
    // make console log and output versions
console.log( "it appears that the current version of "+currentversion+" was higher than the newest version of "+newversion);
}}
//wait for document to get ready
$(document).ready(function(){
    // calls on DOM element with id versioncheck
var versiondiv = document.getElementById("versioncheck");
//checks if versiondiv exists, since versiondiv wil only exist on the frontpage from Skeleton.VM
if (versiondiv != undefined) {
    //makes callbacks, description at the top
    //=== 1. VERSION CHECKER CALLBACKS
    getVersionData(versionCheck, "http://localhost:9090/?fitNesseVersion", "https://api.github.com/repos/unclebob/fitnesse/tags");
    getVersionData(versionCheck, "http://localhost:9090/?fitNesseToolchainVersion", "https://api.github.com/repos/praegus/toolchain-fitnesse-plugin/tags");
//    =========
}});