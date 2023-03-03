#!/usr/bin/env node
// 返回当前的高解析度毫秒时间戳，其中 0 表示当前的 node 进程的开始。
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
