const fs = require('fs');
const path = require('path');
const gruntCacheBustJSON = require('../source/resources/grunt-cache-bust.json');
const { execSync } = require('child_process');

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

// 1. list of files 
getFilesInDirectory('source/resources')

// 2. Get the resources that were cache busted from grunt-cache-bust.json
const cacheBustedResources = Object.values(gruntCacheBustJSON.assets);

// 3. create folders 'upload' 'uploadCache'
// execSync("rm -rf upload; mkdir upload")
// execSync("cp -r source/resources upload/resources")
// execSync("rm -rf uploadCache; mkdir uploadCache")


// 4. move cache busted files to 'cacheUpload' folder
resourceFiles.forEach((resource) => {
    if (cacheBustedResources.includes(resource)) {
       // extract directory path
        const dirPath = path.dirname(resource)

        // if folder doesnt exist then create it
        if(!fs.existsSync(`uploadCache/${dirPath}`)){
            execSync(`mkdir -p uploadCache/${dirPath}`)
        }

        // copy/move files
        execSync(`mv upload/${resource} uploadCache/${resource}` )
    }
});


