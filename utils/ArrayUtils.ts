/*
 * @Author: lujiafeng
 * @Date: 2022-07-28 12:43:27
 * @LastEditTime: 2022-07-28 14:14:00
 * @LastEditors: lujiafeng
 * @Description: 
 * @FilePath: \myWebsite\dms.base\utils\ArrayUtils.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */
type GroupList<T extends any> = {
  [key in keyof T]: []
}
export class ArrayUtils {

  /**
   * @param list 数组
   * @param type 需要分组的字段
   * @returns 分好组的对象
   */
  static groupBy<T, K extends keyof T>(list: T[], type: K) {
    let groupList: GroupList<T> | any = {}
    list.forEach(item => {
      const itemType = item[type]
      if (Reflect.ownKeys(groupList).indexOf(String(itemType))) {
        groupList[itemType] = [item]
      } else {
        groupList[itemType].push(item)
      }
    })
    return groupList
  }
}
