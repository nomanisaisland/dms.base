/**
 * 消费端小程序
 * https://open.taobao.com/api.htm?docId=46628&docType=2&source=search
 */
export class Miniapp {

  /**
   * 店铺
   */
  shopId?: string;

  /**
   * 端类型： miniapp =小程序， widget =小部件 ， qn = 千牛端
   */
  runatType?: string;

  id?: string;

  /**
   * 选择的模板
   */
  templateId?: string;

  tbTemplateId?: string;

  tbTemplateVersion?: string;

  description?: string;

  icon?: string;

  name?: string;


  alias?: string;

  /**
   * 对应的淘宝小程序id
   */
  tbAppId?: string;

  /**
   * 淘宝返回结果，仅记录
   */
  tbAppName?: string;

  tbAppAlias?: string;

  /**
   * 淘宝返回结果，仅记录
   */
  tbAppDescription?: string;

  /**
   * 淘宝返回结果，仅记录
   */
  tbAppIcon?: string;

  /**
   * 投放端,目前可投放： taobao(淘宝),tmall(天猫)
   */
  tbClients?: string;

  tbExtJson?: string;

  tbAppkey?: string;

  tbPreViewUrl?: string;

  tbOnlineUrl?: string;


  //? 小部件 onlineCode code
  tbOnlineCode?: string;

  //? 小部件
  tbOnlineVersion?: string;


  pubTbTime?: number;

  tbAppVersion?: string;

  hidden?: boolean;
  hiddenTime?: number;

  addTime?: number;
  addUserId?: string;
  editTime?: number;
  editUserId?: number;
  remove?: boolean;
  removeTime?: number;
  removeUserId?: string;

}

/**
 * 模板，用于生成小程序
 */
export class MiniappTemplate {

  id?: string;

  tbTemplateId?: string;

  tbTemplateVersion?: string;

  name?: string;

  icon?: string;

  description?: string;

  tbClients?: string;

  tbExtJson?: string;


  /**
   * 最多能创建的活动数量
   */
  maxNum?: number;


  /**
 * 使用小程序模板本身，一个商铺对应一个小程序，
 * 并且该程序就是模版本身，定制模式（非sass）适用。
 */
  modeTemplateSelf?: boolean;

  /**
   * 一个商铺对应单个小程序，不能创建多个，仅软限制。
   */
  modeInstanceSingle?: boolean;

}
