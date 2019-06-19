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
    }
  }, opt)

  return {
    json (err, ctx) {
      const status = err.unsafeStatus || err.status || 500 // 支持自定义http状态
      ctx.status = status

      const bizErrorStatus = options.status.biz

      if (status === bizErrorStatus) {
        ctx.body = body.fail(err.code, err.message)
      } else {
        let stack
        let outStack = options.stack.out

        if (outStack === undefined || outStack === null) {
          const env = ctx.app.config.env
          outStack = env !== 'prod'
        }

        if (outStack) {
          stack = err.stack
        }

        ctx.body = body.error('Internal Server Error', stack)
      }
    }
  }
}
