const assetModulePath = "../../../rjlx.base.packproj.asset/node_modules/";

const portUsedServer = async (port) => {
  const { createServer } = require('net');
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.on("listening", () => {
      server.close(() => {
        resolve(false);
      });
    })
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        server.close(() => {
          resolve(true);
        });
        return;
      }
      reject(err);
    });
    server.listen(port);
  });
};

exports.portUsed = async (port) => {

  if (await portUsedServer(port)) {
    return true;
  }
  const tcpPortUsed = require(assetModulePath + 'tcp-port-used');
  const used = await tcpPortUsed.check(port);
  return used;
};

const portNextCache = [];
exports.portNext = async (port = 43210) => {
  const cacheUsed = !!portNextCache[port];
  portNextCache[port] = true;
  if (cacheUsed) {
    return await exports.portNext(port + 1);
  }
  const used = await exports.portUsed(port);
  if (used) {
    return await exports.portNext(port + 1);
  }
  return port;
};

exports.portLoad = async (portValue, portDefault = undefined) => {
  portValue = portValue || await exports.portNext(portDefault);
  return portValue;
};