## Bootstrap-plus FitNesse Theme
This is a FitNesse Theme that extends the default bootstrap theme for better usability.

###Features:
* Different favicons for Tests, Suites, Static pages and Edit mode
* Show the page name first in the page title (So different tabs have recognizable titles)
* Icons in Table of contents to distinguish between Tests, Suites and Static pages
* Suites now have a 'run tags' input field in the navigation bar, so all tests containing any of the specified tags in this input field can be run immediately

###Usage:
####Option 1
* Build the jar: `mvn clean install` Or download [latest jar from Sonatype OSS repo](https://oss.sonatype.org/service/local/repositories/releases/content/com/github/tcnh/fitnesse-bootstrap-plus-theme/1.0.1/fitnesse-bootstrap-plus-theme-1.0.1.jar)
* Copy the jar from the target directory to FitNesse's plugins-directory
* Add 'Theme=bootstrap-plus' to plugins.properties

####Option 2
* Include in a maven project (group id: com.github.tcnh, artifact: fitnesse-bootstrap-plus-theme)
* Use maven-dependency-plugin to copy the jar to the plugins directory
* Add 'Theme=bootstrap-plus' to plugins.properties

###Screenshots:

####Browser Tabs
![alt text](https://github.com/tcnh/binstore/raw/master/tabs.png "Tab bar")

####Table of contents
![alt text](https://github.com/tcnh/binstore/raw/master/toc.png "Table of contents")

####Navigation Bar
![alt text](https://github.com/tcnh/binstore/raw/master/navbar.png "Navigation bar for suites")
