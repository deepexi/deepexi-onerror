# deepexi-onerror

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![Build Status](https://www.travis-ci.org/deepexi/deepexi-onerror.svg?branch=master)](https://www.travis-ci.org/deepexi/deepexi-onerror)
[![codecov](https://codecov.io/gh/deepexi/deepexi-onerror/branch/master/graph/badge.svg)](https://codecov.io/gh/deepexi/deepexi-onerror)

[npm-image]: https://img.shields.io/npm/v/deepexi-onerror.svg
[npm-url]: https://www.npmjs.com/package/deepexi-onerror
[download-image]: https://img.shields.io/npm/dm/deepexi-onerror.svg
[download-url]: https://www.npmjs.com/package/deepexi-onerror

`deepexi-onerror` is a koa-onerror middleware eggjs configurer for deepexi framework.

## How To

### 安装依赖

```bash
$ npm i deepexi-onerror
```

### 通过configurer配置你的onerror中间件

```js
// config.default.js
const onerror = require('deepexi-onerror');
config.onerror = onerror();
```

### 更多配置说明

```js
config.onerror = onerror({
    stack: {
        out: true,  // 强制输出堆栈信息，即使是生产环境下
    },
    status: {
      biz: 406,  // 哪些错误码被认为是业务异常
    }
})
```

## 异常处理规则

分为两类异常：业务异常和系统异常

### 业务异常

默认406状态码为业务异常（可通过配置修改）。业务异常可以指定code，如果不指定默认为-1。业务异常具备以下特点：

1. 一般是代码逻辑正确，但由于其它原因导致的操作失败，如接口调用参数错误，业务校验失败（例如新增的用户重名）等
2. 业务异常的信息可以展示给前端用户看
3. 每个业务异常会关联错误码（建议唯一），方便追溯

下面代码显示如何抛出一个业务异常

```js
const err = new Error('biz err');
err.status = 406;
// err.unsafeStatus = 430;  // 效果等同status，不同的是status只支持标准的HTTP状态码，而unsafeStatus可以让你使用非标准的HTTP状态码（如430）
err.code = 'DO-999';
throw err;
```

业务异常抛出后会被处理为以下格式
```json
{
    "success": false,
    "message": "biz err",
    "code": "DO-999"
}
```

### 系统异常

其它状态码为系统异常，如果不指定，则默认处理为500。系统异常具备以下特点：

1. 一般意味着服务端代码错误
2. 错误信息不会展示给前端用户
3. 非生产环境会有堆栈信息返回，方便问题排查
4. 错误码固定为-2

下面代码显示如何抛出一个系统异常

```js
throw new Error('system err');
```

系统异常抛出后会被处理为以下格式
```json
{
    "success": false,
    "message": "Internal Server Error",
    "code": -2,
    "stack": "..."
}
```
