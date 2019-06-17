const onerror = require('../index')
const assert = require('assert')

/* eslint-disable no-undef */
describe('json()', () => {
  function mockCtx (env) {
    return {
      app: {
        config: {
          env: env || 'prod'
        }
      }
    }
  }

  it('should no error happen', () => {
    const config = onerror()
    assert(config)
  })

  it('should success false', () => {
    const ctx = mockCtx()
    onerror().json(new Error(), ctx)
    assert(ctx.body.success === false)
  })

  describe('stack', () => {
    it('should have stack on none prod by default', () => {
      envs = ['local', 'dev', 'qa', 'non-prod']

      envs.forEach(env => {
        const ctx = mockCtx(env)
        onerror().json(new Error(), ctx)
        assert(ctx.body.stack)
      })
    })

    it('should have not stack on prod by default', () => {
      const ctx = mockCtx('prod')
      onerror().json(new Error(), ctx)
      assert(ctx.body.stack === undefined)
    })

    it('should have stack if configed even on prod', () => {
      const ctx = mockCtx('prod')
      onerror({
        stack: {
          out: true
        }
      }).json(new Error(), ctx)
      assert(ctx.body.stack)
    })

    it('should have not stack if configed even on non-prod', () => {
      envs = ['local', 'dev', 'qa', 'none-prod']

      envs.forEach(env => {
        const ctx = mockCtx(env)
        onerror({
          stack: {
            out: false
          }
        }).json(new Error(), ctx)
        assert(ctx.body.stack === undefined)
      })
    })
  })

  describe('status', () => {
    it('should display status 500 by default', () => {
      const ctx = mockCtx()
      onerror().json(new Error(), ctx)
      assert(ctx.status === 500)
    })

    it('should display spec status when error.status is defined', () => {
      const ctx = mockCtx()
      const err400 = new Error()
      err400.status = 400
      onerror().json(err400, ctx)
      assert(ctx.status === 400)
    })

    it('should display spec status when error.unsafeStatus is defined', () => {
      const ctx = mockCtx()
      const err430 = new Error()
      err430.unsafeStatus = 430
      onerror().json(err430, ctx)
      assert(ctx.status === 430)
    })

    it('should display unsafe status when both error.unsafeStatus and error.status are defined', () => {
      const ctx = mockCtx()
      const err430 = new Error()
      err430.unsafeStatus = 430
      err430.status = 406
      onerror().json(err430, ctx)
      assert(ctx.status === 430)
    })

    it('should display \'Internal Server Error\' on non-bizerror', () => {
      const ctx = mockCtx()
      onerror().json(new Error(), ctx)
      assert(ctx.body.message === 'Internal Server Error')
    })

    it('should display error message on bizerror', () => {
      const ctx = mockCtx()
      const bizerror = new Error('biz error')
      bizerror.status = 406
      onerror().json(bizerror, ctx)
      assert(ctx.body.message === 'biz error')
    })

    it('should display error message on custom bizerror status', () => {
      const ctx = mockCtx()
      const bizerror = new Error('biz error')
      bizerror.status = 430
      onerror({
        status: {
          biz: 430
        }
      }).json(bizerror, ctx)
      assert(ctx.body.message === 'biz error')
    })
  })
})
