
/**
 * 商家店铺信息
 */
export class Shop {

  id?: string;


  /**
   * 商家主账号的openid
   * 【重要标识】
   */
  tbAppOwnerOpenId?: string;

  /**
   * 淘宝账号名，不是显示的昵称，my.getAuthUserInfo.nickName，只要保留主账号，需要截取冒号后面部分
   * 【重要标识】
   */
  tbNickName?: string;

  /**
   * 昵**称
   */
  tbMixNick?: string;


  /**
   * 淘宝店id【重要标识】
   */
  tbShopId?: string;

  /**
   * 淘宝店铺名
   */
  tbTitle?: string;

  /**
   * 店标地址。 /e2/c0/T1KVXXXhGvt0L1upjX.jpg	店标地址。返回相对路径，可以用"http://logo.taobao.com/shop-logo"来拼接成绝对路径
   */
  tbPic?: string;


  /**
   * 卖家id【重要标识】
   */
  tbSellerId?: string;

  /**
   * 卖家昵称【重要标识】
   */
  tbSellerNick?: string;


  //todo sass订购信息

  addTime?: number;
  addUserId?: string;
  editTime?: number;
  editUserId?: number;
  remove?: boolean;
  removeTime?: number;
  removeUserId?: string;

}


