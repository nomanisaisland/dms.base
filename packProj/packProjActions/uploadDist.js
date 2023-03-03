const { resolve } = require("path");

const assetModulePath = "../../../rjlx.base.packproj.asset/node_modules/";

/**
 * 打包文件发布到服务器
 */
exports.uploadDist = async (def, projArgs) => {
    if (!projArgs.uploadDistDistDis) {
        await exports.uploadDistDist(def, projArgs);
    }
    if (!projArgs.uploadDistUploadDis) {
        await exports.uploadDistUpload(def, projArgs);
    }
};

/**
 * 打包到成zip文件
 */
exports.uploadDistDist = async (def, projArgs) => {

    console.log(`正在准备压缩文件……`);

    const path = require("path");
    const fs = require("fs");

    const fileCopyOptions = def.fileCopyOptions || (def.fileCopyOptions = {});
    fileCopyOptions.buildPath = fileCopyOptions.buildPath || "build/dist";
    const buildPath = path.join(def.cwd, fileCopyOptions.buildPath);

    const uploadDistOptions = def.uploadDistOptions || (def.uploadDistOptions = {});
    uploadDistOptions.buildDistZipPathTpl = uploadDistOptions.buildDistZipPathTpl || "build/dist/dist.zip";

    uploadDistOptions.uploadDistLastPath =
        uploadDistOptions.uploadDistLastPath ||
        ((def, projArgs) => `../rjlx.base.data.data/uploadDistLast/${def.name}${!!projArgs.trtg ? ".trtg=" + projArgs.trtg : ""}`);


    const lastPath = path.resolve(def.cwd, uploadDistOptions.uploadDistLastPath(def, projArgs));

    const glob = require(assetModulePath + "glob");

    //删除上次生成的文件

    const zipFiles = await new Promise((resolve, reject) => {
        glob(
            "*.dist.zip",
            {
                cwd: path.resolve(
                    def.cwd,
                    path.dirname(uploadDistOptions.buildDistZipPathTpl)
                ),
                nodir: true,
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
    for (const zipFile of zipFiles) {
        const zipFileFull = path.join(
            path.resolve(
                def.cwd,
                path.dirname(uploadDistOptions.buildDistZipPathTpl)
            ),
            zipFile
        );
        if (fs.existsSync(zipFileFull)) {
            fs.unlinkSync(zipFileFull);
        }
    }


    const compressing = require(assetModulePath + 'compressing');

    console.log("正在进行分包压缩文件……");

    const zipFileSizeMax = 5 * 1048576; //mb
    let fileNo = 0;

    ++fileNo;
    let distZip = path.resolve(
        def.cwd,
        uploadDistOptions.buildDistZipPathTpl +
        ".p" + "0".repeat(Math.max(3 - String(fileNo).length, 0)) +
        String(fileNo) + ".dist.zip"
    );
    let zipStream = new compressing.zip.Stream();
    let zipFileSizeCount = 0;

    async function closeZip() {

        if (zipFileSizeCount <= 0) {
            return;
        }

        const destStream = fs.createWriteStream(distZip);
        const pump = require(assetModulePath + "pump");
        void await new Promise((resolve, reject) => {
            pump(zipStream, destStream, (error, result) => {
                if (!!error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });

        console.log(`已经创建分包压缩文件： ${distZip}`);

        ++fileNo;
        distZip = path.resolve(
            def.cwd,
            uploadDistOptions.buildDistZipPathTpl +
            ".p" + "0".repeat(Math.max(3 - String(fileNo).length, 0)) +
            String(fileNo) + ".dist.zip"
        );
        if (fs.existsSync(distZip)) {
            fs.unlinkSync(distZip);
        }
        zipStream = new compressing.zip.Stream();
        zipFileSizeCount = 0;
    }


    async function addToZip(sourceFile, file, sourceFileSize) {

        if (
            zipFileSizeCount > 0 &&
            zipFileSizeCount + sourceFileSize > zipFileSizeMax
        ) {
            await closeZip();
        }

        zipStream.addEntry(sourceFile, {
            relativePath: file,
        });
        zipFileSizeCount += sourceFileSize;

    }

    const files = await new Promise((resolve, reject) => {
        glob(
            "**",
            {
                cwd: buildPath,
                nodir: true,
                ignore: "*.dist.zip",
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

    for (const file of files) {

        const sourceFile = path.join(buildPath, file);
        const sourceFileSize = fs.statSync(sourceFile).size;
        const lastFile = path.join(lastPath, file);
        if (fs.existsSync(lastFile)) {
            if (fs.statSync(lastFile).size == sourceFileSize) {
                const lastBuffer = fs.readFileSync(lastFile);
                const sourceBuffer = fs.readFileSync(sourceFile);
                if (lastBuffer.equals(sourceBuffer)) {
                    continue;
                }
            }
        }

        console.log(file);
        if (!fs.existsSync(path.dirname(lastFile))) {
            fs.mkdirSync(path.dirname(lastFile), { recursive: true, });
        }
        fs.copyFileSync(sourceFile, lastFile);

        await addToZip(sourceFile, file, sourceFileSize);

    }

    await closeZip();

    console.log(`完成压缩文件。`);
};

/**
 * 上传zip文件到服务器
 */
exports.uploadDistUpload = async (def, projArgs) => {
    console.log(`正在上传文件……`);

    const path = require("path");
    const fs = require('fs');
    const FormData = require(assetModulePath + "form-data");

    const uploadDistOptions = def.uploadDistOptions || (def.uploadDistOptions = {});
    uploadDistOptions.buildDistZipPathTpl =
        uploadDistOptions.buildDistZipPathTpl || "build/dist/dist.zip";

    const uploadUrl = typeof uploadDistOptions.uploadUrl == "function" ?
        uploadDistOptions.uploadUrl(def, projArgs) :
        uploadDistOptions.uploadUrl;
    const uploadDir = uploadDistOptions.uploadDir || "";
    const uploadPassword = uploadDistOptions.uploadPassword || "packProjZip";

    const glob = require(assetModulePath + "glob");
    const zipFiles = await new Promise((resolve, reject) => {
        glob(
            "*.dist.zip",
            {
                cwd: path.resolve(
                    def.cwd,
                    path.dirname(uploadDistOptions.buildDistZipPathTpl)
                ),
                nodir: true,
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

    for (const zipFile of zipFiles) {

        const distZip = path.join(
            path.resolve(
                def.cwd,
                path.dirname(uploadDistOptions.buildDistZipPathTpl)
            ),
            zipFile
        );

        console.log(`正在分包上传…… ${distZip}`);

        if (fs.statSync(distZip).size > 100 * 1024 * 1024) {
            throw new Error("无法上传大文件（约100m）。");
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(distZip));
        form.append("dir", uploadDir);
        form.append("password", uploadPassword);
        form.append("submit", "1");

        const resText = await new Promise((resolve, reject) => {
            form.submit(uploadUrl, (error, res) => {
                if (!!error) {
                    reject(error);
                    return;
                }
                if (res.statusCode != 200) {
                    reject(new Error(`response statusCode ${res.statusCode}`));
                    return;
                }
                res.on("error", (error) => {
                    reject(error);
                    return;
                });
                let resText = '';
                res.on('data', (bufferStr) => {
                    resText += bufferStr;
                });
                res.on('end', () => {
                    resolve(resText);
                });
            });
        });
        // console.log(resText);
        if (!String(resText).includes(`data-submit="1"`)) {
            throw new Error("未上传成功。 可能是因为文件大小操作服务器限制。");
        }
    }

    console.log(`完成上传文件。`);
};