# Getting Started with the Bootstrap-plus FitNesse Theme
This MD is meant for people who want to develop for the Bootstrap-plus FitNesse Theme.

## Running the code 

Bootstrap+ is a maven project because it is a dependency of the Toolchain Plugin.
Every maven project has a pom file that contains the version number of the pom and the dependencies.  

Bootstrap+ can't be run on it's own. It is directly dependent on the [Toolchain plugin](https://mvnrepository.com/artifact/nl.praegus/toolchain-fitnesse-plugin). 
The Toolchain plugin in it's turn is a plugin to use in combination with [FitNesse](https://mvnrepository.com/artifact/org.fitnesse/fitnesse) and [HSAC fixtures](https://mvnrepository.com/artifact/nl.hsac/hsac-fitnesse-fixtures). 
Run FitNesse with these dependencies in your development environment.

## Code Set Up 

### README

The README.MD shows all current features. This README needs to be updated when a new feature is developed.   

### HTML

Bootstrap+ uses VM (Velocity templates) files instead of HTML files. 
These are found in the folder "templates".

The VM files in the Bootstrap+ are newly created templates or templates that are overwriting the existing ones from FitNesse. 
To overwrite existing templates you need to use the original template from [unclebob/fitnesse](https://github.com/unclebob/fitnesse/tree/30b496e330add41ab36b7fa04b21f1a6e8fefecd/src/fitnesse/resources/templates). 
Actions regarding the templates such as symlinks.vm can be found in the FitNesse Plugin. 

There are also templates that aren't overwritten in the Bootstrap+.
For example ``#parse( $mainTemplate )`` in the skeleton.vm is originated from FitNesse and can be found in unclebob/fitnesse.

Files that needs more explanation are displayed in the following table.

Name vm file | Description
------------ | -------------
skeleton | This is the base of the project and is used on all the pages.
menu | This is the navigation bar.
wikiNav | This is the extension of the navigation bar.
header | This is the template for displaying the help text that can be added to a page.
breadcrumb | This is the template for displaying the current path.


### CSS

The CSS files of the Bootstrap+ are generated automatically from the LESS files. 
The content of the CSS files will be overwritten with the changes made inside the LESS files. 

The LESS files are located in two folders; light theme and dark theme. 
Changes in both folders needs to be consistent to prevent inconsistency.

Customize.less is the file where you will add styling for the most part.   

### Javascript

There are different kind of JS files in the Bootstrap+. 
The two files you are going to work with the most are bootstrap-plus.js and bootstrap-plus-editor.js. 
The bootstrap-plus-editor is meant for functions that are only in the editor, think of a function like the "Context Help".

### Unit testing

The written Javascript code needs to be tested. 
The Javascript testing framework "Jest" is used for unit testing the code. 
The created unit tests are located in the "jest" folder. 
The Praegus repo has an integrated build that runs the tests.  

## Code Conventions
### General
#### Naming and notation

- Naming
    - Every created variable, function, ID etc should be given a name that is self explanatory. The purpose should be clear by just reading the name.
    
    
- Abbreviation  
    - Prevent using abbreviations such as “saveBtn”. Write down the full name like “saveButton”.
    
    
- Common naming conventions
    - Try to avoid using recurring names such as “body” if there is already an existing element called “body”. 
    
    
- Notation
    - Every time when you add something with a name(Like a variable, function, etc.) you need to use Camel casing. For example : function parseCookies(){}”" or “const expectedResult".
    - Do not use Pascal casing or Snake casing.
    - With ID’s and classes can also use Kebab casing, but Camel casing is preferred.

#### Formatting

- Enters
    - Don't add unnecessary enters, but place them in places to provide a better overall picture. Just like with each new CSS element and between functions.
    
    
- Spaces
    - Place spaces where it's necessary. For example do not write an if statement like this: “if(saveButton==true){}” but like this “if (saveButton == true) { }“. As another example, do not write a variable like this ”const saveButton=false;" but like this “const saveButton = false;”

### Unit testing
#### Naming
The test name has to describe the goal of the test. 
For example; "When _[explain what happens in the test]_ then _[explain the expected result]_". 

#### Set Up
To create a clear layout you first need to set up al the necessary variables. 
Place after that the functions/executions. 
And finally the expected result of the test.
