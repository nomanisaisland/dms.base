

exports.npmInstall = async (def) => {

  const childProcess = require("child_process");
  const npmPath = process.platform == "win32" ? "npm.cmd" : "npm";
  const cp = childProcess.spawn(
    npmPath,
    ["install"],
    {
      cwd: def.cwd,
      stdio: [process.stdin, process.stdout, process.stderr],
    });

  await new Promise((resolve, reject) => {
    cp.on("error", (err) => {
      reject(err);
    });
    cp.on("exit", (code, signal) => {
      if (code !== 0) {
        reject({
          code,
          signal,
        });
        return;
      }
      resolve();
    });
  })
};