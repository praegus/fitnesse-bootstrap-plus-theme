
$(document).ready(getVersionData);
function getVersionData(callback){
    var versions;
 $.get("https://api.github.com/repos/unclebob/fitnesse/tags",function(data){
     versions = data;
     callback(versions);
    });

}

$.get("prop",function(data){
    console.log(data);
});

}
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
  

   console.log(versions[0]);
}
getVersionData(versionCheck);