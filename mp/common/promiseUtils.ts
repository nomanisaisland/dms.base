/*
 * @Author: lujiafeng
 * @Date: 2022-09-22 12:19:41
 * @LastEditTime: 2022-09-22 12:26:02
 * @LastEditors: lujiafeng
 * @Description: 
 * @FilePath: \myWebsite\dms.base\mp\common\promiseUtils.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */
class AwaitUntilComeBack {
  page = null
  register(page): void {
    this.page = page
    page.awaitShow = () => { }
  }
  lister(): void {
    this.page.awaitShow()
  }
  async awaitFunc(fn: () => {}): Promise<boolean> {
    const awaitResult: boolean = await new Promise((resolve, reject) => {
      this.page.awaitShow = () => {
        this.page.awaitShow = () => { }
        resolve(true)
      }
    })
    fn()
    return awaitResult
  }
  static instance: AwaitUntilComeBack = new AwaitUntilComeBack()
}

module.exports = {
  awaitUntilComeBack: AwaitUntilComeBack.instance
}
