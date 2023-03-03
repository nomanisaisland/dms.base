import { RouteEnvConfig } from "../../../pack/RouteEnvConfig";
import { RecordUtil } from "../../../value/RecordUtil";

/**
 * 小程序模板
 */
export const miniappTemplateList = async (context) => {

  return RecordUtil.deepClone(RouteEnvConfig.miniappTemplateList);
};


