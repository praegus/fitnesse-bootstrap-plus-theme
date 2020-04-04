### Installation

#### Toolchain Plugin
Our toolchain plugin is a one-stop way to get bootstrap-plus with all features. Contains all necessary responders, table decorators and even a few new table types.
Get the jar with all dependencies from the releases page or maven and place it in your wiki/plugins folder for FitNesse to pick it up.
This approach will automagically register the theme and set it as default in FitNesse.
To be able to use `debug script` tables, you'll need to also add [Toolchain-fixtures](https://mvnrepository.com/artifact/nl.praegus/toolchain-fixtures/latest) to your fixtures (and add it to slim's classpath). Comes with a bunch of handy utility fixtures, too, like:

* Pause test fixture
* Calculator
* Ws Security Xml Http Test
* Sftp fixture
* CSV Fixture
* Image compare
* PDF Compare
* And more!

##### Option 1 - Download Jar: 
* Get it from Maven: [Maven repo](https://mvnrepository.com/artifact/nl.praegus/toolchain-fitnesse-plugin/latest) (download jar-with-dependencies)
* Place it in your plugins-folder
* Start FitNesse

##### Option 2 - Maven dependency plugin
* Add the following plugin (or just the executon if you're already using the dependency-plugin)to your pom.xml:

```&lt;plugin&gt;
    &lt;artifactId&gt;maven-dependency-plugin&lt;/artifactId&gt;
    &lt;version&gt;3.0.0&lt;/version&gt;
    &lt;configuration&gt;
        &lt;includes&gt;**/*&lt;/includes&gt;
        &lt;excludes&gt;META-INF,META-INF/**&lt;/excludes&gt;
        &lt;includeScope&gt;runtime&lt;/includeScope&gt;
        &lt;excludeArtifactIds&gt;fitnesse,junit&lt;/excludeArtifactIds&gt;
        &lt;outputDirectory&gt;${standalone.classpath}&lt;/outputDirectory&gt;
    &lt;/configuration&gt;
    &lt;executions&gt;
        &lt;execution&gt;
            &lt;id&gt;copy-plugins&lt;/id&gt;
            &lt;phase&gt;generate-resources&lt;/phase&gt;
            &lt;goals&gt;
                &lt;goal&gt;copy&lt;/goal&gt;
            &lt;/goals&gt;
            &lt;configuration&gt;
                &lt;artifactItems&gt;
                    &lt;artifactItem&gt;
                        &lt;groupId&gt;nl.praegus&lt;/groupId&gt;
                        &lt;artifactId&gt;toolchain-fitnesse-plugin&lt;/artifactId&gt;
                        &lt;version&gt;${toolchain-plugin.version}&lt;/version&gt;
                        &lt;classifier&gt;jar-with-dependencies&lt;/classifier&gt;
                        &lt;overWrite&gt;true&lt;/overWrite&gt;
                    &lt;/artifactItem&gt;
                &lt;/artifactItems&gt;
                &lt;outputDirectory&gt;${project.basedir}/wiki/plugins&lt;/outputDirectory&gt;
            &lt;/configuration&gt;
        &lt;/execution&gt;
    &lt;/executions&gt;
&lt;/plugin&gt;
```

##### Option 3 - Use Hsac-fitnesse-fixtures boilerplate
The plugin is included in hsac-fitnesse-fixtures' standalone package. Gives you a full featured allround testing tool that blows away most of the competition!
[Get it from Github](https://github.com/fhoeben/hsac-fitnesse-fixtures)

#### Just the theme
If you want to use just the theme, and use it to roll your own perfect version of FitNesse: you can get everything from maven:
[Latest version on maven Central](https://mvnrepository.com/artifact/nl.praegus/fitnesse-bootstrap-plus-theme/latest)

Note that without the plugin, you will miss out on the context helper, side bar, tag manager and context-aware autocomplete.
