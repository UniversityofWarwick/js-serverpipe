# Server Pipe [![Build Status](https://travis-ci.com/UniversityofWarwick/js-serverpipe.svg?branch=master)](https://travis-ci.com/UniversityofWarwick/js-serverpipe)

This is a basic wrapper for `fetch()` that we use to make authenticated requests back to the application server.

## Browser support

IE11 will require the following polyfill to enable `NodeList.prototype.forEach`, `Promise` and `fetch` to work:

```js
import 'core-js/modules/web.dom-collections.for-each';
import 'core-js/features/promise';
import 'whatwg-fetch'
```

You will need:

`npm i --save core-js@3.1.3`

`npm i --save whatwg-fetch@3.0.0`
