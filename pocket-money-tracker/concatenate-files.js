import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Concatenates all files in a directory and its subdirectories into a single text file
 * @param {string} rootDir - The root directory to start from
 * @param {string} outputFile - The path to the output file
 * @param {Array<string>} excludePatterns - Array of patterns to exclude (folders or files)
 */
function concatenateFiles(rootDir, outputFile, excludePatterns = []) {
    // Normalize the root directory path
    rootDir = path.resolve(rootDir);

    // Create or clear the output file
    fs.writeFileSync(outputFile, '', 'utf8');

    // Function to check if a path should be excluded
    function shouldExclude(filePath) {
        const relativePath = path.relative(rootDir, filePath);
        return excludePatterns.some(pattern => {
            // Check if the path matches the pattern
            if (pattern.endsWith('/') || pattern.endsWith('\\')) {
                // It's a directory pattern
                const dirPattern = pattern.slice(0, -1);
                return relativePath.startsWith(dirPattern) ||
                    relativePath === dirPattern ||
                    relativePath.includes(`${path.sep}${dirPattern}${path.sep}`);
            } else {
                // It's a file pattern
                return relativePath === pattern ||
                    relativePath.endsWith(pattern) ||
                    relativePath.includes(`${path.sep}${pattern}`);
            }
        });
    }

    // Function to process a directory recursively
    function processDirectory(dirPath) {
        if (shouldExclude(dirPath)) {
            return;
        }

        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const itemPath = path.join(dirPath, item);
            const stats = fs.statSync(itemPath);

            if (shouldExclude(itemPath)) {
                continue;
            }

            if (stats.isDirectory()) {
                processDirectory(itemPath);
            } else if (stats.isFile()) {
                try {
                    // Read the file content
                    const content = fs.readFileSync(itemPath, 'utf8');

                    // Get the relative path for display
                    const relativePath = path.relative(rootDir, itemPath);

                    // Format the output
                    const output = [
                        'FILE START',
                        `File Location: ${relativePath.replace(/\\/g, '/')}`,
                        content,
                        'FILE END',
                        '\n'
                    ].join('\n');

                    // Append to the output file
                    fs.appendFileSync(outputFile, output, 'utf8');
                    console.log(`Processed: ${relativePath}`);
                } catch (error) {
                    console.error(`Error processing file ${itemPath}: ${error.message}`);
                }
            }
        }
    }

    // Start processing from the root directory
    processDirectory(rootDir);
    console.log(`All files have been concatenated to ${outputFile}`);
}

// Parse command line arguments if script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
        console.log('Usage: node concatenate-files.js <rootDir> <outputFile> [excludePattern1,excludePattern2,...]');
        process.exit(1);
    }

    const rootDir = args[0];
    const outputFile = args[1];
    const excludePatterns = args[2] ? args[2].split(',') : ['node_modules/', 'package-lock.json', '.git/'];

    concatenateFiles(rootDir, outputFile, excludePatterns);
}

// Export the function
export default concatenateFiles;