exports.phpServer = async (def) => {

    def.phpServerOptions = def.phpServerOptions || {};
    def.phpServerOptions.packEntryPath = def.phpServerOptions.packEntryPath || "packEntry.php";
    const path = require('path');
    const fs = require('fs');
    const packEntryPath = path.resolve(def.cwd, def.phpServerOptions.packEntryPath);
    if (!!def.phpServerOptions.enable || fs.existsSync(packEntryPath)) {


        const { portLoad } = require("./portLoad");
        def.phpServerOptions.portValue = await portLoad(def.phpServerOptions.portForce, def.phpServerOptions.port);

        console.log({
            phpServerOptions: def.phpServerOptions,
            cwd: def.cwd,
        });

        const packEntryPath = process.cwd();

        const childProcess = require("child_process");
        const phpPath = require.resolve("../../../rjlx.base.packproj.asset/PHP-7.4.5-x64/php.exe");
        const cp = childProcess.spawn(
            phpPath,
            ["-S", `0.0.0.0:${def.phpServerOptions.portValue}`, "-t", def.cwd],
            {
                cwd: def.cwd,
                stdio: [process.stdin, process.stdout, process.stderr],
                env: {
                    ...process.env,
                    ["packEntryPath"]: packEntryPath,
                },
            }
        );
        void cp;

        def.httpProxyOptions = def.httpProxyOptions || {};
        def.httpProxyOptions.items = def.httpProxyOptions.items || [];
        def.httpProxyOptions.items.push({
            from: `/${def.name}/**`,
            to: `http://localhost:${def.phpServerOptions.portValue}/`,
            proxyReqPathResolver: req => {
                const targetUrl = req.originalUrl.replace(new RegExp(`^/${def.name}`, "i"), "");
                return targetUrl;
            },
        });

    }

};