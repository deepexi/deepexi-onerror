const _ = require('lodash')
const body = require('deepexi-body')

module.exports = opt => {
  if (!opt) {
    opt = {}
  }
  const options = _.merge({
    stack: {},
    status: {
      biz: 406
    },
    builder: {
      body (success, msg, stack) {
        return body.error(msg, stack)
      }
    }
  }, opt)

  return {
    json (err, ctx) {
      const success = false
      let msg
      let stack

      const status = err.unsafeStatus || err.status || 500 // 支持自定义http状态

      const bizErrorStatus = options.status.biz

      if (err.status === bizErrorStatus) {
        msg = err.message
      } else {
        msg = 'Internal Server Error'
      }

      let outStack = options.stack.out

      if (outStack === undefined || outStack === null) {
        const env = ctx.app.config.env
        outStack = env !== 'prod'
      }

      if (outStack) {
        stack = err.stack
      }

      ctx.status = status
      ctx.body = options.builder.body(success, msg, stack)
    }
  }
}
