/**
 * @Author: lujiafeng
 * @Email: 934789537@qq.com
 * @Date: 2023-02-15 11:24:22
 * @Description: 
 * @LastEditors: lujiafeng
 * @LastEditTime: 2023-02-16 14:39:57
 */
//模块定义
exports.packProjDef = (def) => {
  //分析入口
  if (!def.module || !def.module.exports) {
    throw new Error();
  }
  const path = require("path");
  def.cwd = def.cwd || path.dirname(def.module.filename);
  def.env = def.env || process.env;
  def.name = def.name || path.basename(def.cwd);
  //分析入口参数
  const projArgsParse = () => {
    const action = process.argv[2];
    const processArgs = process.argv.slice(3);
    const projArgs = processArgs.reduce((pre, cur) => {
      const match = String(cur).match(/^\W*([^=]+)=?(.*)$/) || [];
      const k = match[1] || String(cur);
      const v = match[2] || k;
      if (!k) {
        return pre;
      }
      return {
        ...pre,
        [k]: v,
      };
    }, {});
    projArgs.projMainAction = action;
    return projArgs;
  };
  def.projArgs = {
    ...projArgsParse(),
    ...def.projArgs,
  };
  const projArgs = def.projArgs;
  //查找所有依赖项
  const depFlatFn = (projArgs, aDef, depDefs = []) => {
    const deps = Array.from(
      typeof aDef.deps == "function" ?
        aDef.deps(aDef, projArgs) || [] :
        aDef.deps || []
    ).filter(a => !!a);
    for (const depDef of deps) {
      depDefs.unshift(depDef);
      depDefs = depFlatFn(projArgs, depDef, depDefs);
    }
    depDefs = depDefs.filter((a, i) => depDefs.indexOf(a) == i);
    return depDefs;
  };
  def.depFlatFn = def.depFlatFn || depFlatFn;
  def.depFlat = def.depFlat || depFlatFn(projArgs, def, []);

  //执行入口的命令
  if (def.module === require.main) {
    def.main = true;
    def.mainAction = projArgs.projMainAction;
    if (!def.mainAction || !def[def.mainAction]) {
      throw new Error(`无效命令 '${def.mainAction}'`);
    }
    void def[def.mainAction](def.projArgs);
  }
  return def;
};

