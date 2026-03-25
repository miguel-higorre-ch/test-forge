import { BaseGenerator } from './base.generator.js';
import { playwrightTemplates } from '../templates/playwright.templates.js';

export class PlaywrightGenerator extends BaseGenerator {
  constructor() {
    super('Playwright');
  }

  async generate({ projectName, language }) {
    const outDir = this.getOutputDir(projectName);

    if (language === 'Python') {
      await this._generatePython(outDir, projectName);
    } else {
      await this._generateJS(outDir, projectName, language);
    }
  }

  async _generateJS(outDir, projectName, language) {
    const isTypeScript = language === 'TypeScript';

    // ── Directory Structure (JS/TS) ──────────────────────────────────────
    // my-project/
    // ├── tests/
    // │   └── example.spec.{ts|js}
    // ├── tests-examples/
    // │   └── demo-todo-app.spec.{ts|js}
    // ├── playwright.config.{ts|js}
    // ├── package.json
    // └── tsconfig.json  (TypeScript only)
    // ────────────────────────────────────────────────────────────────────

    this.createDir(this.resolve(outDir, 'tests'));
    this.createDir(this.resolve(outDir, 'tests-examples'));

    const ext = isTypeScript ? 'ts' : 'js';

    this.writeFile(
      this.resolve(outDir, `playwright.config.${ext}`),
      playwrightTemplates.config(isTypeScript)
    );

    this.writeFile(
      this.resolve(outDir, 'package.json'),
      playwrightTemplates.packageJson(projectName, isTypeScript)
    );

    this.writeFile(
      this.resolve(outDir, 'tests', `example.spec.${ext}`),
      playwrightTemplates.exampleTest(isTypeScript)
    );

    this.writeFile(
      this.resolve(outDir, 'tests-examples', `demo-todo-app.spec.${ext}`),
      playwrightTemplates.todoTest(isTypeScript)
    );

    if (isTypeScript) {
      this.writeFile(
        this.resolve(outDir, 'tsconfig.json'),
        playwrightTemplates.tsConfig()
      );
    }

    this.writeFile(this.resolve(outDir, '.gitignore'), playwrightTemplates.gitignore());
    this.writeFile(
      this.resolve(outDir, 'README.md'),
      playwrightTemplates.readme(projectName, language)
    );
  }

  async _generatePython(outDir, projectName) {
    // ── Directory Structure (Python) ─────────────────────────────────────
    // my-project/
    // ├── tests/
    // │   ├── conftest.py
    // │   └── test_example.py
    // ├── pages/
    // │   └── base_page.py
    // ├── playwright.config.py  (pytest.ini style)
    // ├── requirements.txt
    // └── README.md
    // ────────────────────────────────────────────────────────────────────

    this.createDir(this.resolve(outDir, 'tests'));
    this.createDir(this.resolve(outDir, 'pages'));

    this.writeFile(
      this.resolve(outDir, 'requirements.txt'),
      playwrightTemplates.requirementsTxt()
    );

    this.writeFile(
      this.resolve(outDir, 'pytest.ini'),
      playwrightTemplates.pytestIni()
    );

    this.writeFile(
      this.resolve(outDir, 'tests', 'conftest.py'),
      playwrightTemplates.conftest()
    );

    this.writeFile(
      this.resolve(outDir, 'tests', 'test_example.py'),
      playwrightTemplates.pythonExampleTest()
    );

    this.writeFile(
      this.resolve(outDir, 'pages', 'base_page.py'),
      playwrightTemplates.pythonBasePage()
    );

    this.writeFile(this.resolve(outDir, '.gitignore'), playwrightTemplates.gitignorePython());
    this.writeFile(
      this.resolve(outDir, 'README.md'),
      playwrightTemplates.readme(projectName, 'Python')
    );
  }
}
