export const playwrightTemplates = {

  config: (isTypeScript) => `import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
`,

  packageJson: (projectName, isTypeScript) => JSON.stringify({
    name: projectName,
    version: '1.0.0',
    description: `Playwright E2E test suite for ${projectName}`,
    ...(!isTypeScript && {
      type: 'module',
    }),
    scripts: {
      test: 'playwright test',
      'test:headed': 'playwright test --headed',
      'test:ui': 'playwright test --ui',
      'test:debug': 'playwright test --debug',
      report: 'playwright show-report',
    },
    devDependencies: {
      '@playwright/test': '^1.41.0',
      ...(isTypeScript && {
        typescript: '^5.3.3',
        '@types/node': '^20.11.5',
      }),
    },
  }, null, 2),

  exampleTest: (isTypeScript) => `import { test, expect } from '@playwright/test';

test.describe('Example Test Suite', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Example Domain/);
  });

  test('has main heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: 'Example Domain' });
    await expect(heading).toBeVisible();
  });

  test('has a "More information" link', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: 'More information...' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /iana\.org/);
  });
});
`,

  todoTest: (isTypeScript) => `import { test, expect } from '@playwright/test';

// This demo test shows more advanced Playwright patterns.
// Feel free to delete or adapt it.

test.describe('Demo: Playwright Features', () => {
  test('screenshot example', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
  });

  test('network interception example', async ({ page }) => {
    await page.route('**/*.png', (route) => route.abort());
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example Domain/);
  });
});
`,

  tsConfig: () => JSON.stringify({
    compilerOptions: {
      target: 'ESNext',
      module: 'commonjs',
      moduleResolution: 'node',
      strict: true,
      esModuleInterop: true,
      outDir: 'dist',
    },
    include: ['tests/**/*.ts', 'tests-examples/**/*.ts'],
  }, null, 2),

  requirementsTxt: () => `pytest>=7.4.0
playwright>=1.41.0
pytest-playwright>=0.4.4
pytest-html>=4.1.1
`,

  pytestIni: () => `[pytest]
addopts = --html=reports/report.html --self-contained-html
testpaths = tests
`,

  conftest: () => `import pytest
from playwright.sync_api import Browser, BrowserContext, Page


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "base_url": "https://example.com",
        "viewport": {"width": 1280, "height": 720},
        "record_video_dir": "reports/videos/",
    }
`,

  pythonExampleTest: () => `import pytest
from playwright.sync_api import Page, expect


class TestExampleDomain:
    """Test suite for Example Domain."""

    def test_page_title(self, page: Page) -> None:
        """Verify the page has the correct title."""
        page.goto("/")
        expect(page).to_have_title("Example Domain")

    def test_main_heading_visible(self, page: Page) -> None:
        """Verify the main heading is displayed."""
        page.goto("/")
        heading = page.get_by_role("heading", name="Example Domain")
        expect(heading).to_be_visible()

    def test_more_information_link(self, page: Page) -> None:
        """Verify the 'More information' link is present and correct."""
        page.goto("/")
        link = page.get_by_role("link", name="More information...")
        expect(link).to_be_visible()
        expect(link).to_have_attribute("href", "https://www.iana.org/domains/reserved")
`,

  pythonBasePage: () => `from playwright.sync_api import Page


class BasePage:
    """Base page class with common page interactions (Page Object Model)."""

    def __init__(self, page: Page) -> None:
        self.page = page

    def navigate(self, path: str = "/") -> None:
        """Navigate to a path relative to the base URL."""
        self.page.goto(path)

    def get_title(self) -> str:
        """Return the current page title."""
        return self.page.title()

    def take_screenshot(self, name: str) -> None:
        """Capture a screenshot."""
        self.page.screenshot(path=f"reports/screenshots/{name}.png")
`,

  gitignore: () => `node_modules/
playwright-report/
test-results/
.DS_Store
dist/
`,

  gitignorePython: () => `__pycache__/
*.pyc
.pytest_cache/
reports/
.DS_Store
`,

  readme: (projectName, language) => {
    const isPython = language === 'Python';
    const ext = language === 'TypeScript' ? 'ts' : 'js';

    return `# ${projectName}

> Playwright E2E Test Suite — ${language}

## Prerequisites

${isPython
  ? '- Python >= 3.9\n- pip'
  : '- Node.js >= 18\n- npm >= 9'}

## Getting Started

\`\`\`bash
${isPython
  ? `# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install

# Run all tests
pytest

# Run with a specific browser
pytest --browser chromium`
  : `# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests (headless)
npm test

# Run with UI mode
npm run test:ui`}
\`\`\`

## Project Structure

\`\`\`
${projectName}/
${isPython
  ? `├── tests/
│   ├── conftest.py       # Fixtures & hooks
│   └── test_example.py   # Example test
├── pages/
│   └── base_page.py      # Page Object base class
├── requirements.txt
└── pytest.ini`
  : `├── tests/
│   └── example.spec.${ext}   # Example test
├── tests-examples/
│   └── demo-todo-app.spec.${ext}
├── playwright.config.${ext}
└── package.json`}
\`\`\`

## Documentation

- [Playwright Docs](https://playwright.dev/docs/intro)
`;
  },
};
