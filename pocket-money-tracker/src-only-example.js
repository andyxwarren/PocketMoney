import concatenateFiles from './concatenate-files.js';

// Example usage for the src folder only
concatenateFiles(
    './src', // Only process the src directory
    './src-concatenated.txt',
    [
        'node_modules/',
        '.git/',
        'dist/',
        'build/'
    ]
);