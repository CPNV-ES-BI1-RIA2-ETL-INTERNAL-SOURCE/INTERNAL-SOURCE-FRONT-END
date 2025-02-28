# RiaFrontend

A modern Rich Internet Application (RIA) that integrates with AWS QuickSight to display business intelligence dashboards. This application serves as the frontend interface for visualizing data processed through an ETL pipeline.

## Project Overview

RiaFrontend provides a user-friendly interface to access and display AWS QuickSight dashboards.

1. AWS QuickSight generates interactive dashboards from the warehouse data
2. This frontend application displays these dashboards in a user-friendly interface

### Key Features

- Integration with AWS QuickSight dashboards
- Display dashboards in a user-friendly interface

## Technical Stack

- Node.js - v22.11.0 - https://nodejs.org/en/download/
- Npm - 11.1.0 - https://www.npmjs.com/package/npm
- IDE - Visual Studio Code - 1.97 - https://code.visualstudio.com/
- Angular - 19.2.0 - https://angular.dev/installation
- Playwright - 1.50 - https://playwright.dev/ 
- PlantUML - Latest from plugin manager


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running end-to-end tests - https://angular.dev/tools/cli/end-to-end

Playwright was chosen as the end-to-end testing framework especially for its ability to emulate mobile devices.

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Contributing

We follow strict guidelines for contributing to this project to maintain code quality and ensure smooth collaboration.

### Gitflow Workflow

We use the Gitflow workflow for managing our branches:

- `main`: Production-ready code
- `develop`: Main development branch
- `feature/*`: New features
- `release/*`: Release preparation
- `hotfix/*`: Emergency fixes for production
- `bugfix/*`: Bug fixes for development

Branch naming convention:
- Features: `feature/descriptive-name`
- Bugfixes: `bugfix/issue-description`
- Hotfixes: `hotfix/critical-issue`
- Releases: `release/version-number`

### Development Process

1. Create a new branch from `develop` for your work
2. Make your changes in small, focused commits
3. Push your branch and create a Pull Request
4. Ensure CI passes and request review
5. After approval, merge using squash merge

### Conventional Commits

We strictly follow the Conventional Commits specification. Each commit message must be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add login functionality
fix(api): correct timeout handling
docs: update API documentation
```

Breaking changes must be indicated by a `!` after the type/scope or by adding `BREAKING CHANGE:` in the footer.

Example:
```
feat(auth): add login functionality
BREAKING CHANGE: The `login` method now requires a `username` and `password` parameter.
```

For more details on Conventional Commits, visit [conventionalcommits.org](https://www.conventionalcommits.org/).
