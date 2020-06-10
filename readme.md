 [![Maven Central](https://img.shields.io/maven-central/v/nl.praegus/fitnesse-bootstrap-plus-theme.svg?maxAge=21600)](https://mvnrepository.com/artifact/com.github.tcnh/fitnesse-bootstrap-plus-theme)
 
### [Bootstrap-plus @ Github.io Website](https://praegus.github.io/fitnesse-bootstrap-plus-theme/)

# Bootstrap-plus FitNesse Theme
This is a FitNesse Theme that extends the default bootstrap theme for better usability.
Uses Bootstrap 4.4, JQuery 3.4 and CodeMirror 5.52

## Features:
* Improved styling for better readability and information density
* Light and dark version of the theme for the wiki and CodeMirror editor
* Different favicons for Tests, Suites, Static pages and Edit mode
* Show the page name first in the page title (So different tabs have recognizable titles)
* Optional sidebar to ease navigation
* Visual identification of slim tables using icons
* Failure navigator highlights current failure, eliminates scrolling - jumps to next
* Adds a 'Recent pages' overview to the end of the frontpage
* Optional maven version checker that shows current dependency versions and compares them to the latest version in maven central
* Icons in Table of contents to distinguish between Tests, Suites and Static pages
* Suites now have a 'run tags' input field in the navigation bar, so all tests containing any of the specified tags in this input field can be run immediately
* If Autocomplete responder is also installed, ctrl-space suggestions are context-aware:
  * All fixture methods available in the current test
  * All scenario's from include ScenarioLibraries
  * All slim symbols set by `$varName=` that are available
  * NOTE: If you want context-aware autosuggest in ScenarioLibraries, make sure to edit them from an edit link on a *test-page*. The hint-script will then use the referring page as context
* Context-help pane containing all fixtures, methods, scenario's, slim symbols in current test scope
* Jump to definition for fixture methods and scenario's by pressing ctrl-comma in the editor, revealing candidates in the context-help pane
* validation of wiki tables against current context and basic syntax (aimed at slim usage). Use validate button,auto validate on save option or ctrl-dot.
* Insert scenario's and fixture methods in the editor by clicking the plus-icon in the context pane
* Experimental: Autosave and validate test pages on enter

## Usage:
Use Praegus' toolchain-plugin to use bootstrap-plus and enable all of it's features.
See: https://github.com/praegus/toolchain-fitnesse-plugin

## Screenshots:

#### Fonts, margins and colors
![alt text](https://github.com/tcnh/binstore/raw/master/styling.png "Overall styling")

#### Browser Tabs
![alt text](https://github.com/tcnh/binstore/raw/master/tabs.png "Tab bar")

#### Table of contents with tag management
![image](https://user-images.githubusercontent.com/2232710/78379015-0ecb2e00-75d2-11ea-8e1e-c46c1b3a6683.png)

#### Sidebar Navigation
![alt text](https://github.com/tcnh/binstore/raw/master/sidebar_nav.png "Sidebar")

#### Sidebar Context Menu
![image](https://user-images.githubusercontent.com/2232710/78378675-9bc1b780-75d1-11ea-91ac-22f7929a643a.png)

#### Editor Linting
![alt text](https://github.com/tcnh/binstore/raw/master/linting.png "Editor linting")

#### Navigation Bar
![alt text](https://github.com/tcnh/binstore/raw/master/navbar.png "Navigation bar for suites")

#### Scenario's, Slim Symbols and available Fixture methods in auto-suggest
![alt text](https://github.com/tcnh/binstore/raw/master/suggest.png "Auto suggest contains scenario's")

#### Context help
![alt text](https://github.com/tcnh/binstore/raw/master/context-help.png "Context help panel")

#### Visual Slim table types
![alt text](https://github.com/tcnh/binstore/raw/master/table_identification.png "Table icons")


#### Style switch to toggle light/dark modes
![alt text](https://github.com/tcnh/binstore/raw/master/style-switch.png "Light/dark mode toggle")

#### Dark mode
![alt text](https://github.com/tcnh/binstore/raw/master/darkmode_1.png "Dark theme")
![alt text](https://github.com/tcnh/binstore/raw/master/dark_editor.PNG "Dark editor")
![alt text](https://github.com/tcnh/binstore/raw/master/darkmode_result.PNG "Test results in dark mode")

#### Recent Tests
![alt text](https://github.com/tcnh/binstore/raw/master/recent_pages.png "Recent test pages")

#### Maven version checker
Use "!VersionChecker" in the editor to enable the Maven version checker.

![alt text](https://github.com/tcnh/binstore/raw/master/macen_versioncheck.png "Maven dependency versions")

#### ToolTips
Tooltips are now displayed on every page.

You can add your own tooltips with the following steps:
1. You go to fitnesse/resources/bootstrap-plus/txt/toolTipData.txt for editing.
2. Put the text at the end of the file and separate the tooltips by enters
3. The format of a tooltip is[this is a tooltip] (without the brackets).

Tooltips can now contain links
* You can add a link to your tooltip by adding a simple html link tag to your tooltip.

Tooltips will now also load in from fixtures:

* You can add tooltips to your fixture by adding a Tooltips.txt on [FixtureRoot]/[FixtureName]_tooltips/Tooltips.txt
* You also need to add two executions to your maven dependency plugin to be able to load fixture tooltips:

        <execution>
            <id>unpack-dependencies</id>
            <phase>compile</phase>
            <goals>
                <goal>unpack-dependencies</goal>
            </goals>
            <configuration>
                <includes>**/Tooltips.txt</includes>
                <outputDirectory>${project.basedir}/wiki/TooltipData</outputDirectory>
            </configuration>
        </execution>
             
                    
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

