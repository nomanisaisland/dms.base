/**
 * @Author: lujiafeng0
 * @Date: 2022-07-15 00:54:54
 * @LastEditTime: 2022-07-20 18:08:00
 * @LastEditors: lujiafeng
 * @Description: 
 * @FilePath: \myWebsite\base\tools\ttf2towoff2.js
 * @可以输入预定的版权声明、个性签名、空行等
 */
var fs = require('fs');
var ttf2woff2 = require('ttf2woff2');

var input = fs.readFileSync('./tools/汉仪新蒂涂鸦体.ttf');
console.log(input)
const aaa = fs.writeFileSync('./tools/汉仪新蒂涂鸦体.woff2', ttf2woff2(input));