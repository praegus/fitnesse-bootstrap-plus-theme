 [![Maven Central](https://img.shields.io/maven-central/v/nl.praegus/fitnesse-bootstrap-plus-theme.svg?maxAge=21600)](https://mvnrepository.com/artifact/com.github.tcnh/fitnesse-bootstrap-plus-theme)
## Bootstrap-plus FitNesse Theme
This is a FitNesse Theme that extends the default bootstrap theme for better usability.
Uses Bootstrap 4.4, JQuery 3.4 and CodeMirror 5.52

### Features:
* Improved styling for better readability and information density
* Light and dark version of the theme for the wiki and CodeMirror editor
* Different favicons for Tests, Suites, Static pages and Edit mode
* Show the page name first in the page title (So different tabs have recognizable titles)
* Optional sidebar to ease navigation
* Context menu on sidebar to reduce clicks when creating tests
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

### Usage:
Use Praegus' toolchain-plugin to use bootstrap-plus and enable all of it's features.
See: https://github.com/praegus/toolchain-fitnesse-plugin

### Screenshots:

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
![alt text](https://github.com/tcnh/binstore/raw/master/macen_versioncheck.png "Maven dependency versions")

#### ToolTips
* Tooltips now display on every page

New tooltips can be added by editing fitnesse/resources/bootstrap-plus/txt/toolTipData.txt and putting text at the end of the file and seperating by enters in format [this is a tooltip] without the brackets.

* Tooltips will now also load in from fixtures.

you can add tooltips to your fixture by adding Tooltips.txt(case insensitive) to the root off your fixture.
