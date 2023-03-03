const assetModulePath = "../../../rjlx.base.packproj.asset/node_modules/";

exports.fileCopy = async (def, projArgs) => {
    const options = def.fileCopyOptions || (def.fileCopyOptions = {});
    options.items = options.items || [
        {
            include: options.include || "**",

            exclude: options.exclude || [

                //最终生成文件放置的位置
                ...options.excludeDist || [
                    "build/dist/**",
                ],

                //未编译的源码
                ...options.excludeSrc || [
                    "@(src|public)/**",
                ],

                //文档和测试
                ...options.excludeTest || [
                    "**/@(test|*Spec|plan)/**",
                    "**/@(*.test.*|*.spec.*|*.md|README)",
                ],

                //项目构建脚本
                ...options.excludePackProj || [
                    "@(packProj|scripts|config)/**",
                    "@(packProj*)",
                ],

                //项目依赖包代码
                ...options.excludeNpm || [
                    "@(node_modules)/**",
                    "@(package.json|package-lock.json|npm-*|pnpm-*|*.tgz)",
                ],

                //脚本源码
                ...options.excludeTs || [
                    "**/@(tsconfig.json|*.tsbuildinfo|!(*.d.ts)*.ts|*.tsx|jsconfig.json)",
                ],

                //配置补充其他
                ...options.excludeAppend || [],
            ],
        },
    ];

};

exports.fileCopyPaste = async (def, projArgs) => {



    console.log("正在拷贝文件……");

    const options = def.fileCopyOptions || (def.fileCopyOptions = {});

    if (options.pasteDis) {
        console.log("文件拷贝完成。不需要文件拷贝。");
        return;
    }

    options.buildPath = options.buildPath || "build/dist";

    const glob = require(assetModulePath + "glob");
    const path = require("path");
    const fs = require("fs");

    for (const depDef of [...def.depFlat, def]) {
        const depOptions = depDef.fileCopyOptions || {};
        for (const item of depOptions.items || []) {
            const paths = await new Promise((resolve, reject) => {
                glob(
                    item.include,
                    {
                        cwd: depDef.cwd,
                        nodir: true,
                        ignore: item.exclude,
                        nocase: true,
                    },
                    (err, files) => {
                        if (!!err) {
                            reject(err);
                            return;
                        }
                        resolve(files);
                    },
                );
            });

            const parts = paths.map(a => ({
                from: path.join(depDef.cwd, a),
                to: path.join(def.cwd, options.buildPath, depDef.name, a),
            }));
            for (const part of parts) {
                const toDir = path.dirname(part.to);
                if (!fs.existsSync(toDir)) {
                    fs.mkdirSync(toDir, { recursive: true, });
                }
                fs.copyFileSync(part.from, part.to);
            }
        }
    }

    console.log("文件拷贝完成。");

};