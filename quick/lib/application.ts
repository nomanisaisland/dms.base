const http = require("http");
const fs = require('fs');
const open = require('../utils/open');
const path = require('path');
const url = require('url');
const { debounce } = require('../utils/debounce');
const onFinished = require('on-finished')


const { compose, respond } = require('../package/compose')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Emperor {
  constructor(options) {
    options = options || {}
    this.compose = options.compose || compose
    this.context = Object.create(context)
    this.request = Object.create(request)
    this.response = Object.create(response)
  }
  middleware = []
  use (fn) {
    this.middleware.push(fn)
    return this
  }
  handleRequest (ctx, fnMiddleware) {
    const res = ctx.res
    res.statusCode = 404
    const onerror = err => ctx.onerror(err)
    const handleResponse = () => respond(ctx)
    onFinished(res, onerror)
    return fnMiddleware(ctx).then(handleResponse).catch(onerror)
  }
  createContext (req,res) {
    /** @type {Context} */
    const context = Object.create(this.context)
    /** @type {KoaRequest} */
    const request = context.request = Object.create(this.request)
    /** @type {KoaResponse} */
    const response = context.response = Object.create(this.response)
    context.app = request.app = response.app = this
    context.req = request.req = response.req = req
    context.res = request.res = response.res = res
    request.ctx = response.ctx = context
    request.response = response
    response.request = request
    context.originalUrl = request.originalUrl = req.url
    context.state = {}
    return context
  }
  callback () {
    const fn = this.compose(this.middleware)
    const handleRequest = (req, res) => {
      const ctx = this.createContext(req,res)
      return this.handleRequest(ctx, fn)
    }
    return handleRequest
  }
  listen (...args) {
    const server = http.createServer(this.callback())
    return server.listen(...args)
  }
}

module.exports = Emperor