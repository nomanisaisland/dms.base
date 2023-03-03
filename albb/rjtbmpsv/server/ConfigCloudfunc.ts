import { RouteEnvConfig } from "../../../pack/RouteEnvConfig";
import { migrateApply } from "../data/migrateApply";

/**
 * 配置信息，应由具体应用在运行时填入。
 */
export const ConfigCloudfunc = RouteEnvConfig;

/**
 * 导出处理程序，包装注入切面。异常处理包装，自动数据迁移。
 */
export function exportsHandlers(toExports, fromExports) {

  const fnKeys = Object.keys(fromExports).
    filter(k => typeof fromExports[k] == "function");

  for (const fnKey of fnKeys) {
    if (!!toExports[fnKey]) {
      console.error(`云函数处理程序导出重名。 ${fnKey}`);
    }
    const fn = fromExports[fnKey];
    const wrapFn = async function (...args) {

      try {
        try {
          await (migrateApply as any)(...args);
        } catch (error) {
          console.error(error);
        }
        const result = await fn.call(this, ...args);


        //额外补充上函数调用信息
        if (typeof result == "object" && !!result) {
          Object.assign(result, {
            cloudfuncsHandler: fnKey,
          });
        }
        return result;
      } catch (error) {
        console.error(error);
        const errorMessage = String(error?.errorMessage ?? error?.message ?? error);
        return {
          cloudfuncsHandler: fnKey,
          error: errorMessage,
          errorMessage: errorMessage,
        };
      }
    };
    toExports[fnKey] = wrapFn;
  }
  return toExports;
}


export const inputToOutput = async (context) => {
  const {
    appkey,
    sourceAppKey,
    userNick,
    mixNick,
    miniappId,
    sourceMiniAppId,
    accessToken,
    openId,
    appOwnerOpenId,
    env,
    traceId,
    handler,
    data,
  } = context;
  return {
    appkey,
    sourceAppKey,
    userNick,
    mixNick,
    miniappId,
    sourceMiniAppId,
    accessToken,
    openId,
    appOwnerOpenId,
    env,
    traceId,
    handler,
    data,
  };
};


export const mainExports = {

  /**
   * 游客身份信息测试
   */
  guestTest: inputToOutput,

  /**
   * main 连通测试
   */
  main: inputToOutput,

};



/*

https://miniapp.open.taobao.com/doc.htm?docId=118990&docType=1&tag=dev

appkey	string	
  运行时使用的appkey，

  1,如果是BC模式，那么这里是B端appkey;

  2,如果是模板开发模式，这里是模板的appkey;

  3,如果是插件开发模式，这里是宿主小程序的appkey;


sourceAppKey

  string	
  当前调用小程序的appkey

  1,如果是BC模式，那么这里是C端appkey;

  2,如果是模板开发模式，这里是实例的appkey;

  3,如果是插件开发模式，这里是插件的appkey;




userNick

  string	
  当前用户的昵称。

  若在小程序中未调用授权API，则无此字段




mixNick	string	
  当前用户的mixNick




miniappId

  string	
  运行时使用的小程序ID，

  1,如果是BC模式，那么这里是B端小程序ID;

  2,如果是模板开发模式，这里是模板的小程序ID;

  3,如果是插件开发模式，这里是宿主小程序的小程序ID;




sourceMiniAppId	string	
  当前调用小程序的小程序ID

  1,如果是BC模式，那么这里是C端小程序ID;

  2,如果是模板开发模式，这里是实例的小程序ID;

  3,如果是插件开发模式，这里是插件的小程序ID;




accessToken

  string	
  当前用户授权产生的sessionKey, 主要用于调用TOP-API。

  若在小程序中未调用授权API，则无此字段




openId

  string	
  当前使用用户的openId




env	string	
  当前云函数环境




traceId	string	
  云函数调用唯一ID




fcName	string	
  当前被调用的云函数名称




handler

  string	
  当前被调用的云函数中的Handler




appOwnerOpenId

  string	
  当前小程序的拥有者的openId，用于BC打通。

  对于BC打通场景，在B端，openId是当前登录用户ID，由于是商家使用B端，这里openId即为商家ID；

  在C端，小程序拥有者为商家，appOwnerOpenId即为商家Id ;




data

  JSON

  函数的业务参数


 * 
 */