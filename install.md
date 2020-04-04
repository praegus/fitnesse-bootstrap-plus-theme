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

```<plugin>
       <artifactId>maven-dependency-plugin</artifactId>
       <version>3.0.0</version>
       <configuration>
           <includes>**/*</includes>
           <excludes>META-INF,META-INF/**</excludes>
           <includeScope>runtime</includeScope>
           <excludeArtifactIds>fitnesse,junit</excludeArtifactIds>
           <outputDirectory>${standalone.classpath}</outputDirectory>
       </configuration>
       <executions>
           <execution>
               <id>copy-plugins</id>
               <phase>generate-resources</phase>
               <goals>
                   <goal>copy</goal>
               </goals>
               <configuration>
                   <artifactItems>
                       <artifactItem>
                           <groupId>nl.praegus</groupId>
                           <artifactId>toolchain-fitnesse-plugin</artifactId>
                           <version>${toolchain-plugin.version}</version>
                           <classifier>jar-with-dependencies</classifier>
                           <overWrite>true</overWrite>
                       </artifactItem>
                   </artifactItems>
                   <outputDirectory>${project.basedir}/wiki/plugins</outputDirectory>
               </configuration>
           </execution>
       </executions>
   </plugin>
```

##### Option 3 - Use Hsac-fitnesse-fixtures boilerplate
The plugin is included in hsac-fitnesse-fixtures' standalone package. Gives you a full featured allround testing tool that blows away most of the competition!
[Get it from Github](https://github.com/fhoeben/hsac-fitnesse-fixtures)

#### Just the theme
If you want to use just the theme, and use it to roll your own perfect version of FitNesse: you can get everything from maven:
[Latest version on maven Central](https://mvnrepository.com/artifact/nl.praegus/fitnesse-bootstrap-plus-theme/latest)

Note that without the plugin, you will miss out on the context helper, side bar, tag manager and context-aware autocomplete.
