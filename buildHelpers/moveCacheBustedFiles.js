/**
 * This is a utility script to identify and move the resources
 * that have been cache busted to a new folder preserving their directory structure.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const gruntCacheBustJSON = require('../source/resources/grunt-cache-bust.json');

const resourcesFolder = 'source/resources';
const destFolder = 'uploadWithCache';

let resourceFiles = [];
const getFilesInDirectory = (directory) => {
    const filesInDirectory = fs.readdirSync(directory);

    filesInDirectory.forEach((file) => {
        const filePath = path.join(directory, file);

        if (fs.statSync(filePath).isDirectory()) {
            getFilesInDirectory(filePath);
        } else {
            resourceFiles.push(filePath);
        }
    });

    resourceFiles = resourceFiles.map((file) => {
        return file.replace('source/', '');
    });
};

// Get list of files
getFilesInDirectory(resourcesFolder);

// Read the resources that were cache busted from grunt-cache-bust.json
const cacheBustedResources = Object.values(gruntCacheBustJSON.assets);

// Move cache busted files to a diferent folder
resourceFiles.forEach((resource) => {
    if (cacheBustedResources.includes(resource)) {
        // Extract directory path
        const dirPath = path.dirname(resource);

        // If folder doesn't exist, then create it
        if (!fs.existsSync(`${destFolder}/${dirPath}`)) {
            execSync(`mkdir -p ${destFolder}/${dirPath}`);
        }

        // Move files
        execSync(`mv upload/${resource} ${destFolder}/${resource}`);
    }
});
