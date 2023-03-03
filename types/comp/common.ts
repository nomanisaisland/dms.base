/*
 * @Author: lujiafeng
 * @Date: 2022-07-21 01:26:00
 * @LastEditTime: 2022-07-22 17:57:15
 * @LastEditors: lujiafeng
 * @Description: 
 * @FilePath: \myWebsite\base\types\comp\common.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */
import { CompImage } from "./Image"
export interface CompStyle extends CompAttrWH {
  backgroundColor?: string;
}


export interface CompAttr {
  style?: CompStyle;
  class?: string; // 代码模式
}

/**
 * @description 描述组件属性可以参考fiber数据结构，把所有节点都数据化，最后拼接出来
 */
export interface CompRootBase {
  attrs: CompAttr & CompImage;
  inlineEle: boolean; // 是否是行内标签
  replacedEle: boolean; // 是否是替换元素
}

export interface CompAttrWH {
  width?: number;
  height?: number;
}
