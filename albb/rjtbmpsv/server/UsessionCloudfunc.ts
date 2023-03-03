import { RandomUtil } from "../../../value/RandomUtil";
import { RouteEnvConfig } from "../../../pack/RouteEnvConfig";
import { UsessionUnion } from "../model/UsessionUnion";
/**
 * 获取会话信息，包含 店铺，用户，小程序，访客。
 * 支持这些客户端请求 C端小程序实例，B端小程序，C端小部件实例。
 */
export async function usessionDetailTb(
  context,
): Promise<UsessionUnion | { input?: any; error?: any; }> {

  const cloud = context.cloud;
  let {
    appOwnerOpenId,
    openId,
    miniappId,
    sourceMiniAppId,
    mixNick,
    userNick,
    accessToken,
  } = context;

  try {

    //从配置的模板数据获取请求类型
    const template = RouteEnvConfig.miniappTemplateList?.
      find(a => a.tbTemplateId == miniappId);
    const runatType = template?.runatType || 'other';

    //处理合并请求的数据
    const callData = context.data;
    //客户端传输来的用户名
    const tbNickName = callData.tbNickName || userNick;
    //头像
    const tbAvatar = callData.tbAvatar;

    //商家主站账号用户名
    let shopTbNickName = undefined;
    if (runatType == 'qn') {
      shopTbNickName = tbNickName?.split(":")[0];
    }

    //店铺数据 懒加载
    let tbShopGet = async () => undefined;
    if (runatType == 'qn' && !!RouteEnvConfig.bizTbShopFetch) {
      tbShopGet = async () => {
        try {
          const tbModel = await cloud.topApi.invoke({
            api: 'taobao.shop.seller.get',
            data: {
              fields: 'sid,title,pic_path'
            },
            autoSession: true,
          });
          tbShopGet = async () => tbModel;
          return tbModel;
        } catch (error) {
          const errorMessage = String(
            error?.errorMessage || error?.message || error || "error"
          )
          const errorModel = {
            errorMessage,
          };
          tbShopGet = async () => errorModel;
        }
      };
      if (RouteEnvConfig.bizTbShopFetch != true) {
        tbShopGet = async () => String(RouteEnvConfig.bizTbShopFetch);
      }
    }

    //店铺数据 懒加载
    let tbSellerGet = async () => undefined;
    if (runatType == 'qn' && !!RouteEnvConfig.bizTbSellerFetch) {
      tbSellerGet = async () => {
        try {
          const tbModel = await cloud.topApi.invoke({
            api: 'taobao.user.seller.get',
            data: {
              // fields: 'user_id,nick,sex,seller_credit,type,has_more_pic,item_img_num,item_img_size,prop_img_num,prop_img_size,auto_repost,promoted_type,status,alipay_bind,consumer_protection,avatar,liangpin,sign_food_seller_promise,has_shop,is_lightning_consignment,has_sub_stock,is_golden_seller,magazine_subscribe,vertical_market,online_gaming,is_tjb_seller,vip_info'
              fields: 'user_id,nick,sex',
            },
            autoSession: true,
          });
          tbSellerGet = async () => tbModel;
          return tbModel;
        } catch (error) {
          const errorMessage = String(
            error?.errorMessage || error?.message || error || "error"
          )
          const errorModel = {
            errorMessage,
          };
          tbSellerGet = async () => errorModel;
        }
      };
      if (RouteEnvConfig.bizTbSellerFetch != true) {
        tbShopGet = async () => String(RouteEnvConfig.bizTbSellerFetch);
      }
    }

    //获取来源对应的端实例
    let miniapp = (await cloud.db.collection('miniapp').find({
      tbAppId: sourceMiniAppId,
    }))[0];

    //查询对应的店铺
    let shop = !!miniapp?.shopId ?
      (await cloud.db.collection('shop').find({
        id: miniapp?.shopId || "bad",
      }))[0] :
      undefined;

    //店铺信息在下方任意一个字段匹配时可用
    if (!shop) {

      //用户未从客户端授权访问用户信息，尝试直接抓取topapi
      if (!shopTbNickName && runatType == 'qn') {
        const tbSeller = await tbSellerGet();
        if (!!tbSeller?.user?.nick) {
          shopTbNickName = String(tbSeller.user.nick).split(':')[0];
        }
      }

      //从主账号查询店铺
      if (!shop && !!shopTbNickName) {
        shop = (await cloud.db.collection('shop').find({
          tbNickName: shopTbNickName,
        }))[0];
      }

      //从店铺查询店铺
      if (!shop) {
        const tbShop = await tbShopGet();
        if (!!tbShop?.shop?.sid) {
          shop = (await cloud.db.collection('shop').find({
            tbShopId: String(tbShop.shop.sid),
          }))[0];
        }
      }

      //从卖家查询
      if (!shop) {
        const tbSeller = await tbSellerGet();
        if (!!tbSeller?.user?.user_id) {
          shop = (await cloud.db.collection('shop').find({
            tbSellerId: String(tbSeller.user.user_id),
          }))[0];
        }
      }

      //卖家nick
      if (!shop) {
        const tbSeller = await tbSellerGet();
        if (!!tbSeller?.user?.nick) {
          shop = (await cloud.db.collection('shop').find({
            tbSellerNick: String(tbSeller.user.nick),
          }))[0];
        }
      }

      //从所有者openId查询店铺
      if (!shop && !!appOwnerOpenId) {
        shop = (await cloud.db.collection('shop').find({
          tbAppOwnerOpenId: appOwnerOpenId,
        }))[0];
      }

    }

    //初始化店铺数据
    if (!shop) {

      const tbShop = await tbShopGet();
      const tbSeller = await tbSellerGet();
      const newid = RandomUtil.guidStringN();

      shop = {
        _id: newid,
        id: newid,

        //主帐号
        tbNickName: shopTbNickName,
        tbMixNick: shopTbNickName == tbNickName ? mixNick : undefined,

        //从店铺
        tbShopId: tbShop?.shop?.sid?.toString(),
        tbTitle: tbShop?.shop?.title,
        tbPic: tbShop?.shop?.pic_path,
        tbShopErrorMessage: tbShop?.errorMessage,

        //从卖家
        tbSellerId: tbSeller?.user?.user_id?.toString(),
        tbSellerNick: tbSeller?.user?.nick,

        //所有者OpenId
        tbAppOwnerOpenId: appOwnerOpenId,

        //记录
        addTbNickName: tbNickName,
        addTbMixNick: mixNick,
        addTime: Date.now(),
        addUserTbOpenId: openId,
      };

      if (
        !shop.tbNickName &&
        !shop.tbShopId &&
        !shop.tbSellerId &&
        !shop.tbSellerNick &&
        !shop.tbAppOwnerOpenId
      ) {
        throw new Error('初始化店铺至少需要提供一个【重要标识】。');
      }
      await cloud.db.collection("shop").insertOne(shop);
    }


    //更新补充店铺数据
    if (!!shop.id) {

      //tbNickName
      if (!shop.tbNickName && !!shopTbNickName) {
        shop.tbNickName = shopTbNickName;
        await cloud.db.collection("shop").updateMany({
          id: shop.id,
        }, {
          $set: {
            tbNickName: shop.tbNickName,
          },
        });
      }

      //tbShopId
      if (!shop.tbShopId) {
        const tbShop = await tbShopGet();
        if (!!tbShop?.shop?.sid) {
          shop.tbShopId = String(tbShop.shop.sid);
          shop.tbTitle = tbShop.shop.title;
          shop.tbPic = tbShop.shop.pic_path;
          shop.tbShopErrorMessage = '';
          await cloud.db.collection("shop").updateMany({
            id: shop.id,
          }, {
            $set: {
              tbShopId: shop.tbShopId,
              tbTitle: shop.tbTitle,
              tbPic: shop.tbPic,
              tbShopErrorMessage: shop.tbShopErrorMessage,
            },
          });
        }
      }

      //tbSellerId
      if (!shop.tbSellerId) {
        const tbSeller = await tbSellerGet();
        if (!!tbSeller?.user?.user_id) {
          shop.tbSellerId = String(tbSeller.user.user_id);
          shop.tbSellerNick = String(tbSeller.user.nick);
          await cloud.db.collection("shop").updateMany({
            id: shop.id,
          }, {
            $set: {
              tbSellerId: shop.tbSellerId,
              tbSellerNick: shop.tbSellerNick,
            },
          });
        }
      }

      //tbAppOwnerOpenId
      if (!shop.tbAppOwnerOpenId && !!appOwnerOpenId) {
        shop.tbAppOwnerOpenId = appOwnerOpenId;
        await cloud.db.collection("shop").updateMany({
          id: shop.id,
        }, {
          $set: {
            tbAppOwnerOpenId: shop.tbAppOwnerOpenId,
          },
        });
      }

    }

    //查询或者生成对应的用户数据
    let user = (await cloud.db.collection('user').find({
      shopId: shop.id,
      tbOpenId: openId,
    }))[0];
    if (!user) {
      const newid = openId + "__" + shop.id;
      //const newid = RandomUtil.guidStringN();
      user = {
        _id: newid,
        id: newid,
        shopId: shop.id,
        tbOpenId: openId,
        tbNickName: tbNickName,
        tbMixNick: mixNick,
        addTime: Date.now(),
      };
      await cloud.db.collection("user").insertOne(user);
    }
    //更新用户数据
    if (
      !!tbNickName && tbNickName !== user.tbNickName ||
      !!tbAvatar && tbAvatar !== user.tbAvatar ||
      runatType == 'miniapp' && !!accessToken && accessToken !== user.tbAccessToken ||
      runatType == 'qn' && !!accessToken && accessToken !== user.tbBizAccessToken
    ) {
      if (!!tbNickName) {
        user.tbNickName = tbNickName;
        user.tbNickNameTime = Date.now();
      }
      if (!!tbAvatar) {
        user.tbAvatar = tbAvatar;
        user.tbAvatarTime = Date.now();
      }
      if (runatType == 'miniapp' && !!accessToken) {
        user.tbAccessToken = accessToken;
        user.tbAccessTokenTime = Date.now();
      }
      if (runatType == 'qn' && !!accessToken) {
        user.tbBizAccessToken = accessToken;
        user.tbBizAccessTokenTime = Date.now();
      }
      await cloud.db.collection("user").updateMany({
        id: user.id,
      }, {
        $set: {
          tbNickName: user.tbNickName,
          tbNickNameTime: user.tbNickNameTime,
          tbAvatar: user.tbAvatar,
          tbAvatarTime: user.tbAvatarTime,
          tbAccessToken: user.tbAccessToken,
          tbAccessTokenTime: user.tbAccessTokenTime,
          tbBizAccessToken: user.tbBizAccessToken,
          tbBizAccessTokenTime: user.tbBizAccessTokenTime,
        },
      });
    }

    //创建实例的操作必须在B端或者官方给定的实例化入口完成，创建的小程序带有类型信息
    if (!miniapp) {
      const newid = sourceMiniAppId;
      //const newid = RandomUtil.guidStringN();
      miniapp = {
        _id: newid,
        id: newid,
        shopId: shop.id,
        tbAppId: sourceMiniAppId,
        runatType: runatType,
        templateId: miniappId,
        tbTemplateId: miniappId,
        addTime: Date.now(),
      };
      await cloud.db.collection("miniapp").insertOne(miniapp);
    }

    //更新补充miniapp数据
    if (!!miniapp.id) {

      //runatType
      if (!miniapp.runatType || miniapp.runatType != runatType) {
        miniapp.runatType = runatType;

        await cloud.db.collection("miniapp").updateMany({
          id: miniapp.id,
        }, {
          $set: {
            runatType: miniapp.runatType,
          },
        });
      }
    }

    //访问者
    let visitor = (await cloud.db.collection("visitor").find({
      shopId: shop.id,
      userId: user.id,
      miniappId: miniapp.id,
    }))[0];
    if (!visitor) {
      const newid = openId + "__" + sourceMiniAppId;
      //const newid = RandomUtil.guidStringN();
      visitor = {
        _id: newid,
        id: newid,
        shopId: shop.id,
        userId: user.id,
        miniappId: miniapp.id,
        tbOpenId: openId,
        tbNickName: tbNickName,
        tbMixNick: mixNick,
        addTime: Date.now(),
      };
      await cloud.db.collection("visitor").insertOne(visitor);
    }
    //请求传来的字段更新到数据库
    if (
      !!tbNickName && tbNickName !== visitor.tbNickName ||
      !!tbAvatar && tbAvatar !== visitor.tbAvatar ||
      runatType == 'miniapp' && !!accessToken && accessToken !== visitor.tbAccessToken ||
      runatType == 'qn' && !!accessToken && accessToken !== visitor.tbBizAccessToken
    ) {
      if (!!tbNickName) {
        visitor.tbNickName = tbNickName;
        visitor.tbNickNameTime = Date.now();
      }
      if (!!tbAvatar) {
        visitor.tbAvatar = tbAvatar;
        visitor.tbAvatarTime = Date.now();
      }
      if (runatType == 'miniapp' && !!accessToken) {
        visitor.tbAccessToken = accessToken;
        visitor.tbAccessTokenTime = Date.now();
      }
      if (runatType == 'qn' && !!accessToken) {
        visitor.tbBizAccessToken = accessToken;
        visitor.tbBizAccessTokenTime = Date.now();
      }
      await cloud.db.collection("visitor").updateMany({
        id: visitor.id,
      }, {
        $set: {
          tbNickName: visitor.tbNickName,
          tbNickNameTime: visitor.tbNickNameTime,
          tbAvatar: visitor.tbAvatar,
          tbAvatarTime: visitor.tbAvatarTime,
          tbAccessToken: visitor.tbAccessToken,
          tbAccessTokenTime: visitor.tbAccessTokenTime,
          tbBizAccessToken: visitor.tbBizAccessToken,
          tbBizAccessTokenTime: visitor.tbBizAccessTokenTime,
        },
      });
    }

    //输出复合结构
    const output: UsessionUnion = {
      shop,
      user,
      miniapp,
      visitor,
      ...{
        input: {
          appOwnerOpenId,
          openId,
          miniappId,
          sourceMiniAppId,
          mixNick,
          userNick,
          accessToken,
          env: context.env,
          data: callData,
        },
      },
    };
    return output;
  } catch (error) {
    return {
      error: {
        errorToString: String(error || "error"),
        errorMessage: String(error?.errorMessage || error?.message || error || "error"),
        ...error,
      },
      input: {
        appOwnerOpenId,
        openId,
        miniappId,
        sourceMiniAppId,
        mixNick,
        userNick,
        accessToken,
        env: context.env,
        data: context.data,
      },
    };
  }
};

