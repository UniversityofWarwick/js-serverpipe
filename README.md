# Server Pipe [![Build Status](https://travis-ci.com/UniversityofWarwick/js-serverpipe.svg?branch=master)](https://travis-ci.com/UniversityofWarwick/js-serverpipe)

This is a basic wrapper for `fetch()` that we use to make authenticated requests back to the application server.

## Browser support

IE11 will require the following polyfill to enable `NodeList.prototype.forEach` to work:

```js
import 'core-js/modules/web.dom-collections.for-each';
```

You will need:

`npm i core-js@3.1.3`

You will also need an appropriate `Promise` and `fetch()` polyfill.
