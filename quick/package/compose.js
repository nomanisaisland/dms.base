/**
 * @Author: lujiafeng
 * @Email: 934789537@qq.com
 * @Date: 2023-02-20 16:24:30
 * @Description: 
 * @LastEditors: lujiafeng
 * @LastEditTime: 2023-02-20 17:05:37
 */
'use strick'
exports.compose = (middleware) => {
  if(!Array.isArray(middleware)) throw Error("middleware must be an Array");
  for(let i=0;i<middleware.length;i++){
    const fn = middleware[i]
    if(typeof fn !== 'function') throw Error("middleware must be composed of functions")
  }
  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

exports.respond = () => {
}