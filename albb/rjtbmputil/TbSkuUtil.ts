import { ArrayUtil } from "../../value/ArrayUtil";

// https://open.taobao.com/api.htm?docId=30&docType=2&qq-pf-to=pcqq.c2c&scopeId=382
export interface TbSku {

  // sku的id
  sku_id: number;

  // sku所属商品id(注意：iid近期即将废弃，请用num_iid参数)
  iid: string;

  // sku所属商品数字id
  num_iid: number;

  // sku的销售属性组合字符串（颜色，大小，等等，可通过类目API获取某类目下的销售属性）,格式是p1:v1;p2:v2
  // 1243:1215;5626:5125
  properties: string;

  // 属于这个sku的商品的数量，
  quantity: string;

  // 属于这个sku的商品的价格 取值范围:0-100000000;精确到2位小数;单位:元。如:200.07，表示:200元7分。
  price: string;

  // sku创建日期 时间格式：yyyy-MM-dd HH:mm:ss
  // 2009-11-04 15:24:43
  created: string;

  // sku最后修改日期 时间格式：yyyy-MM-dd HH:mm:ss
  // 2009-11-04 15:24:43
  modified: string;

  // sku状态。 normal:正常 ；delete:删除,淘宝天猫此字段无效
  status: string;

  // sku所对应的销售属性的中文名字串，格式如：pid1:vid1:pid_name1:vid_name1;pid2:vid2:pid_name2:vid_name2……
  // 20000:3275069:品牌:盈讯;1753146:3485013:型号:F908;-1234:-5678:自定义属性1:属性值1
  properties_name: string;

  // 表示SKu上的产品规格信息
  // 123
  sku_spec_id: string;

  //商家设置的外部id。天猫和集市的卖家，需要登录才能获取到自己的商家编码，不能获取到他人的商家编码。
  outer_id: string;

  //商品级别的条形码
  barcode: string;




  //1627207:3232478:艾米伦内白胶-黑红款;1627207:28340:艾米伦内白胶-流沙米;1627207:3232482:艾米伦内白胶-黑橘款;1627207:3232479:艾米伦内白胶-纯黑款
  //property_alias

}


export class TbSkuUtil {

  static pvList = function (
    props: string,
  ): { pid: string; vid: string; }[] {
    return props.split(";").
      filter(skuProp => !!skuProp).
      map(skuProp => skuProp.split(":")).
      map(skuProp => ({ pid: skuProp[0], vid: skuProp[1], })).
      filter(skuProp => !!skuProp.pid);
  }

  static pvnList = function (
    propsName: string,
  ) {
    return propsName.split(";").
      filter(skuProp => !!skuProp).
      map(skuProp => skuProp.split(":")).
      map(skuProp => ({
        pid: skuProp[0],
        vid: skuProp[1],
        pidName: skuProp[2],
        vidName: skuProp[3],
      }));
  }

  static pvnaList = function (
    propsName: string,
    alias: string,
  ) {
    const pvnList = this.pvnList(propsName);
    const pvaList = alias.split(";").map(skuAlias => skuAlias.split(":")).map(skuAlias => ({
      pid: skuAlias[0],
      vid: skuAlias[1],
      aliasName: skuAlias[2],
    }));
    return pvnList.map(pvn => {
      const pvna = pvaList.find(pvna => pvna.pid === pvn.pid && pvna.vid === pvn.vid);
      return {
        ...pvn,
        ...pvna,
      };
    });
  }

  static propsMapFromPropsName<
    T extends Record<string, string> = Record<string, string>
  >(
    propsName: string,
    rename: T = {} as any,
  ): T {
    const idNameGroups = this.pvnList(propsName);
    const renameFrom = Object.entries(rename).reduce((pre, cur) => {
      return {
        ...pre,
        [cur[1]]: cur[0],
      };
    }, {} as Record<string, string>);
    const propsMap = idNameGroups.reduce((pre, cur) => {

      return {
        ...pre,
        [cur.pidName]: cur.vidName,
        [cur.pid]: cur.vid,
        ... !!renameFrom[cur.pidName] ? {
          [renameFrom[cur.pidName]]: cur.vidName,
        } : {},
        ... !!renameFrom[cur.pid] ? {
          [renameFrom[cur.pid]]: cur.vid,
        } : {},
      };
    }, {} as Record<string, string>);
    return propsMap as T;
  }

  static propsMapFromPropsNameAlias<
    T extends Record<string, string> = Record<string, string>,
    TAlias extends Record<string, string> = Record<string, string>
  >(
    propsName: string,
    rename: T = {} as any,
    alias: string,
    aliasRename: TAlias,
  ): T & TAlias {
    const skuAliasList = alias.split(";").map(skuAlias => skuAlias.split(":")).map(skuAlias => ({
      pid: skuAlias[0],
      vid: skuAlias[1],
      aliasName: skuAlias[2],
    }));
    const propsMap = this.propsMapFromPropsName(propsName, rename);
    const propsRename = Object.entries(aliasRename).reduce((pre, cur) => {
      const pidKey = cur[1];
      const vid = propsMap[pidKey];
      const pid = Object.keys(propsMap).find(k => propsMap[k] === vid && k !== pidKey);
      const skuAlias = skuAliasList.find(skuAlias => skuAlias.pid === pid && skuAlias.vid === vid);
      return {
        ...pre,
        [cur[0]]: skuAlias?.aliasName,
      };
    }, {} as TAlias);
    const propsMapAlias = {
      ...propsMap,
      ...propsRename,
    };
    return propsMapAlias;
  }



}