export enum PLATFORM {
  WEB = 0,
  WX = 1,
  TB = 2
}

interface FetchConfig {
  /** 请求方法 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';

  /**
   * @description 缓存模式
   * 
   * no-cors
   * 保证请求对应的 method 只有 HEAD，GET 或 POST 方法，并且请求的 headers 只能有简单请求头
   * 
   * same-origin
   * 必须同源
   * 
   * cors
   * 允许跨域请求
   * 
   * cors-with-forced-preflight
   * 
   * navigate
   * 表示这是一个浏览器的页面切换请求
   */
  mode: RequestMode


  /**
   * default
   * 浏览器从 HTTP 缓存中寻找匹配的请求
   * 
   * no-store
   * 浏览器直接从远程服务器获取资源，不查看缓存，并且不会使用下载的资源更新缓存。
   * 
   * reload
   * 浏览器直接从远程服务器获取资源，不查看缓存，然后使用下载的资源更新缓存。
   * 
   * no-cache
   * 浏览器在其 HTTP 缓存中寻找匹配的请求。
   * 
   * only-if-cached
   * 浏览器在其 HTTP 缓存中寻找匹配的请求。
   */
  cache: RequestCache

  /**
   * credentials 是Request接口的只读属性，用于表示用户代理是否应该在跨域请求的情况下从其他域发送 cookies。这与 XHR 的 withCredentials 标志相似，不同的是有三个可选值（后者是两个）：
   * 
   * omit
   * 从不发送 cookies
   * 
   * same-origin
   * 只有当 URL 与响应脚本同源才发送 cookies、HTTP Basic authentication 等验证信息.
   * 
   * include
   * 不论是不是跨域的请求，总是发送请求资源域在本地的 cookies、HTTP Basic authentication 等验证信息。
   */
  credentials: RequestCredentials

  /**
   * 操作请求头
   */
  headers: Headers

  /**
   * 描述如何处理重定向的模式
   */
  redirect: RequestRedirect

  /**
   * referrer策略控制referrer标头中发送的referrer信息应包含在请求中。
   * no-referrer
   * 
   * no-referrer-when-downgrade
   * 
   * origin
   * 
   * origin-when-cross-origin
   * 
   * same-origin
   * 
   * strict-origin
   * 
   * strict-origin-when-cross-origin
   * 
   * unsafe-url
   */
  referrerPolicy: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'

  /**
   * 请求体
   */
  body?: string

  /**
   * 指定一个AbortController实例，用于取消fetch请求
   */
  signal: AbortSignal
}

type HttpConfig = Partial<FetchConfig> & {
  /**
   * 配置的基础链接
   */
  url: string;

  param?: Object;

  /**
   * 终止请求方法
   */
  abort?: (reason?: any)=> void;
}
export class HttpRequest {
  static resolve () {
    return new HttpRequest()
  }
  /**
   * 全局接口中止控制器
   */
  private abortController = new AbortController()
  constructor(baseUrl?: string) {
    if(baseUrl) {
      this.baseUrl = baseUrl
    }
  }
  get baseUrl() {
    return null
  }
  set baseUrl(url: string) {
    this.baseUrl = url
  }
  get header() {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return headers
  }
  set header(config: Headers) {
    this.header = config
  }
  async request(httpConfig: HttpConfig) {

    let url = this.baseUrl + httpConfig.url

    let config: FetchConfig = {
      method: httpConfig.method,
      mode: httpConfig.mode || 'cors',
      cache: httpConfig.cache || 'no-cache',
      credentials: httpConfig.credentials || 'same-origin',
      headers: httpConfig.headers || this.header,
      redirect: httpConfig.redirect || 'follow',
      referrerPolicy: httpConfig.referrerPolicy || 'no-referrer',
      signal: httpConfig.signal || this.abortController.signal
    }

    switch (httpConfig.method) {
      case 'GET':
        url = this.handleGetParam(url,httpConfig.param)
        break;
      case 'PUT':
        break;
      case 'POST':
        if (httpConfig.body) {
          config.body = httpConfig.body
        }
        break;
      case 'DELETE':
        break;
      default:
        break;
    }
    return [await new Promise((resolve,reject)=> {
      fetch(url, config).then((res)=> {
        resolve(res.json())
      }).catch(err=>{
        reject(err)
      })
    }),httpConfig.abort || this.abortController.abort]
  }
  private handleGetParam<T extends Object>(url: string,param: T): string {
    if(!param || Reflect.ownKeys(param).length === 0) return url;
    url = url + '?'
    for(let key in param) {
      url += `&${key}=${param[key]}`
    }
    return url
  }
}