export const cypressTemplates = {

  config: (isTypeScript) => isTypeScript
    ? `import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://example.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
`
    : `const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://example.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
`,

  packageJson: (projectName, isTypeScript) => JSON.stringify({
    name: projectName,
    version: '1.0.0',
    description: `Cypress E2E test suite for ${projectName}`,
    scripts: {
      'cy:open': 'cypress open',
      'cy:run': 'cypress run',
      'cy:run:headless': 'cypress run --headless',
    },
    devDependencies: {
      cypress: '^13.6.0',
      ...(isTypeScript && {
        typescript: '^5.3.3',
        '@types/node': '^20.11.5',
      }),
    },
  }, null, 2),

  exampleTest: (isTypeScript) => `${isTypeScript ? `/// <reference types="cypress" />

` : ''}describe('Example Test Suite', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the correct page title', () => {
    cy.title().should('include', 'Example Domain');
  });

  it('should display the main heading', () => {
    cy.get('h1').should('be.visible').and('contain.text', 'Example Domain');
  });

  it('should have a "More information" link', () => {
    cy.get('a')
      .contains('More information')
      .should('have.attr', 'href')
      .and('include', 'iana.org');
  });
});
`,

  fixture: () => JSON.stringify({
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
  }, null, 2),

  commands: (isTypeScript) => `${isTypeScript ? `/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      // Add your custom commands here
      // login(email: string, password: string): Chainable<void>
    }
  }
}

export {};
` : `// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
// ***********************************************

// Cypress.Commands.add('login', (email, password) => { ... })
`}`,

  supportE2e: () => `// ***********************************************************
// This file is processed and loaded automatically before your test files.
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';
`,

  tsConfig: () => JSON.stringify({
    compilerOptions: {
      target: 'es5',
      lib: ['es5', 'dom'],
      types: ['cypress', 'node'],
    },
    include: ['**/*.ts'],
  }, null, 2),

  gitignore: () => `node_modules/
cypress/videos/
cypress/screenshots/
cypress/downloads/
.DS_Store
dist/
`,

  readme: (projectName, language) => `# ${projectName}

> Cypress E2E Test Suite — ${language}

## Prerequisites

- Node.js >= 18
- npm >= 9

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Open Cypress Test Runner (interactive)
npm run cy:open

# Run all tests headlessly
npm run cy:run
\`\`\`

## Project Structure

\`\`\`
${projectName}/
├── cypress/
│   ├── e2e/              # Test spec files
│   ├── fixtures/         # Static test data (JSON)
│   └── support/          # Commands & global setup
├── cypress.config.${language === 'TypeScript' ? 'ts' : 'js'}
├── package.json
${language === 'TypeScript' ? '└── tsconfig.json' : ''}
\`\`\`

## Writing Tests

Place your test files in \`cypress/e2e/\` with the pattern \`*.cy.${language === 'TypeScript' ? 'ts' : 'js'}\`.

## Documentation

- [Cypress Docs](https://docs.cypress.io)
`,
};
