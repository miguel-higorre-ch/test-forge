<div align="center">
  <h1>🛠️ Test Forge</h1>
  <p><strong>The ultimate CLI to scaffold modern test automation stacks in seconds.</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org)
  [![npm Version](https://img.shields.io/badge/npm-%3E%3D%209.0.0-brightgreen)](https://www.npmjs.com)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
</div>

<hr />

## ✨ Overview

`test-forge` is an interactive, lightning-fast Node.js CLI tool designed to scaffold production-ready starter projects for various test automation frameworks. Whether you're setting up Cypress, Playwright, or Selenium, `test-forge` generates a fully configured boilerplate in your preferred programming language, saving you hours of tedious setup.

## 🚀 Features

- **Interactive Prompts**: Beautiful terminal UI powered by `inquirer` and `chalk`.
- **Multi-Framework Support**: Seamlessly scaffold Cypress, Playwright, and Selenium projects.
- **Multi-Language Support**: Choose between JavaScript, TypeScript, Python, and Java.
- **Best Practices Included**: Generated projects come with Page Object Models (POM), sensible CI configs, and foundational tests out of the box.
- **Zero Friction**: Built with Node.js ES Modules. No complex compilation steps required.

## 🧩 Supported Matrix

| Framework | Supported Languages |
| :--- | :--- |
| **Cypress** | 🟩 Node (`TypeScript`, `JavaScript`) |
| **Playwright** | 🟩 Node (`TypeScript`, `JavaScript`), 🟦 Python |
| **Selenium** | 🟥 Java, 🟦 Python, 🟩 Node (`JavaScript`) |

## 📦 Installation & Usage

Ensure you have **Node.js 18+** and **npm 9+** installed on your system.

### Option 1: Global Installation (Recommended)

Installing `test-forge` globally allows you to scaffold test projects from anywhere on your machine.

```bash
# Clone the repository and navigate into it
git clone <repository-url> test-forge
cd test-forge

# Install globally
npm install -g .

# Now you can run it from any directory:
test-forge
```

### Option 2: Run Locally

If you prefer to run the CLI directly without installing it globally:

```bash
cd test-forge
npm install
node bin/test-forge.js
```

*(Note for Windows PowerShell users: use `node bin\test-forge.js`)*

## 💻 CLI Walkthrough

Running `test-forge` will launch an interactive wizard. Simply follow the prompts:

```text
  ╔════════════════════════════════════════╗
  ║         🔧  TEST FORGE  🔧             ║
  ╚════════════════════════════════════════╝

? Project name: my-awesome-tests
? Select a testing framework: Playwright
? Select a programming language: TypeScript

✔ Project scaffolded successfully!

  Next steps:
  1. cd my-awesome-tests
  2. npm install
  3. npx playwright install
  4. npm test
```

## 🏗️ What Gets Generated?

Every scaffolded project instantly provides:
- **Framework-specific starting tests** to verify your setup immediately.
- **Baseline configuration files** (e.g., `playwright.config.ts`, `cypress.config.ts`, `pom.xml`, `pytest.ini`).
- **Dependency manifests** (`package.json`, `requirements.txt`, etc.).
- **A project-specific README** outlining how to run and extend your new tests.

> **Note**: Generation is strictly file-based. Dependencies are intentionally left for you to install, ensuring you remain in full control of your environment setup.

## ⚙️ Project Architecture

```text
test-forge/
├── bin/
│   └── test-forge.js          # CLI entry point / shebang
├── src/
│   ├── index.js               # Orchestrator (prompts → generator → spinner)
│   ├── prompts/               # Inquirer questions and validation logic
│   ├── generators/            # Framework-specific generator classes
│   ├── templates/             # Raw file content & string templates
│   └── utils/                 # Helpers (logger, terminal banners)
└── package.json
```

## 🔌 Extending the CLI

Adding a new testing framework to `test-forge` is remarkably easy:

1. **Create a Generator**: Extend `BaseGenerator` in `src/generators/appium.generator.js`.
   ```javascript
   export class AppiumGenerator extends BaseGenerator {
     async generate({ projectName, language }) { 
         // Define directories and templates to write
     }
   }
   ```
2. **Create Templates**: Define your file contents in `src/templates/appium.templates.js`.
3. **Register It**: Export the generator in `src/generators/index.js` and add the framework to the choices array in `src/prompts/prompt.js`.

That's it! The orchestrator will handle the file I/O, spinners, and generation flow.

## 📝 Known Constraints

- The CLI is currently interactive only; command-line flags (e.g., `--framework playwright`) are planned for future releases.
- Automated test suites for the generator output are under development.
- Setup instructions might require slight manual adjustments depending on your OS shell (e.g., Python virtual environment activation).

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
