import { CypressGenerator } from './cypress.generator.js';
import { PlaywrightGenerator } from './playwright.generator.js';
import { SeleniumGenerator } from './selenium.generator.js';

const generators = new Map([
  ['Cypress', new CypressGenerator()],
  ['Playwright', new PlaywrightGenerator()],
  ['Selenium', new SeleniumGenerator()],
]);

export function getGenerator(framework) {
  const generator = generators.get(framework);

  if (!generator) {
    throw new Error(`Unsupported framework: ${framework}`);
  }

  return generator;
}

