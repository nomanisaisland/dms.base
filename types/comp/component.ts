/*
 * @Author: lujiafeng
 * @Date: 2022-07-21 00:20:57
 * @LastEditTime: 2022-07-21 15:31:50
 * @LastEditors: lujiafeng
 * @Description: 
 * @FilePath: \myWebsite\base\types\comp\component.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */

// 先支持image标签，然后再支持别的
import { CompImage } from "./Image"
export interface CompStructRoot {
  // 标签名
  tag: string;
  child?: CompStructRoot; // 子组件
  sibling?: CompStructRoot; // 第一个兄弟组件
  attrs?: CompImage
}