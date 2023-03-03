#!/usr/bin/env node
// 返回当前的高解析度毫秒时间戳，其中 0 表示当前的 node 进程的开始。
global._quick_start_time = performance.now()
console.log(process.argv)