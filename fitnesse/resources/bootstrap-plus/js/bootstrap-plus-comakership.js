//checks if user reloaded page with the shortcut panel open
$('document').ready(function () {
    if (window.location.href.search("#-shortcut-keys") != '-1') {
        //fires createshortcuts function
        Createshortcuts("urlfound");
    }
});
//event listener for keys
document.addEventListener('keydown', Createshortcuts);

//function for creating new shortcuts
function Createshortcuts(e) {
    //checks if e is "?" or "urlfound"
    if (e.key === "?" || e == "urlfound") {
        // checks if element already exists to avoid duplicates
        if (ul != document.getElementById("bootstrap-shortcuts")) {
            //removes duplicate element
            document.getElementById("bootstrap-shortcuts").remove();
        }
        //creates new element
        var ul = document.createElement("ul");
        ul.className = "help-list";
        ul.id = "bootstrap-shortcuts";
        ul.style = "float:right;";
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
            '    <span class="help-key-def">search context helper</span>\n' +
            '   </li>\n';
        //identifies and appends to parent element
        var helplist = document.getElementsByClassName("help-list");
        var parent = helplist[0].parentElement;
        parent.appendChild(ul);
//returns helplist for testing
        var helplist = document.getElementsByClassName("help-list");

        return helplist.length;
    }
}

//module is not defined, catches error
try {
    module.exports = {
        Createshortcuts: Createshortcuts,
    }
} catch (e) {
}