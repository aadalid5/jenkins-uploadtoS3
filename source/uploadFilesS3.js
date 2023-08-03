const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const gruntCacheBustJSON = require('./resources/grunt-cache-bust.json');


const uploadToS3 = (directory) => {
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
            return file.replace('upload/', '');
        });
    };

    const uploadAwsS3 = (file, withCacheDirective) => {
        return withCacheDirective
            ? `aws s3 cp ./upload/${file} s3://${process.env.ASSET_BUCKET_NAME}/${file} --cache-control=public,max-age=3153600`
            : `aws s3 cp ./upload/${file} s3://${process.env.ASSET_BUCKET_NAME}/${file}`;
    };

    // 1. Retrieve files in the directory
    getFilesInDirectory(directory);

    // 2. Get the resources that were cache busted from grunt-cache-bust.json
    const cacheBustedResources = Object.values(gruntCacheBustJSON.assets);

    // 3. Iterate over files in the directory and upload them to S3
    resourceFiles.forEach((resource) => {
        if (cacheBustedResources.includes(resource)) {
            execSync(uploadAwsS3(resource, true));
        } else {
            execSync(uploadAwsS3(resource, false));
        }
    });
}

uploadToS3('upload/resources/css');
uploadToS3('upload/resources/js');
