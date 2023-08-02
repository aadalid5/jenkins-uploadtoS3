const fs = require("fs");
const path = require("path");
const grunt_cache_bust = require('./grunt-cache-bust.json');
const execSync = require("child_process").execSync;


// #region READ FILES INSIDE DIRECTORY (recursive sync)
let directoryFiles = [];

const getFilesRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory);
  console.log(filesInDirectory)
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

getFilesRecursively('source/resources')

// #endregion


// READ grunt-cache-bust.json
const cache_busted = Object.values(grunt_cache_bust.assets)


// ITERATE over files in directory
directoryFiles.forEach(file=>{
    if(cache_busted.includes(file)){
        console.log('aws s3 copy cache-control ', file)
    }
    else {
        console.log('aws s3 copy', file)
    }
})



// const command = "aws iam list-users"
// console.log(homedir)
// console.log(execSync(command).toString())
