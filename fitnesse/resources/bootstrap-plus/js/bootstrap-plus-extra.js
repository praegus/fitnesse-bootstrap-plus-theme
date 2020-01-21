/*
=== FITNESSE VERSION CHECKER ===
this is a function which checks the version of fitnesse and the toolchain which contains bootstrap.
 further update checks are possible by adding some simple code snippets as described below
 at the bottom of this function there will be a number 1 at this number you'll find callbacks. you can add your own callback to add a version check
 using format: getVersionData(versionCheck, [oldversionurl], [newversionurl]);
 fields with [] are expected to be replaced with actual values.
 old version expects a version number. this may contain letters as the function cleans it off letters and parses to int
 old version expects a link to the github api towards tags. this may contain letters as the function cleans it off letters and parses to int
 ==================================
*/
function getVersionData(callback, currentversionurl, newestversionurl) {
    // various inits for global use in function
    var newestversion;
    var currentversion;
    var appkind;
    // gets current function
    $.get(currentversionurl, function (data) {
        // removes incoming data of any dots or letters
        currentversion = data.replace(/\./g, "").replace(/\D/g, "");
        //gets newestversion
        $.get(newestversionurl, function (data) {
            //init
            var versions = [];
            // for loop on the length of data
            for (var i = 0; i < data.length; i++) {
                // cleans the data.name from any letters
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
            // as the release list from github is unsorted(which is weird), versions gets sorted
            versions.sort();
            // sort puts small first so we reverse te array so we know the biggest is always first
            versions.reverse();
            // passing the newest version to newest version
            newestversion = versions[0];
            // generates text for in version checker
            appkind = newestversionurl.split("/");
            appkind = appkind[5].replace(/\-/g, " ");
            // callback
            callback(newestversion, currentversion, appkind);
            //error handling
        }).fail(function () {
            console.log("the version checker ran into an error");
        })
        //error handling
    }).fail(function () {
        console.log("the version checker ran into an error");
    })
}

function versionCheck(newversion, currentversion, appkind) {
    //checks if the current version is equal or lower then the newest for error handling
    if (currentversion <= newversion) {
        // checks if current version is lower than new version
        if (currentversion < newversion) {
            //set status text
            var status = "outdated";
            //return for unit-testing
            return "outdated";
        } else if (currentversion == newversion) {
            //set status text
            var status = "up-to-date";
            //return for unit-testing
            return "up-to-date";
        }
    } else {
        //set status text
        var status = "ahead";
        //return for unit-testing
        return "current version is to high";
    }
    //append to generate content
    $("#versioncheck").append("<tr class='check'><td><p>"+appkind+"</p></td>"+"<td><p>"+"v"+currentversion+"</p></td>"+"<td><p>"+"v"+newversion+"</p></td>"+"<td><p>"+status+"</p></td></tr>");
}

//wait for document to get ready
$(document).ready(function () {
    // calls on DOM element with id versioncheck
    var versiondiv = document.getElementById("versioncheck");
    //checks if versiondiv exists, since versiondiv wil only exist on the frontpage from Skeleton.VM
    if (versiondiv != undefined) {
        //makes callbacks, description at the top
        //=== 1. VERSION CHECKER CALLBACKS
        getVersionData(versionCheck, window.location.hostname + "/?fitNesseVersion", "https://api.github.com/repos/unclebob/fitnesse/tags");
        getVersionData(versionCheck, window.location.hostname + "/?fitNesseToolchainVersion", "https://api.github.com/repos/praegus/toolchain-fitnesse-plugin/tags");
        //=========
    }
});

try {
    module.exports = {
        versionCheck: versionCheck
    };
} catch (e) {
}
