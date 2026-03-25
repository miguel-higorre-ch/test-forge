import chalk from 'chalk';
import path from 'path';

export function printBanner() {
  const version = '1.0.0';

  console.log('');
  console.log(chalk.cyan('  ╔════════════════════════════════════════╗'));
  console.log(chalk.cyan('  ║') + chalk.bold.white('         🔧  TEST FORGE  🔧              ') + chalk.cyan('║'));
  console.log(chalk.cyan('  ║') + chalk.gray(`      Test Automation Scaffolding CLI    `) + chalk.cyan('║'));
  console.log(chalk.cyan('  ║') + chalk.gray(`               v${version}                    `) + chalk.cyan('║'));
  console.log(chalk.cyan('  ╚════════════════════════════════════════╝'));
  console.log('');
  console.log(chalk.gray('  Supported frameworks: Cypress · Playwright · Selenium'));
  console.log(chalk.gray('  Tip: Press Ctrl+C at any time to cancel'));
  console.log('');
}

export function printSuccess(projectName, framework, language) {
  const cwd = process.cwd();
  const projectPath = path.join(cwd, projectName);

  console.log('');
  console.log(chalk.green('  ✅  Your project is ready!'));
  console.log('');
  console.log(`  ${chalk.bold('Project:')}   ${chalk.white(projectName)}`);
  console.log(`  ${chalk.bold('Framework:')} ${chalk.white(framework)}`);
  console.log(`  ${chalk.bold('Language:')}  ${chalk.white(language)}`);
  console.log(`  ${chalk.bold('Location:')}  ${chalk.white(projectPath)}`);
  console.log('');
  console.log(chalk.bold('  Next steps:'));
  console.log('');

  const steps = getNextSteps(projectName, framework, language);
  steps.forEach((step, i) => {
    console.log(`  ${chalk.cyan(`${i + 1}.`)} ${step}`);
  });

  console.log('');
  console.log(chalk.gray('  Happy testing! 🚀'));
  console.log('');
}

function getNextSteps(projectName, framework, language) {
  const cd = `cd ${projectName}`;

  const map = {
    Cypress: {
      TypeScript: [cd, 'npm install', 'npx cypress open'],
      JavaScript: [cd, 'npm install', 'npx cypress open'],
    },
    Playwright: {
      TypeScript: [cd, 'npm install', 'npx playwright install', 'npm test'],
      JavaScript: [cd, 'npm install', 'npx playwright install', 'npm test'],
      Python: [
        cd,
        'python -m venv .venv',
        'activate the virtual environment (.venv\\Scripts\\activate on Windows, source .venv/bin/activate on macOS/Linux)',
        'pip install -r requirements.txt',
        'playwright install',
        'pytest',
      ],
    },
    Selenium: {
      Java: [cd, 'mvn test'],
      Python: [
        cd,
        'python -m venv .venv',
        'activate the virtual environment (.venv\\Scripts\\activate on Windows, source .venv/bin/activate on macOS/Linux)',
        'pip install -r requirements.txt',
        'pytest',
      ],
      JavaScript: [cd, 'npm install', 'npm test'],
    },
  };

  return map[framework]?.[language] ?? [cd, '# Follow the README for setup instructions'];
}
