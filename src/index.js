import chalk from 'chalk';
import ora from 'ora';
import { promptUser } from './prompts/prompt.js';
import { getGenerator } from './generators/index.js';
import { printBanner, printSuccess } from './utils/logger.js';

export async function run() {
  printBanner();

  let answers;
  try {
    answers = await promptUser();
  } catch (error) {
    console.log(chalk.yellow('\n\n  Scaffolding cancelled. Goodbye!\n'));
    process.exit(0);
  }

  const { projectName, framework, language } = answers;

  console.log('');
  const spinner = ora({
    text: chalk.cyan(`Generating ${framework} project with ${language}...`),
    color: 'cyan',
  }).start();

  try {
    const generator = getGenerator(framework);
    await generator.generate({ projectName, language });

    spinner.succeed(chalk.green('Project scaffolded successfully!'));
    printSuccess(projectName, framework, language);
  } catch (error) {
    spinner.fail(chalk.red('Scaffolding failed.'));
    console.error(chalk.red(`\n  Error: ${error.message}\n`));
    process.exit(1);
  }
}
