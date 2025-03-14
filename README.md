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
- TypeScript - 5.6.3 - https://www.typescriptlang.org/
- Npm - 11.1.0 - https://www.npmjs.com/package/npm
- IDE - WebStorm - latest
- PlantUML - Latest from plugin manager

### IDE configuration

- WebStorm
  - Editor > Code Style > TypeScript - Use default settings
  - Languages & Frameworks > TypeScript > TSLint - Automatic TSLint Configuration
  - Plugins > PlantUML - Use default settings

## Project Structure

```text
RiaFrontend/
├── 📁 e2e/
│   └── 📁 behavior-to-test/
│       └── 📄 behavior1.spec.ts    # Test the behavior of sequence.
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 components/
│   │   │   ├── 📁 app/            # Main application component
│   │   │   │   ├── 📄 app.component.ts      # Component logic
│   │   │   │   ├── 📄 app.component.html    # Root template
│   │   │   │   ├── 📄 app.component.css     # Component styles
│   │   │   │   └── 📄 app.component.spec.ts # Test the behavior of the component
│   │   │   │
│   │   │   └── 📁 component-name/
│   │   │       ├── 📄 component-name.component.css
│   │   │       ├── 📄 component-name.component.html
│   │   │       ├── 📄 component-name.component.spec.ts
│   │   │       └── 📄 component-name.component.ts
│   │   ├── 📁 exceptions/              # Application exceptions and error handling
│   │   ├── 📁 services/
│   │   ├── 📁 interfaces/
│   │   ├── 📁 models/
│   │   ├── 📁 mocks/                 # Mock data for testing
│   │   ├── 📁 pages/
│   │   ├── 📁 enviroments/           # Environment variables for development, test and production
│   │   ├── 📄 app.module.ts          # Angular root module
│   │   └── 📄 app.routes.ts          # Routing configuration

```

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

## Running unit tests - https://angular.dev/tools/cli/test

For unit tests, run:

```bash
ng test
```

For CI headless tests, run:

```bash
ng test --no-watch --no-progress --browsers=ChromeHeadless
```

## Authentication with Keycloak

This application uses Keycloak for authentication. Follow these steps to set up Keycloak using Docker for local development and testing.

### Prerequisites

- Docker engine installed

### Start Keycloak

Run the following command to start Keycloak with Docker:

```bash
docker run -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.1.3 start-dev
```

This command:

- Exposes Keycloak on port 8080
- Creates an initial admin user with username `admin` and password `admin`

### Configure Keycloak

After starting Keycloak, follow these steps to configure it for use with the application:

1. **Access the Admin Console**

   - Open http://localhost:8080 in your browser
   - Log in with username `admin` and password `admin`

2. **Create a New Realm**

   - Click on the dropdown in the top-left corner (shows "master" by default)
   - Click "Create Realm"
   - Enter a name for your realm (e.g., "ria-realm")
   - Click "Create"

3. **Create a Client**

   - In your new realm, go to "Clients" in the left sidebar
   - Click "Create client"
   - Set "Client type" to "OpenID Connect"
   - Set "Client ID" to `angular-client`
   - Click "Next"
   - Ensure "Standard flow" is enabled
   - Click "Next"
   - Under "Login settings":
     - Set "Valid redirect URIs" to `http://localhost:4200/*`
     - Set "Web origins" to `http://localhost:4200`
   - Click "Save"

4. **Create a User**
   - Go to "Users" in the left sidebar
   - Click "Add user"
   - Fill in the following fields:
     - Username: choose a username
     - Email: enter a valid email
     - First Name and Last Name (optional)
   - Click "Create"
   - Go to the "Credentials" tab
   - Set a password and toggle "Temporary" to "Off"
   - Click "Set Password"

### Integrating with the Frontend

Once Keycloak is set up, you can configure your Angular application to use it for authentication. The application is already configured to use Keycloak, but you may need to adjust settings in the environment files to match your Keycloak setup.

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
<type>: <description>

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
feat: add login functionality
fix: correct timeout handling
docs: update API documentation
```

For more details on Conventional Commits, visit [conventionalcommits.org](https://www.conventionalcommits.org/).
