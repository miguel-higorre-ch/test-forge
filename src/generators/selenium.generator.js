import { BaseGenerator } from './base.generator.js';
import { seleniumTemplates } from '../templates/selenium.templates.js';

export class SeleniumGenerator extends BaseGenerator {
  constructor() {
    super('Selenium');
  }

  async generate({ projectName, language }) {
    const outDir = this.getOutputDir(projectName);

    switch (language) {
      case 'Java':
        await this._generateJava(outDir, projectName);
        break;
      case 'Python':
        await this._generatePython(outDir, projectName);
        break;
      case 'JavaScript':
        await this._generateJavaScript(outDir, projectName);
        break;
      default:
        throw new Error(`Unsupported language for Selenium: ${language}`);
    }
  }

  async _generateJava(outDir, projectName) {
    // ── Directory Structure (Java/Maven) ─────────────────────────────────
    // my-project/
    // ├── src/
    // │   ├── test/
    // │   │   └── java/
    // │   │       ├── pages/
    // │   │       │   └── HomePage.java
    // │   │       └── tests/
    // │   │           └── HomePageTest.java
    // │   └── main/
    // │       └── java/
    // │           └── utils/
    // │               └── DriverManager.java
    // ├── resources/
    // │   └── config.properties
    // └── pom.xml
    // ────────────────────────────────────────────────────────────────────

    const pkg = projectName.toLowerCase().replace(/[-_]/g, '');
    const base = `src/test/java/${pkg}`;

    this.createDir(this.resolve(outDir, base, 'pages'));
    this.createDir(this.resolve(outDir, base, 'tests'));
    this.createDir(this.resolve(outDir, `src/main/java/${pkg}/utils`));
    this.createDir(this.resolve(outDir, 'resources'));

    this.writeFile(
      this.resolve(outDir, 'pom.xml'),
      seleniumTemplates.pomXml(projectName, pkg)
    );

    this.writeFile(
      this.resolve(outDir, base, 'pages', 'HomePage.java'),
      seleniumTemplates.javaHomePage(pkg)
    );

    this.writeFile(
      this.resolve(outDir, base, 'tests', 'HomePageTest.java'),
      seleniumTemplates.javaHomePageTest(pkg)
    );

    this.writeFile(
      this.resolve(outDir, `src/main/java/${pkg}/utils`, 'DriverManager.java'),
      seleniumTemplates.javaDriverManager(pkg)
    );

    this.writeFile(
      this.resolve(outDir, 'resources', 'config.properties'),
      seleniumTemplates.configProperties()
    );

    this.writeFile(this.resolve(outDir, '.gitignore'), seleniumTemplates.gitignoreJava());
    this.writeFile(
      this.resolve(outDir, 'README.md'),
      seleniumTemplates.readme(projectName, 'Java')
    );
  }

  async _generatePython(outDir, projectName) {
    // ── Directory Structure (Python/pytest) ──────────────────────────────
    // my-project/
    // ├── pages/
    // │   ├── __init__.py
    // │   └── home_page.py
    // ├── tests/
    // │   ├── conftest.py
    // │   └── test_home_page.py
    // ├── utils/
    // │   └── driver_factory.py
    // ├── resources/
    // │   └── config.ini
    // ├── requirements.txt
    // └── pytest.ini
    // ────────────────────────────────────────────────────────────────────

    this.createDir(this.resolve(outDir, 'pages'));
    this.createDir(this.resolve(outDir, 'tests'));
    this.createDir(this.resolve(outDir, 'utils'));
    this.createDir(this.resolve(outDir, 'resources'));

    this.writeFile(this.resolve(outDir, 'requirements.txt'), seleniumTemplates.requirementsTxt());
    this.writeFile(this.resolve(outDir, 'pytest.ini'), seleniumTemplates.pytestIni());
    this.writeFile(this.resolve(outDir, 'pages', '__init__.py'), '');
    this.writeFile(this.resolve(outDir, 'tests', '__init__.py'), '');
    this.writeFile(this.resolve(outDir, 'utils', '__init__.py'), '');
    this.writeFile(this.resolve(outDir, 'pages', 'home_page.py'), seleniumTemplates.pythonHomePage());
    this.writeFile(this.resolve(outDir, 'tests', 'conftest.py'), seleniumTemplates.pythonConftest());
    this.writeFile(this.resolve(outDir, 'tests', 'test_home_page.py'), seleniumTemplates.pythonHomePageTest());
    this.writeFile(this.resolve(outDir, 'utils', 'driver_factory.py'), seleniumTemplates.pythonDriverFactory());
    this.writeFile(this.resolve(outDir, 'resources', 'config.ini'), seleniumTemplates.configIni());

    this.writeFile(this.resolve(outDir, '.gitignore'), seleniumTemplates.gitignorePython());
    this.writeFile(
      this.resolve(outDir, 'README.md'),
      seleniumTemplates.readme(projectName, 'Python')
    );
  }

  async _generateJavaScript(outDir, projectName) {
    // ── Directory Structure (JavaScript) ─────────────────────────────────
    // my-project/
    // ├── pages/
    // │   └── HomePage.js
    // ├── tests/
    // │   └── homePageTest.js
    // ├── utils/
    // │   └── driverFactory.js
    // ├── package.json
    // └── .mocharc.js
    // ────────────────────────────────────────────────────────────────────

    this.createDir(this.resolve(outDir, 'pages'));
    this.createDir(this.resolve(outDir, 'tests'));
    this.createDir(this.resolve(outDir, 'utils'));

    this.writeFile(
      this.resolve(outDir, 'package.json'),
      seleniumTemplates.packageJson(projectName)
    );
    this.writeFile(this.resolve(outDir, '.mocharc.cjs'), seleniumTemplates.mochaConfig());
    this.writeFile(this.resolve(outDir, 'pages', 'HomePage.js'), seleniumTemplates.jsHomePage());
    this.writeFile(this.resolve(outDir, 'tests', 'homePageTest.js'), seleniumTemplates.jsHomePageTest());
    this.writeFile(this.resolve(outDir, 'utils', 'driverFactory.js'), seleniumTemplates.jsDriverFactory());

    this.writeFile(this.resolve(outDir, '.gitignore'), seleniumTemplates.gitignoreNode());
    this.writeFile(
      this.resolve(outDir, 'README.md'),
      seleniumTemplates.readme(projectName, 'JavaScript')
    );
  }
}
