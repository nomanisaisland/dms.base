/**
 * @Author: lujiafeng
 * @Email: 934789537@qq.com
 * @Date: 2023-02-17 14:36:25
 * @Description: 
 * @LastEditors: lujiafeng
 * @LastEditTime: 2023-02-21 14:27:46
 */
const { config, getExt } = require('./config');
const Emperor = require("./lib/application")

const app = new Emperor()
app.use((...rest) => {
  console.log(rest)
})
app.listen(config.port, config.host, async () => {
  const localHostUrl = `http://localhost:${8080}`
  const netWorkUrl = `http://${config.host}:${8080}`
  console.log('\n')
  console.log(`localhost: \x1B[34m${localHostUrl}\x1B[0m`)
  console.log(`netWork  :\x1B[34m ${netWorkUrl}\x1B[0m\n`)
  // open(localHostUrl)
  // 监听文件修改
})