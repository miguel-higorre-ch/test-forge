export const seleniumTemplates = {

  // ─── JAVA / MAVEN ────────────────────────────────────────────────────────

  pomXml: (projectName, pkg) => `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             https://maven.apache.org/xsd/maven-4.0.0.xsd">

  <modelVersion>4.0.0</modelVersion>
  <groupId>com.${pkg}</groupId>
  <artifactId>${projectName}</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <selenium.version>4.16.1</selenium.version>
    <testng.version>7.9.0</testng.version>
    <webdrivermanager.version>5.6.3</webdrivermanager.version>
  </properties>

  <dependencies>
    <!-- Selenium WebDriver -->
    <dependency>
      <groupId>org.seleniumhq.selenium</groupId>
      <artifactId>selenium-java</artifactId>
      <version>\${selenium.version}</version>
    </dependency>

    <!-- WebDriverManager — auto-downloads browser drivers -->
    <dependency>
      <groupId>io.github.bonigarcia</groupId>
      <artifactId>webdrivermanager</artifactId>
      <version>\${webdrivermanager.version}</version>
    </dependency>

    <!-- TestNG -->
    <dependency>
      <groupId>org.testng</groupId>
      <artifactId>testng</artifactId>
      <version>\${testng.version}</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.2.3</version>
      </plugin>
    </plugins>
  </build>

</project>
`,

  javaHomePage: (pkg) => `package com.${pkg}.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * HomePage — Page Object Model class for example.com.
 * Every page should have its own class extending BasePage (optional).
 */
public class HomePage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    // ── Locators ────────────────────────────────────────────────────────────
    private final By heading = By.tagName("h1");
    private final By moreInfoLink = By.linkText("More information...");

    public HomePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void navigate() {
        driver.get("https://example.com");
    }

    public String getTitle() {
        return driver.getTitle();
    }

    public String getHeadingText() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(heading)).getText();
    }

    public boolean isMoreInfoLinkDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(moreInfoLink)).isDisplayed();
    }

    public String getMoreInfoLinkHref() {
        return driver.findElement(moreInfoLink).getAttribute("href");
    }
}
`,

  javaHomePageTest: (pkg) => `package com.${pkg}.tests;

import com.${pkg}.pages.HomePage;
import com.${pkg}.utils.DriverManager;
import org.openqa.selenium.WebDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

/**
 * HomePageTest — TestNG test class for the HomePage.
 */
public class HomePageTest {

    private WebDriver driver;
    private HomePage homePage;

    @BeforeMethod
    public void setUp() {
        driver = DriverManager.createDriver();
        homePage = new HomePage(driver);
        homePage.navigate();
    }

    @Test(description = "Verify the page has the correct title")
    public void testPageTitle() {
        Assert.assertEquals(homePage.getTitle(), "Example Domain",
            "Page title does not match expected value");
    }

    @Test(description = "Verify the main heading is visible")
    public void testMainHeading() {
        Assert.assertEquals(homePage.getHeadingText(), "Example Domain",
            "Main heading text does not match");
    }

    @Test(description = "Verify the 'More information' link is displayed")
    public void testMoreInformationLink() {
        Assert.assertTrue(homePage.isMoreInfoLinkDisplayed(),
            "More information link is not displayed");
        Assert.assertTrue(homePage.getMoreInfoLinkHref().contains("iana.org"),
            "More information link href does not contain expected domain");
    }

    @AfterMethod
    public void tearDown() {
        DriverManager.quitDriver(driver);
    }
}
`,

  javaDriverManager: (pkg) => `package com.${pkg}.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

/**
 * DriverManager — Centralized WebDriver factory.
 * Extend this class to support Firefox, Edge, etc.
 */
public class DriverManager {

    private DriverManager() {}

    /**
     * Creates and returns a configured ChromeDriver instance.
     */
    public static WebDriver createDriver() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        // Uncomment for CI/CD headless mode:
        // options.addArguments("--headless=new");

        return new ChromeDriver(options);
    }

    /**
     * Safely quits the driver instance.
     */
    public static void quitDriver(WebDriver driver) {
        if (driver != null) {
            driver.quit();
        }
    }
}
`,

  configProperties: () => `# Test Configuration
base.url=https://example.com
browser=chrome
implicit.wait=10
explicit.wait=30
`,

  // ─── PYTHON / PYTEST ─────────────────────────────────────────────────────

  requirementsTxt: () => `selenium>=4.16.1
pytest>=7.4.0
pytest-html>=4.1.1
webdriver-manager>=4.0.1
`,

  pytestIni: () => `[pytest]
addopts = -v --html=reports/report.html --self-contained-html
testpaths = tests
`,

  pythonHomePage: () => `from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class HomePage:
    """Page Object Model for example.com homepage."""

    URL = "https://example.com"

    # ── Locators ─────────────────────────────────────────────────────────────
    HEADING = (By.TAG_NAME, "h1")
    MORE_INFO_LINK = (By.LINK_TEXT, "More information...")

    def __init__(self, driver) -> None:
        self.driver = driver
        self.wait = WebDriverWait(driver, timeout=10)

    def navigate(self) -> None:
        """Open the homepage."""
        self.driver.get(self.URL)

    def get_title(self) -> str:
        """Return the page title."""
        return self.driver.title

    def get_heading_text(self) -> str:
        """Return the main heading text."""
        return self.wait.until(
            EC.visibility_of_element_located(self.HEADING)
        ).text

    def is_more_info_link_displayed(self) -> bool:
        """Check if the 'More information' link is visible."""
        return self.wait.until(
            EC.visibility_of_element_located(self.MORE_INFO_LINK)
        ).is_displayed()
`,

  pythonConftest: () => `import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from utils.driver_factory import DriverFactory


@pytest.fixture(scope="function")
def driver():
    """Pytest fixture: create a WebDriver instance for each test."""
    driver = DriverFactory.create_driver()
    yield driver
    driver.quit()
`,

  pythonHomePageTest: () => `import pytest
from pages.home_page import HomePage


class TestHomePage:
    """Test suite for example.com homepage using Selenium + pytest."""

    def test_page_title(self, driver) -> None:
        """Verify the page has the correct title."""
        page = HomePage(driver)
        page.navigate()
        assert page.get_title() == "Example Domain", (
            f"Expected 'Example Domain', got '{page.get_title()}'"
        )

    def test_main_heading_visible(self, driver) -> None:
        """Verify the main heading is displayed with correct text."""
        page = HomePage(driver)
        page.navigate()
        assert page.get_heading_text() == "Example Domain"

    def test_more_info_link_displayed(self, driver) -> None:
        """Verify the 'More information' link is visible."""
        page = HomePage(driver)
        page.navigate()
        assert page.is_more_info_link_displayed(), (
            "'More information' link is not displayed on the page"
        )
`,

  pythonDriverFactory: () => `from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


class DriverFactory:
    """Factory class for creating Selenium WebDriver instances."""

    @staticmethod
    def create_driver(headless: bool = False) -> webdriver.Chrome:
        """
        Create and return a configured Chrome WebDriver.

        Args:
            headless: Run Chrome in headless mode (useful for CI/CD).
        """
        options = Options()
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1280,720")

        if headless:
            options.add_argument("--headless=new")

        service = Service(ChromeDriverManager().install())
        return webdriver.Chrome(service=service, options=options)
`,

  configIni: () => `[DEFAULT]
base_url = https://example.com
browser = chrome
implicit_wait = 10
explicit_wait = 30
`,

  // ─── JAVASCRIPT / MOCHA ──────────────────────────────────────────────────

  packageJson: (projectName) => JSON.stringify({
    name: projectName,
    version: '1.0.0',
    description: `Selenium test suite for ${projectName}`,
    type: 'module',
    scripts: {
      test: 'mocha',
      'test:headless': 'HEADLESS=true mocha',
    },
    dependencies: {
      'selenium-webdriver': '^4.16.0',
    },
    devDependencies: {
      mocha: '^10.2.0',
      chai: '^5.0.3',
    },
  }, null, 2),

  mochaConfig: () => `module.exports = {
  spec: 'tests/**/*.js',
  timeout: 30000,
  reporter: 'spec',
};
`,

  jsHomePage: () => `import { By, until } from 'selenium-webdriver';

/**
 * HomePage — Page Object Model for example.com
 */
export class HomePage {
  static URL = 'https://example.com';

  // Locators
  static HEADING = By.css('h1');
  static MORE_INFO_LINK = By.linkText('More information...');

  constructor(driver) {
    this.driver = driver;
  }

  async navigate() {
    await this.driver.get(HomePage.URL);
  }

  async getTitle() {
    return this.driver.getTitle();
  }

  async getHeadingText() {
    const el = await this.driver.wait(until.elementLocated(HomePage.HEADING), 10_000);
    return el.getText();
  }

  async isMoreInfoLinkDisplayed() {
    const el = await this.driver.wait(until.elementLocated(HomePage.MORE_INFO_LINK), 10_000);
    return el.isDisplayed();
  }
}
`,

  jsHomePageTest: () => `import { Builder } from 'selenium-webdriver';
import { expect } from 'chai';
import { DriverFactory } from '../utils/driverFactory.js';
import { HomePage } from '../pages/HomePage.js';

describe('HomePage Test Suite', function () {
  this.timeout(30_000);

  let driver;
  let page;

  beforeEach(async () => {
    driver = await DriverFactory.createDriver();
    page = new HomePage(driver);
    await page.navigate();
  });

  afterEach(async () => {
    if (driver) await driver.quit();
  });

  it('should display the correct page title', async () => {
    const title = await page.getTitle();
    expect(title).to.equal('Example Domain');
  });

  it('should display the main heading', async () => {
    const heading = await page.getHeadingText();
    expect(heading).to.equal('Example Domain');
  });

  it('should display the "More information" link', async () => {
    const isDisplayed = await page.isMoreInfoLinkDisplayed();
    expect(isDisplayed).to.be.true;
  });
});
`,

  jsDriverFactory: () => `import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

/**
 * DriverFactory — Centralized WebDriver factory for JavaScript.
 */
export class DriverFactory {
  static async createDriver({ headless = process.env.HEADLESS === 'true' } = {}) {
    const options = new chrome.Options();
    options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,720');

    if (headless) {
      options.addArguments('--headless=new');
    }

    return new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }
}
`,

  // ─── GITIGNORE ───────────────────────────────────────────────────────────

  gitignoreJava: () => `target/
*.class
*.jar
.DS_Store
reports/
.idea/
*.iml
`,

  gitignorePython: () => `__pycache__/
*.pyc
.pytest_cache/
reports/
.DS_Store
.venv/
`,

  gitignoreNode: () => `node_modules/
reports/
.DS_Store
`,

  // ─── README ──────────────────────────────────────────────────────────────

  readme: (projectName, language) => {
    const sections = {
      Java: {
        prereqs: '- Java 17+\n- Maven 3.8+\n- Google Chrome (latest)',
        install: `# Install dependencies & run tests
mvn test

# Run with Maven (skipping test compilation)
mvn verify`,
        structure: `${projectName}/
├── src/
│   ├── main/java/${projectName}/utils/
│   │   └── DriverManager.java
│   └── test/java/${projectName}/
│       ├── pages/
│       │   └── HomePage.java
│       └── tests/
│           └── HomePageTest.java
├── resources/
│   └── config.properties
└── pom.xml`,
        docs: '[Selenium Java Docs](https://www.selenium.dev/documentation/)',
      },
      Python: {
        prereqs: '- Python 3.9+\n- pip\n- Google Chrome (latest)',
        install: `# Create virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Run all tests
pytest

# Run with HTML report
pytest --html=reports/report.html`,
        structure: `${projectName}/
├── pages/
│   └── home_page.py       # Page Object Models
├── tests/
│   ├── conftest.py        # Fixtures
│   └── test_home_page.py  # Test cases
├── utils/
│   └── driver_factory.py
├── resources/
│   └── config.ini
├── requirements.txt
└── pytest.ini`,
        docs: '[Selenium Python Docs](https://selenium-python.readthedocs.io/)',
      },
      JavaScript: {
        prereqs: '- Node.js 18+\n- npm 9+\n- Google Chrome (latest)',
        install: `# Install dependencies
npm install

# Run tests
npm test

# Run headlessly (CI mode)
npm run test:headless`,
        structure: `${projectName}/
├── pages/
│   └── HomePage.js        # Page Object Models
├── tests/
│   └── homePageTest.js    # Test cases
├── utils/
│   └── driverFactory.js
├── package.json
└── .mocharc.cjs`,
        docs: '[Selenium JS Docs](https://www.selenium.dev/selenium/docs/api/javascript/)',
      },
    };

    const s = sections[language];
    return `# ${projectName}

> Selenium Test Suite — ${language} (Page Object Model)

## Prerequisites

${s.prereqs}

## Getting Started

\`\`\`bash
${s.install}
\`\`\`

## Project Structure

\`\`\`
${s.structure}
\`\`\`

## Documentation

- ${s.docs}
- [WebDriverManager](https://bonigarcia.dev/webdrivermanager/)
`;
  },
};
