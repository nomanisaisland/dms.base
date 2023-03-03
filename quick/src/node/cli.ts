/*
 * @Author: lujiafeng
 * @Email: 934789537@qq.com
 * @Date: 2023-03-03 18:28:51
 * @Description: 
 * @LastEditors: lujiafeng
 * @LastEditTime: 2023-03-03 18:29:28
 */
const cac = require('cac')

global._quick_start_time = performance.now()

const cli = cac("quick")

// options 可以抓取到命令行中的参数
cli.option('--type<type>', 'Choose a project type', {
  default: 'node',
})
  .option('--name<name>', 'Provide your name')

cli.command('[root]', 'start dev server')
  .alias('serve')
  .alias('start')
  .alias('dev')
  .action((files, options) => {
    console.log(files, options, 'start')
    if(files) {}
  })

cli.command('build [root]', 'build for production')
  .action((files, options) => {
    console.log(files, options, 'build')
  })

cli.version('0.0.0')

cli.help()

cli.parse();