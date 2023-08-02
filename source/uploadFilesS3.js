const fs = require("fs");
const path = require("path");
const grunt_cache_bust = require('./grunt-cache-bust.json');
const execSync = require("child_process").execSync;

let directoryFiles = [];
const getFilesRecursively = (directory) => {
    const filesInDirectory = fs.readdirSync(directory);
  
    for (const file of filesInDirectory) {
      const absolute = path.join(directory, file);
      if (fs.statSync(absolute).isDirectory()) {
          getFilesRecursively(absolute);
      } else {
          directoryFiles.push(absolute);
      }
    }
    directoryFiles = directoryFiles.map(file =>{
      return file.replace('source/', '')
    })
};

// Retrieve files in a directory
getFilesRecursively('source/resources')


// READ grunt-cache-bust.json
const cache_busted = Object.values(grunt_cache_bust.assets)

// ITERATE over files in directory
directoryFiles.forEach(file=>{
    if(cache_busted.includes(file)){
        console.log(`aws s3 cp ../upload/${file} s3://${process.env.ASSET_BUCKET_NAME}/${file} --cache-control=public,no-cache`)
        // sh `aws s3 cp ../upload/${file} s3://${process.env.ASSET_BUCKET_NAME}/${file} --cache-control=public, no-cache`
    }
    else {
        console.log(`aws s3 cp ../upload/${file} s3://${process.env.ASSET_BUCKET_NAME}/${file}`)
        // sh `aws s3 cp ../upload/${file} s3://${process.env.ASSET_BUCKET_NAME}/${file}`
    }
})

// const command = "aws iam list-users"
// console.log(execSync(command).toString())
