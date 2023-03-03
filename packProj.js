/**
 * @Author: lujiafeng
 * @Email: 934789537@qq.com
 * @Date: 2023-02-15 11:24:22
 * @Description: 
 * @LastEditors: lujiafeng
 * @LastEditTime: 2023-02-16 14:36:38
 */
const { packProjDef } = require("./packProj/packProjDef");
const { actions } = require("./packProj/packProjActions/actions");


packProjDef({
    ...actions,
    module,
    deps: [],
});
