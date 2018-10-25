 [![Maven Central](https://img.shields.io/maven-central/v/com.github.tcnh/fitnesse-bootstrap-plus-theme.svg?maxAge=21600)](https://mvnrepository.com/artifact/com.github.tcnh/fitnesse-bootstrap-plus-theme)
## Bootstrap-plus FitNesse Theme
This is a FitNesse Theme that extends the default bootstrap theme for better usability.

### Features:
* Different favicons for Tests, Suites, Static pages and Edit mode
* Show the page name first in the page title (So different tabs have recognizable titles)
* Icons in Table of contents to distinguish between Tests, Suites and Static pages
* Suites now have a 'run tags' input field in the navigation bar, so all tests containing any of the specified tags in this input field can be run immediately
* If [Autocomplete responder](https://github.com/tcnh/FitNesseAutocompleteResponder) is also installed, ctrl-space suggestions are context-aware:
  * All fixture methods available in the current test
  * All scenario's from include ScenarioLibraries
  * All slim symbols set by `$varName=` that are available
  * NOTE: If you want context-aware autosuggest in ScenarioLibraries, make sure to edit them from an edit link on a *test-page*. The hint-script will then use the referring page as context
* Context-help pane containing all fixtures, methods, scenario's, slim symbols in current test scope
* Jump to definition for fixture methods and scenario's by pressing alt-shift-d or ctrl-comma in the editor, revealing candidates in the context-help pane
* validation of wiki tables against current context and basic syntax. Use validate button or ctrl-dot.
* Insert scenario's and fixture methods in the editor by clicking the plus-icon in the context pane

### Usage:
#### Option 1
* Build the jar: `mvn clean install` Or download [latest jar from Sonatype OSS repo](https://oss.sonatype.org/service/local/artifact/maven/content?r=releases&g=com.github.tcnh&a=fitnesse-bootstrap-plus-theme&v=LATEST)
* Copy the jar from the target directory to FitNesse's plugins-directory
* Add `Theme=bootstrap-plus` to plugins.properties
* For context-aware autosuggest:
  * Install FitNesseAutocompleteResponder
  * Add `Responders=autoComplete:com.github.tcnh.fitnesse.responders.AutoCompleteResponder` to plugins.properties

#### Option 2
* Include in a maven project (group id: com.github.tcnh, artifact: fitnesse-bootstrap-plus-theme)
* Use maven-dependency-plugin to copy the jar to the plugins directory
* Add `Theme=bootstrap-plus` to plugins.properties
* For context-aware autosuggest:
  * Add group id: com.github.tcnh, artifact: fitnesse-autocomplete-responder to your project and copy the jar to your plugins directory
  * Add `Responders=autoComplete:com.github.tcnh.fitnesse.responders.AutoCompleteResponder` to plugins.properties

### Screenshots:

#### Fonts, margins and colors
![alt text](https://github.com/tcnh/binstore/raw/master/styling.png "Overall styling")

#### Browser Tabs
![alt text](https://github.com/tcnh/binstore/raw/master/tabs.png "Tab bar")

#### Table of contents
![alt text](https://github.com/tcnh/binstore/raw/master/toc.png "Table of contents")

#### Editor Linting
![alt text](https://github.com/tcnh/binstore/raw/master/linting.png "Editor linting")

#### Navigation Bar
![alt text](https://github.com/tcnh/binstore/raw/master/navbar.png "Navigation bar for suites")

#### Scenario's, Slim Symbols and available Fixture methods in auto-suggest
![alt text](https://github.com/tcnh/binstore/raw/master/suggest.png "Auto suggest contains scenario's")

#### Context help
![alt text](https://github.com/tcnh/binstore/raw/master/context-help.png "Context help panel")
