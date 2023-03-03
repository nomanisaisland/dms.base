const assetModulePath = "../../../rjlx.base.packproj.asset/node_modules/";

exports.nodeRunStart = async (def, projArgs) => {

  const path = require("path");
  const fs = require('fs');

  const options = def.nodeRunOptions || (def.nodeRunOptions = {});

  console.log("正在编译ts……");

  options.tsConfigPath = options.tsConfigPath || "tsconfig.json";
  const tsConfigPath = path.resolve(def.cwd, options.tsConfigPath);
  if (fs.existsSync(tsConfigPath)) {
    const childProcess = require("child_process");
    const tscPath = require.resolve(assetModulePath + "typescript/bin/tsc");
    void childProcess.fork(tscPath, [
      "-w",
      "-p",
      tsConfigPath,
    ], {
      cwd: def.cwd,
    });
  }

  console.log("正在启动脚本webpack……");

  options.scriptPath = options.scriptPath || "scripts/start.js";
  const scriptPath = path.resolve(def.cwd, options.scriptPath);
  if (fs.existsSync(scriptPath)) {

    const { portLoad } = require("./portLoad");
    options.portValue = await portLoad(options.portForce, options.port);
    options.buildPath = options.buildPath || "build";


    const childProcess = require("child_process");
    void childProcess.fork(scriptPath, [], {
      cwd: def.cwd,
      env: {
        ...process.env,
        PUBLIC_URL: `/${def.name}/${options.buildPath}`,
        BROWSER: "NONE",
        PORT: options.portValue,
        WDS_SOCKET_HOST: "localhost",
        WDS_SOCKET_PATH: `/${def.name}/${options.buildPath}/sockjs-node`,
        WDS_SOCKET_PORT: options.portValue,
        ...projArgs,
      },
    });

    def.httpProxyOptions = def.httpProxyOptions || {};
    if (!def.httpProxyOptions.startBuildDis) {
      def.httpProxyOptions.items = def.httpProxyOptions.items || [];
      def.httpProxyOptions.items.push({
        from: options.httpProxyFrom ||
          `/${def.name}/${options.buildPath}/**`,
        to: options.httpProxyTo ||
          `${options.protocol || 'http'}://localhost:${options.portValue}/`,
        ...!!options.httpProxyResolveBuild ? {
          proxyReqPathResolver: req => {
            const targetUrl = req.originalUrl.replace(new RegExp(`^/${def.name}/${options.buildPath}`, "i"), "");
            return targetUrl;
          },
        } : {},
        ...options.httpProxyItem || {},
      });
      def.httpProxyOptions.homePath = options.httpProxyHomePath ||
        `/${def.name}/${options.buildPath}/`;
    }
  }

};

exports.nodeRunBuild = async (def, projArgs) => {

  console.log("正在编译ts……");

  const path = require("path");
  const fs = require('fs');

  const options = def.nodeRunOptions || (def.nodeRunOptions = {});

  options.tsConfigPath = options.tsConfigPath || "tsconfig.json";
  const tsConfigPath = path.resolve(def.cwd, options.tsConfigPath);
  if (fs.existsSync(tsConfigPath)) {
    const childProcess = require("child_process");
    const tscPath = require.resolve(assetModulePath + "typescript/bin/tsc");
    const cp = childProcess.fork(tscPath, [
      "-p",
      tsConfigPath,
    ], {
      cwd: def.cwd,
      env: {
        ...process.env,
        ...projArgs,
      },
    });
    await new Promise((resolve, reject) => {
      cp.once("exit", (code, signal) => {
        if (code != 0) {
          reject({ code, signal, });
        }
        resolve()
      });
    });
  }

  console.log("正在打包webpack……");

  options.scriptPath = options.scriptPath || "scripts/build.js";
  const scriptPath = path.resolve(def.cwd, options.scriptPath);
  if (fs.existsSync(scriptPath)) {

    const childProcess = require("child_process");
    const cp = childProcess.fork(scriptPath, [], {
      cwd: def.cwd,
      env: {
        ...process.env,
        PUBLIC_URL: `.`,
        ...projArgs,
      },
    });
    await new Promise((resolve, reject) => {
      cp.once("exit", (code, signal) => {
        if (code != 0) {
          reject({ code, signal, });
        }
        resolve()
      });
    });
  }

};

exports.nodeRunTest = async (def, projArgs) => {

  console.log("未集成测试框架……");

};