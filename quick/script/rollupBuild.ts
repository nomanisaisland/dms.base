/**
 * @Author: lujiafeng
 * @Email: 934789537@qq.com
 * @Date: 2023-02-24 15:40:27
 * @Description: 
 * @LastEditors: lujiafeng
 * @LastEditTime: 2023-02-25 11:27:58
 */
import { rollup } from 'rollup'

const inputOptions = {
  input: '../../demo/main.ts',
  output: {
    file: 'bundle.js',
    format: 'cjs'
  }
}

const outputOptionsList = [{}, {}];

build();

async function build() {
  let bundle;
  let buildFailed = false;

  try {
    
  }
}
