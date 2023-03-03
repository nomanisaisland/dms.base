/*
 * @Author: lujiafeng
 * @Date: 2022-07-28 16:01:21
 * @LastEditTime: 2022-07-28 16:22:13
 * @LastEditors: lujiafeng
 * @Description: 
 * @FilePath: \myWebsite\dms.base\utils\Performance.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */

export class DmsPerform {
  /**
   * @description 节流（隔一段时间去执行一次代码,没到时间则不执行,并且第一次是直接执行的）
   * @param fn 
   * @param timer 
   */
  static throttle(fn: () => {}, time: number = 500) {
    let timer = null
    return function (rest) {
      if (timer) return
      timer = setTimeout(() => {
        fn.call(this, rest)
        timer = null
      }, time)
    }
  }
}