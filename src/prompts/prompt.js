import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

const FRAMEWORK_LANGUAGES = {
  Cypress: ['TypeScript', 'JavaScript'],
  Playwright: ['TypeScript', 'JavaScript', 'Python'],
  Selenium: ['Java', 'Python', 'JavaScript'],
};

export async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: chalk.cyan('Project name:'),
      default: 'my-test-project',
      validate(input) {
        const trimmed = input.trim();
        if (!trimmed) return 'Project name cannot be empty.';
        if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
          return 'Project name can only contain letters, numbers, hyphens, and underscores.';
        }
        if (fs.existsSync(path.resolve(process.cwd(), trimmed))) {
          return `Directory "${trimmed}" already exists. Please choose a different name.`;
        }
        return true;
      },
      filter: (input) => input.trim(),
    },
    {
      type: 'list',
      name: 'framework',
      message: chalk.cyan('Select a testing framework:'),
      choices: [
        { name: `${chalk.green('Cypress')}       ${chalk.gray('- E2E testing for web apps (JS/TS)')}`, value: 'Cypress' },
        { name: `${chalk.blue('Playwright')}    ${chalk.gray('- Cross-browser E2E automation (JS/TS/Python)')}`, value: 'Playwright' },
        { name: `${chalk.yellow('Selenium')}      ${chalk.gray('- Classic browser automation (Java/Python/JS)')}`, value: 'Selenium' },
      ],
    },
    {
      type: 'list',
      name: 'language',
      message: chalk.cyan('Select a programming language:'),
      choices(answers) {
        return FRAMEWORK_LANGUAGES[answers.framework].map((lang) => ({
          name: lang,
          value: lang,
        }));
      },
    },
  ]);

  return answers;
}
