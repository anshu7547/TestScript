const fs = require('fs');
const path = require('path');

const cypressReportsPath = path.join(__dirname, 'cypress', 'reports');
const cypressScreenshotsPath = path.join(__dirname, 'cypress', 'screenshots');

// Function to remove a directory and its contents recursively
const removeDirectoryRecursive = (directoryPath) => {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDirectoryRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
    console.log(`Directory ${directoryPath} deleted.`);
  } else {
    console.log(`No existing directory found at ${directoryPath}.`);
  }
};

// Remove the 'reports' directory
removeDirectoryRecursive(cypressReportsPath);

// Remove the 'screenshots' directory
removeDirectoryRecursive(cypressScreenshotsPath);
