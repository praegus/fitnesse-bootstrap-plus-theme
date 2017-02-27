## Bootstrap-plus FitNesse Theme
This is a FitNesse Theme that extends the default bootstrap theme for better usability.

###Features:
* Different favicons for Tests, Suites, Static pages and Edit mode
* Show the page name first in the page title (So different tabs have recognizable titles)
* Icons in Table of contents to distinguish between Tests, Suites and Static pages
* Suites now have a 'run tags' input field in the navigation bar, so all tests containing any of the specified tags in this input field can be run immediately

###Usage:
* Build the jar via mvn clean install
* Place the jar in FitNesse's plugins-directory
* Add 'Theme=bootstrap-plus' to plugins.properties

###Screenshots:

####Browser Tabs
![alt text](https://github.com/tcnh/binstore/raw/master/tabs.png "Tab bar")

####Table of contents
![alt text](https://github.com/tcnh/binstore/raw/master/toc.png|alt="Table of contents")

####Navigation Bar
![alt text](https://github.com/tcnh/binstore/raw/master/navbar.png|alt="Navigation bar for suites")
