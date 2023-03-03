const path = require("path");
const fs = require("fs");

/**
 * 
 * @returns {string[]}
 */
function fsListFileAll(dirPath) {
  const allFiles = [];
  function filesNest(dirPath) {
    if (!fs.existsSync(dirPath)) {
      return;
    }
    const files = fs.readdirSync(dirPath);
    files.forEach((file) => {
      const fPath = path.join(dirPath, file);
      const stat = fs.statSync(fPath);
      if (stat.isDirectory()) {
        filesNest(fPath);
      }
      if (stat.isFile()) {
        allFiles.push(fPath);
      }
    });
  }
  filesNest(dirPath);
  return allFiles;
}
exports.fsListFileAll = fsListFileAll;
function fsUnlinkAll(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        fsUnlinkAll(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
exports.fsUnlinkAll = fsUnlinkAll;
function fsCopyAll(fromPath, toPath) {
  const srcFiles = fsListFileAll(fromPath);
  for (const srcFile of srcFiles) {
    const rpath = path.relative(fromPath, srcFile);
    const buildFile = path.resolve(toPath, rpath);
    if (!fs.existsSync(path.dirname(buildFile))) {
      fs.mkdirSync(path.dirname(buildFile), { recursive: true, });
    }
    fs.copyFileSync(srcFile, buildFile);
  }
}
exports.fsCopyAll = fsCopyAll;


