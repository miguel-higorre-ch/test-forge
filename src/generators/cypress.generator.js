import { BaseGenerator } from './base.generator.js';
import { cypressTemplates } from '../templates/cypress.templates.js';

export class CypressGenerator extends BaseGenerator {
  constructor() {
    super('Cypress');
  }

  async generate({ projectName, language }) {
    const outDir = this.getOutputDir(projectName);
    const isTypeScript = language === 'TypeScript';
    const ext = isTypeScript ? 'ts' : 'js';

    // ── Directory Structure ──────────────────────────────────────────────────
    // my-project/
    // ├── cypress/
    // │   ├── e2e/
    // │   │   └── example.cy.{ts|js}
    // │   ├── fixtures/
    // │   │   └── example.json
    // │   └── support/
    // │       ├── commands.{ts|js}
    // │       └── e2e.{ts|js}
    // ├── cypress.config.{ts|js}
    // ├── package.json
    // └── tsconfig.json  (TypeScript only)
    // ────────────────────────────────────────────────────────────────────────

    this.createDir(this.resolve(outDir, 'cypress', 'e2e'));
    this.createDir(this.resolve(outDir, 'cypress', 'fixtures'));
    this.createDir(this.resolve(outDir, 'cypress', 'support'));

    // Config
    this.writeFile(
      this.resolve(outDir, `cypress.config.${ext}`),
      cypressTemplates.config(isTypeScript)
    );

    // Package.json
    this.writeFile(
      this.resolve(outDir, 'package.json'),
      cypressTemplates.packageJson(projectName, isTypeScript)
    );

    // Boilerplate test
    this.writeFile(
      this.resolve(outDir, 'cypress', 'e2e', `example.cy.${ext}`),
      cypressTemplates.exampleTest(isTypeScript)
    );

    // Fixtures
    this.writeFile(
      this.resolve(outDir, 'cypress', 'fixtures', 'example.json'),
      cypressTemplates.fixture()
    );

    // Support files
    this.writeFile(
      this.resolve(outDir, 'cypress', 'support', `commands.${ext}`),
      cypressTemplates.commands(isTypeScript)
    );
    this.writeFile(
      this.resolve(outDir, 'cypress', 'support', `e2e.${ext}`),
      cypressTemplates.supportE2e()
    );

    // TypeScript config
    if (isTypeScript) {
      this.writeFile(
        this.resolve(outDir, 'tsconfig.json'),
        cypressTemplates.tsConfig()
      );
    }

    // .gitignore
    this.writeFile(
      this.resolve(outDir, '.gitignore'),
      cypressTemplates.gitignore()
    );

    // README
    this.writeFile(
      this.resolve(outDir, 'README.md'),
      cypressTemplates.readme(projectName, language)
    );
  }
}
