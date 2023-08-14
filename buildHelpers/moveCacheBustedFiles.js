/**
 * This is a utility script to identify and move the resources
 * that have been cache busted to a new folder preserving their directory structure.
 */

const fs = require('fs');
const path = require('path');
const gruntCacheBustJSON = require('../source/resources/grunt-cache-bust.json');

const destFolder = 'upload-with-cache';

// Read the resources that were cache busted from grunt-cache-bust.json
const cacheBustedResources = Object.values(gruntCacheBustJSON.assets);

// Move cache busted files to a diferent folder
cacheBustedResources.forEach((resource) => {
    // Extract directory path
    const dirPath = path.dirname(resource);

    // If folder doesn't exist, then create it
    if (!fs.existsSync(`${destFolder}/${dirPath}`)) {
        fs.mkdirSync(`${destFolder}/${dirPath}`, { recursive: true })
    }

    // Move files
    fs.renameSync(`upload/${resource}`, `${destFolder}/${resource}`)
});
