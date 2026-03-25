# Test Forge

`test-forge` is a Node.js CLI that scaffolds starter projects for test automation stacks. It currently supports:

- Cypress with `JavaScript` or `TypeScript`
- Playwright with `JavaScript`, `TypeScript`, or `Python`
- Selenium with `JavaScript`, `Python`, or `Java`

The CLI asks for a project name, framework, and language, then writes a framework-specific starter project into a new directory under the current working directory.

## Technology Choice

Node.js (ESM) with three runtime dependencies:

| Package | Role |
| --- | --- |
| `inquirer` v9 | Interactive terminal prompts (list, input, validation) |
| `chalk` v5 | Cross-platform terminal color output |
| `ora` v7 | Animated spinner during file generation |

Node.js was chosen because it's natively multiplatform, ships ES Modules, handles file I/O with zero friction via `node:fs`, and the `inquirer` + `chalk` ecosystem is the industry gold standard for CLI tooling. No compilation step needed.

## Requirements

- Node.js `18+`
- npm `9+`

## Installation & Usage

### Step 1: Prerequisites

```bash
node --version   # Must be >= 18
npm --version    # Must be >= 9
```

### Step 2: Install Dependencies

```bash
cd test-forge
npm install
```

### Step 3a: Run Directly

```bash
node bin/test-forge.js
```

### Step 3b: Install Globally

```bash
# From inside the test-forge directory:
npm install -g .

# Now run from anywhere:
test-forge
```

### Step 3c: Windows (PowerShell)

```powershell
cd test-forge
npm install
node bin\test-forge.js
# Or after global install:
test-forge
```

### Step 4: Walk Through The Prompts

```text
  ╔════════════════════════════════════════╗
  ║         🔧  TEST FORGE  🔧              ║
  ╚════════════════════════════════════════╝

? Project name: my-awesome-tests
? Select a testing framework: Playwright
? Select a programming language: TypeScript

✔ Project scaffolded successfully!

  Project:   my-awesome-tests
  Framework: Playwright
  Language:  TypeScript

  Next steps:
  1. cd my-awesome-tests
  2. npm install
  3. npx playwright install
  4. npm test
```

## Project Structure

```text
test-forge/
├── bin/
│   └── test-forge.js          ← Entry point / shebang for global install
├── src/
│   ├── index.js               ← Orchestrator: prompts → generator → spinner
│   ├── prompts/
│   │   └── prompt.js          ← All inquirer questions & validation
│   ├── generators/
│   │   ├── index.js           ← Registry (add new frameworks here)
│   │   ├── base.generator.js  ← Abstract base: createDir, writeFile helpers
│   │   ├── cypress.generator.js
│   │   ├── playwright.generator.js
│   │   └── selenium.generator.js
│   ├── templates/
│   │   ├── cypress.templates.js    ← All file content strings for Cypress
│   │   ├── playwright.templates.js ← All file content strings for Playwright
│   │   └── selenium.templates.js   ← All file content strings for Selenium
│   └── utils/
│       └── logger.js          ← Banner, success output, next-steps helper
└── package.json
```

## What Gets Generated Per Framework

### Cypress (TS/JS)

```text
my-project/
├── cypress/e2e/example.cy.ts
├── cypress/fixtures/example.json
├── cypress/support/commands.ts + e2e.ts
├── cypress.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
└── README.md
```

- Includes 3 real tests for title, heading, and link validation.
- `tsconfig.json` is generated for TypeScript only.
- The generated config includes `baseURL`, viewport, and video settings.

### Playwright (TS/JS/Python)

```text
my-project/
├── tests/example.spec.ts
├── tests-examples/demo-todo.spec.ts
├── playwright.config.ts
├── package.json / requirements.txt
└── README.md
```

- Includes 3 tests using `page.goto()` and `expect()`.
- Includes demo coverage for screenshots and network interception.
- The generated config enables multi-browser runs and CI retries.

### Selenium Java (Maven/POM)

```text
my-project/
├── src/test/java/{pkg}/pages/HomePage.java
├── src/test/java/{pkg}/tests/HomePageTest.java
├── src/main/java/{pkg}/utils/DriverManager.java
├── resources/config.properties
└── pom.xml
```

- Uses Page Object Model with `WebDriverWait`.
- Includes TestNG with 3 `@Test` methods.
- `pom.xml` includes Selenium 4, TestNG, and WebDriverManager.

### Selenium Python

Selenium Python generates `pytest` + POM with `conftest.py` fixtures, `DriverFactory`, and `requirements.txt`.

### Selenium JavaScript

Selenium JavaScript generates Mocha + Chai + POM with `DriverFactory`, `.mocharc.cjs`, and ESM imports.

## What It Generates

Each generated project includes:

- framework-specific starter tests
- baseline config files
- dependency manifests
- a generated project README

Generation is file-based. The tool does not install dependencies automatically.

## How It Works

1. `bin/test-forge.js` starts the CLI.
2. `src/index.js` prints the banner and prompts the user.
3. `src/generators/index.js` resolves the selected framework to a generator instance.
4. The selected generator writes files from the relevant template module into the target directory.
5. `src/utils/logger.js` prints follow-up setup steps.

## Supported Matrix

| Framework | Languages |
| --- | --- |
| Cypress | TypeScript, JavaScript |
| Playwright | TypeScript, JavaScript, Python |
| Selenium | Java, Python, JavaScript |

## Development Notes

- The project uses ECMAScript modules via `"type": "module"` in the root `package.json`.
- Generators extend `BaseGenerator` and implement `generate({ projectName, language })`.
- Template modules return raw file contents as strings. If you add a new framework or language, keep template output and logger instructions in sync.

## Extending With A New Framework

Three steps only:

```js
// 1. Create src/generators/appium.generator.js
export class AppiumGenerator extends BaseGenerator {
  async generate({ projectName, language }) { /* ... */ }
}

// 2. Create src/templates/appium.templates.js

// 3. Register in src/generators/index.js
import { AppiumGenerator } from './appium.generator.js';
const GENERATOR_REGISTRY = {
  // ...existing...
  Appium: AppiumGenerator,  // one line
};
```

Then add `'Appium'` to the choices array in `src/prompts/prompt.js`. That's the entire surface area for extension.

## Extending The CLI

To add a new framework:

1. Create a generator in `src/generators/`.
2. Create matching templates in `src/templates/` if needed.
3. Register the generator in `src/generators/index.js`.
4. Update `FRAMEWORK_LANGUAGES` in `src/prompts/prompt.js`.
5. Update `getNextSteps()` in `src/utils/logger.js`.

To add a new language to an existing framework:

1. Extend the prompt choices.
2. Update the framework generator logic.
3. Add or adjust templates.
4. Update generated README content and next-step instructions.

## Known Constraints

- The CLI is interactive only; there are no command-line flags yet.
- There is no automated test suite for the generator output yet.
- Setup instructions are partly shell-specific, especially for Python virtual environment activation.

## License

MIT
