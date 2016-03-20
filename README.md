# Alize.js
[![Build Status](https://travis-ci.org/homuler/alize.svg?branch=master)](https://travis-ci.org/homuler/alize) [![Coverage Status](https://coveralls.io/repos/github/homuler/alize/badge.svg?branch=master)](https://coveralls.io/github/homuler/alize?branch=master) [![npm version](https://badge.fury.io/js/alize.svg)](https://badge.fury.io/js/alize)

HTTP Client in JavaScript using Fetch API
## Why Alize.js?
1. to avoid hard-coding urls when doing ajax.
1. to assert the structure of the request parameter object.
1. to assert the structure of the response JSON.

## Installation
```sh
npm i --save alize
```

## Requirements
- whatwg-fetch
  - to use Fetch API in browser environment (you can use another polyfill)

## Examples
```js
const alize = require('alize');

const alizeBuilder = alize.setup({
  urls: [
    {
      url: '/foo',
      method: 'get',
    },
    {
      url: '/foo/:id',
      method: 'post',
      assert: {
        pre: {
          {
            x: {
              require: true,
            },
          },
        },
        post: {
          {
            message: {
              require: true,
            },
          },
        },
      },
    },
    {
      url: '/bar',
      template: 'resources',
      only: ['show', 'new', 'destroy'],
    },
  ],
  option: {
    logMode: 'error',
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

const client = alizeBuilder.getClient();

client.foo.get(); // GET /foo
client.foo.post({ urlParam: { id: 1 }, data: { x: 'x' } }); // POST /foo/:id
client.bar.destroy({ urlParam: { id: 1 } }); // DELETE /bar/:id
```

This example generate a object (Alize object), which has methods to fetch remote data, and validate the parameter object and the returned JSON.

You can also add such a method after initializing.

```js
const alizeBuilder = alize.setup();

// You can now access .foo.get
alizeBuilder.add({ url: '/foo', method: 'get' });

const client = alizeBuilder.getClient();
client.foo.get(); // GET /foo
```

## Configuration
Alize's setup method receives an object which has properties below.

|name|type|description|
|urls|Array(object)|Used to initialize UrlConfig object|
|template|object|Used to generate template functions|
|option|object|Set common options. You can set such values as the log level, headers, and so on|

### UrlConfig
Alize generates methods as specified in a `UrlConfig` object.
You can initialize a UrlConfig object through `alize.setup` method or `Alize.add` method.

For example,

```js
const param = {
  urls: [
    { url: '/foo', method: 'get' }, // This is used to initialize UrlConfig object.
  ],
};
const alizeBuilder = alize.setup(param);

// alize.setup returns Alize object. You can call add method to generate another method.
alizeBuilder.add({ url: '/foo:id', method: 'delete' });
```

The UrlConfig constructor receives such a object as specified below.

#### Property
|name|type|description|required|
|----|----|-----------|--------|
|url|string|Url path. If the url has dynamic values, then use colon. e.g. /foo/:id/bar|true|
|method|string|The same parameter as the fetch API's method. e.g. get, post, delete, put...|or template|
|template|string|Template method. You can generate multiple methods with this|or method|
|only|Array(string)|When you use template, alize generates methods which is only specified here|false|
|path|string|access path to the generated method|false|
|headers|object|The same parameter as the fetch API's headers. e.g. { 'Content-Type': 'application/json' }|false|
|credentials|string|The same parameter as the fetch API's credentials. e.g. 'same-origin'|false|
|assert|object|Used to validate post parameters and the returned JSON|false|
|process|object|Used to process parameter object before fetching or the returned JSON after fetching|false|
|logMode|string|Specify log level. the default value is 'silent' e.g. 'error', 'warn', 'info', 'log', 'debug'|false|

### Path
The access path to the method is determined as below.

1. If the path is specified, then the value is that.
  - e.g. 'foo.bar'
1. If the path is /, then the access path will be 'root'
1. Thrashes in the path is replaced by dots, and the dynamic parameters and superfluous dots are removed
  - e.g. '/foo/:id/bar' -> 'foo.bar'

```js
const alizeBuilder = alize.setup();
alizeBuilder
  .add({ url: 'foo', method: 'get' })
  .add({ url: 'foo/:id/bar', template: 'resources', only: ['index'] });

const client = alizeBuilder.getClient();
client.foo.get(); // When the method is specified, method name will be the value
clinet.foo.bar.index(); // When the template is specified, methods' name will be the template methods' name
```


### Template
Alize has two default `template` methods.

#### resources
Generates methods below. This crresponds to the Rails' resources.

|method|WebAPI|url|
|------|------|---|
|index|GET|{path}|
|show|GET|{path}/:id|
|create|POST|{path}|
|edit|GET|{path}/:id/edit|
|update|PUT|{path}/:id|
|destroy|DELETE|{path}/:id|

#### rest
Generates methods below.

|method|WebAPI|url|
|------|------|---|
|get|GET|{path}|
|put|PUT|{path}|
|post|PUT|{path}|
|patch|PUT|{path}|
|delete|PUT|{path}|

#### Example

```js
const alizeBuilder = alize.setup({
  urls: [{ url: 'foo', template: 'resources' }],
});

const client = alizeBuilder.getClient();
client.foo.index(); // GET /foo

// You can call a template method directly.
alizeBuilder.resources('/bar');
client.bar.show({ urlParam: { id: 1 } }); // GET /bar/1
```

You can also add your original template methods.

```js
const alizeBuilder = alize.setup({
  template: {
    original: function (baseUrl) { // receives url path string
      'methodName': {
        url: `${baseUrl}/:id`,
        method: 'get',
      },
    },
  },
});

// Now you can use 'original' template.
alizeBuilder.original('/foo');

const client = alizeBuilder.getClient();
client.foo.methodName({ urlParam: { id: 1 } }); // GET /foo/1
```

### Assert
You can validate the parameters before fetching, and also the returned JSON (when content-type is 'application/json') after fetching.

#### Assert Property
|name|type|description|
|----|----|-----------|
|pre|object|Used to validate the parameters before fetching|
|post|object|Used to validate the returned JSON|

pre and post's object has such a structure as
```js
const pre = {
  [property]: {
    type: [type value], // this is the returned value of typeof operator.
    checks: {
      'enum': { // Specified when the value is limited.
        array: [array of values],
      },
      'require': { // If always required, then you can also set true.
        when: {
          present: [Array of property names],
          // When some of the specified properties are present in the object, then the object must have the property.
          absent: [Array of property names]
          // When some the specified properties are not present in the object, then the object must have the property.
        },
      },
      'forbid': {
        when: {
          present: [Array of property names],
          // When some of the specified properties are present in the object, then the object mustn't have the property.
          absent: [Array of property names]
          // When some the specified properties are not present in the object, then the object mustn't have the property.
        },
      },
    },
  },
};
```

#### Examples

```js
const assert = {
  pre: {
    x: {
      type: 'string',  // x's type is string,
      checks: {
        require: true, // and post parameter must include 'x'.
      },
    },
    y: {
      type: 'number',
      checkes: {
        require: {
          when: {
            absent: ['z'], // y is required when the parameter doesn't have the property 'z',
          },
        },
        forbid: {
          when: {
            present: ['z'], // and y is forbidden when the parameter has the property 'z'.
          },
        },
      },
    },
  },
};

const alizeBuilder = alize.setup({
  urls: [{ url: '/foo', method: 'get', option: { assert } }],
});
```

### Process
You can convert parameters or returned JSON before or after fetching.

#### Property
|name|type|description|
|----|----|-----------|
|pre|function|Used to process the parameters before fetching|
|post|function|Used to process the returned JSON|

#### Examples
```js
const process = {
  pre(param) {
    return param;
  },
  post(json) {
    return json;
  },
};

const alizeBuilder = alize.setup({
  urls: [{ url: '/foo', method: 'get', option: { process } }],
});
```

## API
### setup (object) => Alize
Please refer to [the configuration details](http://github.com/homuler/alize#configuration).

### build (object) => AlizeClient

```js
const alizeBuilder = alize.setup();
let alizeClient = alizeBuilder.getClient();

// This is the same as above.
alizeClient = alize.build();
```

### Alize
#### getClient (void) => AlizeClient

```js
const alizeBuilder = alize.setup();
const alizeClient = alizeBuilder.getClient();
```

#### add (object) => Alize(this)

```js
const alizeBuilder = alize.setup();
alizeBuilder.add({ url: '/foo', method: 'get' })
  .add({ url: 'bar', method: 'post' });
```

#### template method (string, object) => Alize(this)

receives url path string and fetch option object, then generate methods to fetch.

```js
const alizeBuilder = alize.setup();
alizeBuilder
  .resources('bar')
  .get('foo', {
    headers: {
      'Content-Type': 'text/html'
    },
    credentials: 'same-origin',
    process: {
      post(json) {
        return json.message;
      },
    },
  });

const alizeClient = alizeBuilder.getClient();
alizeClient.bar.show({ urlParam: { id : 1 }); // GET /bar/:id
alizeClient.foo.get(); // GET /foo
```

The default template methods are below.
Please also refer to [the template details](https://github.com/homuler/alize#template)

- resources
- rest
- get
- post
- delete
- put
- patch
- head
- options

### AlizeClient
AlizeClient has the generated metods.

#### Generated method
receives post parameter and fetch remote data.

##### Parameter Property
|name|type|description|
|----|----|-----------|
|urlParam|object|When the url has parameters, then the value is specified here
|data|object|The same parameter as the fetch API's data|

```js
const client = alize.build({ urls: [{ url: 'foo/:id', method: 'get' }] });
client.foo.get({ urlParam: { id: 1 }, data: { x: 2 } }); // GET /foo/1?x=2
```

You can't set other fetch options here.
If you'd like to set options dynamically, then use the next Fetch API wrapper method.

#### Fetch API wrapper
AlizeClient has the methods which wrap fetch API, other than the generated methods.
You can fetch data with calling such methods as `get`, `post`, and so on.

```js
const client = alize.setup().getClient();

// GET /foo?id=1
client.get('/foo', { id: 1 }, { 'Content-Type': 'application/json' });
```
