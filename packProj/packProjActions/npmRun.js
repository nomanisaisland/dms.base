

exports.npmRunStart = async (def, projArgs) => {
  def.npmRunStart = def.npmRunStart || {};
  const { portLoad } = require("./portLoad");
  def.npmRunStart.portValue = await portLoad(def.npmRunStart.portForce, def.npmRunStart.port);

  console.log({
    npmRunStart: def.npmRunStart,
    cwd: def.cwd,
  });

  const childProcess = require("child_process");
  const npmPath = process.platform == "win32" ? "npm.cmd" : "npm";
  const cp = childProcess.spawn(
    npmPath,
    ["run", "start"],
    {
      cwd: def.cwd,
      env: {
        ...process.env,
        BROWSER: "NONE",
        PORT: def.npmRunStart.portValue,
        PUBLIC_URL: `${def.name}/build`,
        ...projArgs,
      },
      //stdio: "pipe",
      stdio: [process.stdin, process.stdout, process.stderr],
    });
  void cp;

  def.httpProxy = def.httpProxy || {};
  def.httpProxy.items = def.httpProxy.items || [];
  def.httpProxy.items.push({
    path: `/${def.name}/build/**`,
    //pathRewrite: { [`^/${def.name}/build`]: "", },
    target: `http://localhost:${def.npmRunStart.portValue}/`,
    ws: true,
    changeOrigin: true,
  });
};

exports.npmRunBuild = async (def) => {

};

exports.npmRunTest = async (def) => {

};