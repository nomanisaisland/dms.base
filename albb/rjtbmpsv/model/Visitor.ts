/**
 * 访客，用户在每个小程序中都会产生一条该记录
 */
export class Visitor {

  shopId?: string;

  userId?: string;

  miniappId?: string;

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

  addTime?: number;
  addUserId?: string;
  editTime?: number;
  editUserId?: number;
  remove?: boolean;
  removeTime?: number;
  removeUserId?: string;

}

