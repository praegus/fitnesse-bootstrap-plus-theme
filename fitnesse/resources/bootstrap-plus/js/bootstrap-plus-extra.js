

function getVersionData(callback){
    var versions;
    var currentversion
    $.get("https://api.github.com/repos/unclebob/fitnesse/tags",function(data) {
        versions = data;

callback(versions);
    })
    $.get("http://localhost:9090/?fitNesseVersion",function(data) {
        currentversion = data;
        callback(currentversion);


    })

}
var newestversion = null;
function versionCheck(data) {
if (newestversion == null) {

    var versions = []
    for (var i = 0; i < data.length; i++) {
        data[i].name = data[i].name.replace(/\D/g, '');
        if (data[i].name == "") {
            data.splice(i, 1);
        }
        data[i].name = parseInt(data[i].name);
        versions.push(data[i].name);
    }
    versions.sort();
    versions.reverse();

    console.log(versions[0]);
    newestversion = versions[0];
}else {
    var checkDOM = document.getElementById("versioncheck");
    if (newestversion != data){
       checkDOM.innerHTML = "<p>Release v"+data+"</p><p> - Out of date</p>"

    }
}
}

getVersionData(versionCheck);