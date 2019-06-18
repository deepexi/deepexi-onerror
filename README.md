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

### install

```bash
$ npm i deepexi-onerror
```

### config via configurer

```js
// config.default.js
const onerror = require('deepexi-onerror');
config.onerror = onerror();
```
