# Getting Started with Bootstrap-plus FitNesse Theme
This is meant for people who want to develop for the Bootstrap-plus FitNesse Theme.

## Running the code 

1. Put the correct Bootstrap plus version in the pom.xml.
2. Press on "Maven" on the right side.
    2. Open the folder “Lifecycle”.
    2. Select “clean” and “install”. 
    2. Press on “Run Maven Build”.

## Code Set Up 

### Pom file

Bootstrap+ is a dependency of the Toolchain Plugin. 
The Plugin is a maven project, so it is easier to make the Bootstrap+ a maven project too. 
Every maven project has a pom file that contains the version number of the pom and the dependencies.  

The most understandable way the keep track of your own version is to use a version with "-SNAPSHOT" that will ultimately be released. 
For example if the most recent version is "2.0.5" then use "2.0.6-SNAPSHOT" for your local version.

The Toolchain Plugin pom file also contains the Bootstrap+ Theme version. 
If you want to see your local version you have to set this version to the same version as your local Bootstrap+.
If you want to see the most recent version then you have to set the latest version of the [Maven Repository](https://mvnrepository.com/artifact/nl.praegus/fitnesse-bootstrap-plus-theme).

### README

There is a README in both projects that shows all current features. This README needs to be updated when a new feature is developed.   

### HTML

Bootstrap+ Theme uses VM (Velocity templates) files instead of HTML files. 
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
The tests are integrated with a automated build in Github. When creating a pull request to the Praegus.     

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
    - Every time when you add something with a name(Like a variable, function, etc.) you need to use Camel casting. For example : function parseCookies(){}”" or “const expectedResult".
    - Do not use Pascal casing or Snake casing.
    - With ID’s and classes can also use Kebab casing, but Camel casing is preferred.

#### Formating

- Format button
    - Using the format button, everyone will get their code to look well arranged.
    
    
- Enters
    - Don't add unnecessary enters, but place them in places to provide more a beter overall picture. Just like with each new CSS element and between functions.
    
    
- Spaces
    - Place spaces where necessary. For example do not write an if statement like this: “if(saveButton==true){}” but like this “if (saveButton == true) { }“. As another example, do not write a variable like this ”const saveButton=false;" but like this “const saveButton = false;”
    
    
- Quotes
    - If you need to add quotes, use single quotes.

    
### Unit testing
#### Naming
Straightforward naming that indicates what the test is or tests and what is expected of that test.

#### Set Up
Create a clear layout by first setting down all the necessary variables, then add a white line, then add the function/execution, another white line and finally the test itself.

