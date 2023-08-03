const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;
let gruntCacheBustJSON;

let resourceFiles = [];
const getFilesInDirectory = (directory) => {
    const filesInDirectory = fs.readdirSync(directory);

    filesInDirectory.forEach(file => {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFilesInDirectory(filePath);
        } else {
            resourceFiles.push(filePath);
        }
    })

    resourceFiles = resourceFiles.map(file =>{
      return file.replace('upload/', '')
    })
};

// 1. Retrieve files in the directory
getFilesInDirectory('upload/resources')

// 2. READ grunt-cache-bust.json
gruntCacheBustJSON = require('./grunt-cache-bust.json');
const cacheBustedResources = Object.values(gruntCacheBustJSON.assets)

// 3. ITERATE over files in directory and upload files to S3
const uploadAwsS3 = (file, withCacheDirective)=>{
    return withCacheDirective ?
    `aws s3 cp ./upload/${file} s3://${process.env.ASSET_BUCKET_NAME}/${file} --cache-control=public,max-age=3153600` :
    `aws s3 cp ./upload/${file} s3://${process.env.ASSET_BUCKET_NAME}/${file}`
}

resourceFiles.forEach(resource=>{
    if(cacheBustedResources.includes(resource)){
        console.log('with cache', resource)
        execSync(uploadAwsS3(resource, true))
    }
    else {
        console.log('WithOUT cache', resource)
        execSync(uploadAwsS3(resource, false))
    }
})
