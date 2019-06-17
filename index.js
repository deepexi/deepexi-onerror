const _ = require('lodash')

module.exports = opt => {
  if (!opt) {
    opt = {}
  }

  return {
    json (err, ctx) {
      const options = _.merge({
        stack: {},
        status: {
          biz: 406
        }
      }, opt)

      const body = { success: false }

      const status = err.unsafeStatus || err.status || 500 // 支持自定义http状态

      const bizErrorStatus = options.status.biz

      if (err.status === bizErrorStatus) {
        body.message = err.message
      } else {
        body.message = 'Internal Server Error'
      }

      let outStack = options.stack.out

      if (outStack === undefined || outStack === null) {
        const env = ctx.app.config.env
        outStack = env !== 'prod'
      }

      if (outStack) {
        body.stack = err.stack
      }

      ctx.status = status
      ctx.body = body
    }
  }
}
