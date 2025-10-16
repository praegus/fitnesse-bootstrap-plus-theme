# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a FitNesse theme that extends the default bootstrap theme for better usability. It's a Maven project that provides both light and dark versions of the theme, with enhanced UI features for FitNesse wiki pages, test execution, and editor functionality.

## Key Architecture Components

### Build System
- **Maven**: Primary build tool with `pom.xml` configuration
- **LESS Compilation**: Automatic CSS generation from LESS files using `lesscss-maven-plugin`
- **Node.js/Jest**: JavaScript testing framework for unit tests

### Theme Structure
- **Templates**: Velocity templates (`.vm` files) in `fitnesse/resources/bootstrap-plus/templates/`
  - `skeleton.vm`: Base template used on all pages
  - `menu.vm`: Navigation bar
  - `wikiNav.vm`: Navigation bar extensions
  - `header.vm`: Help text display template
- **Styling**: Dual-theme LESS architecture
  - Light theme: `fitnesse/resources/bootstrap-plus/less/light/`
  - Dark theme: `fitnesse/resources/bootstrap-plus/less/dark/`
  - Both compile to respective CSS files in `css/` directory
- **JavaScript**: Modular JS architecture
  - `bootstrap-plus.js`: Core functionality
  - `bootstrap-plus-editor.js`: Editor-specific features (context help, validation)
  - `bootstrap-plus-error-nav.js`: Test failure navigation

### Key Features
- Light/dark theme switching
- Sidebar navigation with context menus
- Code editor with syntax highlighting (CodeMirror)
- Test failure navigator
- Maven version checker
- Context-aware autocomplete and validation
- Symbol data processing and visualization

## Common Development Commands

### Build and Compilation
```bash
# Clean and compile LESS to CSS
mvn clean compile

# Full build with packaging
mvn clean package

# Skip tests during build
mvn clean package -DskipTests
```

### Testing
```bash
# Run JavaScript unit tests
npm run tests
# or
yarn jest

# Run specific test file
npx jest fitnesse/resources/jest/Sidebar.test.js
```

### Development Workflow
```bash
# Install Node dependencies
npm install

# Watch for LESS changes (manual compilation required)
mvn lesscss:compile

# Release process (CI/CD handles this)
mvn release:prepare release:perform
```

## Code Organization

### LESS/CSS Development
- Make consistent changes in both `light/` and `dark/` theme directories
- Main styling changes go in `customize.less` within each theme
- CSS files are auto-generated - never edit directly

### JavaScript Development
- Follow camelCase naming convention (not PascalCase or snake_case)
- Use descriptive, self-explanatory names (avoid abbreviations like "saveBtn")
- Core functionality goes in `bootstrap-plus.js`
- Editor-specific features belong in `bootstrap-plus-editor.js`
- All new JavaScript must have Jest unit tests in `fitnesse/resources/jest/`

### Template Development
- Velocity templates override FitNesse defaults
- Reference original FitNesse templates when overriding from `unclebob/fitnesse`
- Templates use `#parse()` directives for modular composition

## Testing Requirements

### Jest Unit Tests
- Test files located in `fitnesse/resources/jest/`
- Follow naming pattern: `[Component].test.js`
- Test naming format: "When [condition] then [expected result]"
- Structure: Setup variables → Execute functions → Assert expectations
- Setup file: `setup-jest.js` configures jQuery globals

### Integration Testing
This theme requires integration with:
- FitNesse core
- Toolchain plugin (https://github.com/praegus/toolchain-fitnesse-plugin)  
- HSAC fixtures (https://github.com/fhoeben/hsac-fitnesse-fixtures)

## CI/CD Configuration

### GitHub Actions
- **Pull Request Testing**: Runs Jest tests on Node.js 12.x
- **Master Branch Release**: 
  - Maven release to staging
  - GitHub release creation
  - Automatic version increment

### Maven Release Profile
- Nexus staging deployment
- GPG signing for artifacts
- Source and Javadoc JAR generation
- Assembly plugin for dependencies

## Dependencies and Versions

### Frontend Dependencies
- Bootstrap 4.4
- jQuery 3.4+ (security requirement: >=3.4.1)
- CodeMirror 5.52
- Axios >=0.21.1 (security requirement)

### Maven Plugin Versions
- `lesscss-maven-plugin`: 1.7.0.1.1 for LESS compilation
- `maven-release-plugin`: 3.0.1 for version management
- `nexus-staging-maven-plugin`: 1.6.13 for deployment