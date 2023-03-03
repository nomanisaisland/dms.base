
const { phpServer } = require("./phpServer");
//const { npmRunStart, npmRunBuild, npmRunTest } = require("./npmRun");
const { nodeRunStart, nodeRunBuild, nodeRunTest } = require("./nodeRun");
const { httpProxy } = require("./httpProxy");
const { fileCopy, fileCopyPaste, } = require("./fileCopy");
const { npmInstall } = require("./npmInstall");
const { uploadDist } = require("./uploadDist");

exports.libs = {
  nodeRunStart,
  nodeRunBuild,
  nodeRunTest,
};

exports.actions = {

  //安装npm依赖后执行，用于嵌套安装依赖
  async postinstall(projArgs) {

  },

  //嵌套安装依赖
  async linki(projArgs) {
    console.log(`正在安装……`);
    const baseAssetDef = {
      name: "rjlx.base.packproj.asset",
      cwd: require("path").resolve(__dirname, "../../../rjlx.base.packproj.asset"),
      async linkiCore(projArgs) {
        console.log(`正在安装依赖项目${this.name}……`);
        await npmInstall(this, projArgs);
        console.log(`完成安装依赖项目${this.name}。`);
      },
    };
    for (const depDef of [baseAssetDef, ...this.depFlat, this]) {
      await depDef.linkiCore({
        ...projArgs,
        packProjDep: !depDef.main,
      });
    }
    console.log(`完成安装。`);
  },
  async linkiCore(projArgs) {
    console.log(`正在安装依赖项目${this.name}……`);
    await npmInstall(this, {
      ...projArgs,
      packProjDep: !this.main,
    });
    console.log(`完成安装依赖项目${this.name}。`);
  },

  //测试
  async test(projArgs) {
    console.log(`正在测试……`);
    this.testCore({
      ...projArgs,
      packProjDep: !this.main,
    });
    console.log(`完成测试。`);
  },

  async testCore(projArgs) {
    await nodeRunTest(this, {
      ...projArgs,
      packProjDep: !this.main,
    });
  },

  //开发模式运行
  async start(projArgs) {
    console.log(`正在启动项目……`);
    for (const depDef of [...this.depFlat, this]) {
      !!depDef.startCore && await depDef.startCore({
        ...projArgs,
        packProjDep: !depDef.main,
      });
    }
    await httpProxy(this);
    console.log(`完成启动项目。`);
  },
  async startCore(projArgs) {
    console.log(`正在启动依赖项目${this.name}……`);
    if (!!this.main || !!projArgs.nest) {
      await nodeRunStart(this, {
        ...projArgs,
        packProjDep: !this.main,
      });
    }
    await phpServer(this, projArgs);
    console.log(`完成启动依赖项目${this.name}。`);
  },

  //生成
  async build(projArgs) {
    console.log(`正在生成……`);
    for (const depDef of [...this.depFlat, this]) {
      !!depDef.buildCore && await depDef.buildCore({
        ...projArgs,
        packProjDep: !depDef.main,
      });
    }

    await fileCopyPaste(this, projArgs);

    for (const depDef of [...this.depFlat, this]) {
      !!depDef.buildAfter && await depDef.buildAfter({
        ...projArgs,
        packProjDep: !depDef.main,
      });
    }
    console.log(`结束生成。`);
  },
  async buildCore(projArgs) {
    console.log(`正在生成依赖项目${this.name}……`);
    if (!!this.main || !!projArgs.nest) {
      await nodeRunBuild(this, {
        ...projArgs,
        packProjDep: !this.main,
      });
    }
    await fileCopy(this, projArgs);
    console.log(`结束生成依赖项目${this.name}。`);
  },

  //上传
  async upload(projArgs) {
    console.log(`正在上传……`);
    if (!projArgs.uploadBuildDis) {
      await this.build({
        ...projArgs,
        packProjDep: !this.main,
      });
    }
    await uploadDist(this, {
      ...projArgs,
      packProjDep: !this.main,
    });
    console.log(`上传成功。`);
  },

};