//checks if ? is pressed

document.addEventListener('keydown', Createshortcuts);

function Createshortcuts(key) {
    if (key.key === "?"){
        // checks if element in question already exists as to avoid duplicates
        if(ul != document.getElementById("bootstrap-shortcuts")) {
            //removes duplicate element
            document.getElementById("bootstrap-shortcuts").remove();
        }
        //creates new element
    var ul = document.createElement("ul");
    ul.className = "help-list";
    ul.id ="bootstrap-shortcuts";
    ul.innerHTML =
        '<li><h4>Bootstrap-plus</h4></li>\n' +
        '   <li>\n' +
        '    <kbd>CTRL+space</kbd>\n' +
        '    <span class="help-key-def">Autocomplete suggestions</span>\n' +
        '   </li>\n' +
        '   <li>\n' +
        '    <kbd>CTRL+.</kbd>\n' +
        '    <span class="help-key-def">validate</span>\n' +
        '   </li>\n' +
        '   <li>\n' +
        '    <kbd>CTRL+,</kbd>\n' +
        '    <span class="help-key-def">search for a method/scenario in the contect helper</span>\n' +
        '   </li>\n';
    //identifies and appends to parent element
var helplist = document.getElementsByClassName("help-list");
var parent = helplist[0].parentElement;
parent.appendChild(ul);
//returns helplist for testing
var helplist = document.getElementsByClassName("help-list");
return helplist;
}}
module.exports = Createshortcuts;