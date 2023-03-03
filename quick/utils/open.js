module.exports = (url) => {
  // start chrome http://www.baidu.com
  if(url) {
    const childProcess = require('child_process');
    const ls = childProcess.exec(`start chrome ${url}`);
  }
}