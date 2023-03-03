
/**
 * 用户，包含消费者帐号和商家帐号，店铺之间不共享用户信息
 */
export class User {

  shopId?: string;

  id?: string;

  /**
   * 淘宝小程序用户id，可以从云函数获取到
   */
  tbOpenId?: string;

  /**
   * 淘宝账号名，不是显示的昵称，my.getAuthUserInfo.nickName
   */
  tbNickName?: string;

  /**
   * 混淆后的淘宝账号，不是显示昵称，没有可读性
   */
  tbMixNick?: string;

  /**
   * 淘宝用户头像地址
   */
  tbAvatar?: string;



  /**
   * 小程序客户端令牌
   */
  tbAccessToken?: string;
  tbAccessTokenTime?: string;

  /**
   * 牵牛客户端令牌
   */
  tbBizAccessToken?: string;
  tbBizAccessTokenTime?: string;


  addTime?: number;
  addUserId?: string;
  editTime?: number;
  editUserId?: number;
  remove?: boolean;
  removeTime?: number;
  removeUserId?: string;


}

