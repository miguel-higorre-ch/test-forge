import fs from 'fs';
import path from 'path';

/**
 * BaseGenerator — Abstract base class for all framework generators.
 * Every new generator MUST extend this class and implement `generate()`.
 */
export class BaseGenerator {
  constructor(frameworkName) {
    this.frameworkName = frameworkName;
  }

  /**
   * Entry point called by the CLI. Must be implemented by subclasses.
   * @param {{ projectName: string, language: string }} options
   */
  async generate(options) {
    throw new Error(`generate() must be implemented by ${this.constructor.name}`);
  }

  /**
   * Resolves the absolute output path for the project.
   */
  getOutputDir(projectName) {
    return path.resolve(process.cwd(), projectName);
  }

  /**
   * Creates a directory (and parents) if it doesn't already exist.
   */
  createDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  /**
   * Writes a file, creating parent directories as needed.
   * @param {string} filePath  - Absolute path to the file
   * @param {string} content   - File content to write
   */
  writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
  }

  /**
   * Helper to join the output dir with a relative path.
   */
  resolve(baseDir, ...segments) {
    return path.join(baseDir, ...segments);
  }
}
