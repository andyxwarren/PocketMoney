import concatenateFiles from './concatenate-files.js';

// Example usage
concatenateFiles(
    '.', // Current directory (pocket-money-tracker)
    './concatenated-codebase.txt',
    [
        'node_modules/',
        'package-lock.json',
        '.git/',
        'dist/',
        'build/',
        'concatenated-codebase.txt' // Exclude the output file itself
    ]
);