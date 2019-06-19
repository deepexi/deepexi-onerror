const _ = require('lodash')
const body = require('deepexi-body')

module.exports = opt => {
  if (!opt) {
    opt = {}
  }
  const options = _.merge({
    stack: {},
    status: {
      fail: [ 400, 401, 406 ],
      error: {
        '500': 'Internal Server Error'
      }
    }
  }, opt)

  function isFail (status) {
    if (options.status.fail instanceof Array) {
      return options.status.fail.filter(s => {
        return s === status
      }).length > 0
    } else if (options.status.fail instanceof RegExp) {
      return options.status.fail.test(status + '')
    } else if (options.status.fail instanceof Function) {
      return options.status.fail(status)
    } else {
      // eslint-disable-next-line eqeqeq
      return options.status.fail == status
    }
  }

  function isOutStack (env) {
    let out = options.stack.out
    if (out === undefined || out === null) {
      // get default val if unseted
      out = env !== 'prod'
    }
    return out
  }

  return {
    json (err, ctx) {
      const status = err.unsafeStatus || err.status || 500 // 支持自定义http状态
      ctx.status = status

      if (isFail(status)) {
        ctx.body = body.fail(err.code, err.message)
      } else {
        let stack = isOutStack(ctx.app.config.env) ? err.stack : undefined
        const msg = options.status.error[status] || options.status.error['500']
        ctx.body = body.error(msg, stack)
      }
    }
  }
}
