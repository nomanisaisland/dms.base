const assetModulePath = "../../../rjlx.base.packproj.asset/node_modules/";

exports.httpProxy = async (def) => {
    console.log(`正在启动代理……`);
    const options = def.httpProxyOptions || (def.httpProxyOptions = {});

    const { portLoad } = require("./portLoad");
    options.portValue = await portLoad(options.portForce, options.port || 43201);

    require("../../nodejs/nodejsPolyfill");
    options.itemsAll = options.itemsAll || [...def.depFlat, def].
        flatMap(depDef => depDef.httpProxyOptions && depDef.httpProxyOptions.items || []);

    console.log({
        httpProxyOptions: options,
        cwd: def.cwd,
    });

    const express = require(assetModulePath + 'express');
    const app = express();

    //允许访问不安全的https
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    //代理服务
    const expressHttpProxy = require(assetModulePath + 'express-http-proxy');
    for (const item of options.itemsAll) {
        app.use(
            item.from,
            expressHttpProxy(
                item.to,
                {
                    limit: "2048m",
                    parseReqBody: false,
                    proxyReqPathResolver: req => req.originalUrl,
                    ...item,
                },
            ),
        );
    }

    //首页
    const homePath = `http://localhost:${options.portValue}${options.homePath || "/"}`;
    app.get('/', (_req, res) => {
        let html = ``;

        html += `<h1>集成项目</h1>`;

        html += `首页: <a href="${homePath}" target="_top">${homePath}</a> <br />`;
        html += `<br />`;

        for (const depDef of [...def.depFlat, def]) {
            depDef.httpProxyOptions = depDef.httpProxyOptions || {};
            const items = depDef.httpProxyOptions.items || [];
            for (const item of items) {
                const path = item.from.replace("/**", "/");
                const target = item.to;
                html += `
        使用地址: <a href="${path}"  target="_top">${path}</a> <br />
        内部: <a href="${target}" target="_top">${target}</a> <br />
        `;
                html += `<br />`;
            }
        }


        res.send(html);
    });
    app.listen(options.portValue);

    if (!options.browerOpenDis) {
        const openBrowser = require(assetModulePath + 'react-dev-utils/openBrowser');
        openBrowser(homePath);
    }
};