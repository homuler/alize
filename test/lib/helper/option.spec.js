'use strict';

import option from 'helper/option';

describe('helper/option Test', () => {
  describe('injectParamsToUrl test', () => {
    it('root route', () => {
      const url = '/';
      expect(option.injectParamsToUrl(url)).to.eql(url);
    });

    it('no parameter case (parameter is not given)', () => {
      const url = '/foo/bar/';
      expect(option.injectParamsToUrl(url)).to.eql(url);
    });

    it('no parameter case (parameter is given)', () => {
      const url = '/foo/bar/';
      const param = { id: '1' };
      expect(option.injectParamsToUrl(url, param)).to.eql(url);
    });

    it('one parameter case', () => {
      const url = '/foo/bar/:id';
      const param = { id: '1' };
      expect(option.injectParamsToUrl(url, param)).to.eql('/foo/bar/1');
    });

    it('multiple parameters case', () => {
      const url = '/foo/:id/bar/:id2';
      const param = { id: '1', id2: 2 };
      expect(option.injectParamsToUrl(url, param)).to.eql('/foo/1/bar/2');
    });

    it('multiple parameters case (same parameter)', () => {
      const url = '/foo/:id/bar/:id';
      const param = { id: '1', id2: 2 };
      expect(option.injectParamsToUrl(url, param)).to.eql('/foo/1/bar/1');
    });
  });

  describe('calcAccessPath test', () => {
    let urlConfig;
    it('root path', () => {
      urlConfig = { url: '/', method: 'get' };
      expect(option.calcAccessPath(urlConfig)).to.eql('root');
    });

    it('root path with alias', () => {
      urlConfig = { url: '/', method: 'get', path: 'foo' };
      expect(option.calcAccessPath(urlConfig)).to.eql(urlConfig.path);
    });

    it('/foo', () => {
      urlConfig = { url: '/foo', method: 'get' };
      expect(option.calcAccessPath(urlConfig)).to.eql('foo');
    });

    it('/foo/bar', () => {
      urlConfig = { url: '/foo/bar', method: 'get' };
      expect(option.calcAccessPath(urlConfig)).to.eql('foo.bar');
    });

    it('/foo/bar with alias', () => {
      urlConfig = { url: '/foo/bar', method: 'get', path: 'baz' };
      expect(option.calcAccessPath(urlConfig)).to.eql('baz');
    });

    it('url with parameter', () => {
      urlConfig = { url: '/foo/:id/bar', method: 'get' };
      expect(option.calcAccessPath(urlConfig)).to.eql('foo.bar');
    });

    it('url with parameter (with alias)', () => {
      urlConfig = { url: '/foo/:id/bar', method: 'get', path: 'baz' };
      expect(option.calcAccessPath(urlConfig)).to.eql('baz');
    });
  });

  describe('checkCondition test', () => {
    let defaultObj;
    before(() => {
      defaultObj = {
        a: 1,
        b: 2,
        c: 3,
      };
    });

    it('no condition is specified (undefined)', () => {
      const when = { absent: void(0), present: void(0) };
      expect(option.checkCondition(defaultObj, when)).to.be.false;
    });

    it('no condition is specified (null)', () => {
      const when = { absent: null, present: null };
      expect(option.checkCondition(defaultObj, when)).to.be.false;
    });

    it('no condition is specified (empty array)', () => {
      const when = { absent: [], present: [] };
      expect(option.checkCondition(defaultObj, when)).to.be.false;
    });

    it('target object is null', () => {
      const when = { absent: ['a'], present: ['b'] };
      expect(option.checkCondition(null, when)).to.be.false;
    });

    it('absent and present property is missing', () => {
      expect(option.checkCondition(defaultObj, {})).to.be.false;
    });

    it('absent condition is fulfilled', () => {
      const when = { absent: ['d', 'e'], present: [] };
      expect(option.checkCondition(defaultObj, when)).to.be.true;
    });

    it('present condition is fulfilled', () => {
      const when = { present: ['a'] };
      expect(option.checkCondition(defaultObj, when)).to.be.true;
    });

    it('condition is not fulfilled', () => {
      const when = { absent: ['a', 'b'], present: ['e', 'f'] };
      expect(option.checkCondition(defaultObj, when)).to.be.false;
    });
  });

  describe('assertRequire test', () => {
    let defaultObj;
    before(() => {
      defaultObj = {
        a: 1,
        b: 2,
        c: 3,
      };
    });

    it('condition is not specified (fail)', () => {
      const req = true;
      expect(option.assertRequire.bind(null, defaultObj, 'd', req)).to.throw(/property/);
    });

    it('condition is not specified (not fail)', () => {
      const req = true;
      expect(option.assertRequire.bind(null, defaultObj, 'a', req)).not.to.throw(/property/);
    });

    it('object doesn\'t have a required property', () => {
      const req = { when: { present: ['c'] } };
      expect(option.assertRequire.bind(null, defaultObj, 'd', req)).to.throw(/property/);
    });

    it('specified property is not required', () => {
      const req = { when: { absent: ['a'] } };
      expect(option.assertRequire.bind(null, defaultObj, 'd', req)).not.to.throw(/property/);
    });

    it('object has the specified property', () => {
      const req = { when: { present: ['a'] } };
      expect(option.assertRequire.bind(null, defaultObj, 'b', req)).not.to.throw(/property/);
    });
  });

  describe('assertForbid test', () => {
    let defaultObj;
    before(() => {
      defaultObj = {
        a: 1,
        b: 2,
        c: 3,
      };
    });

    it('condition is not specified (fail)', () => {
      const req = true;
      expect(option.assertForbid.bind(null, defaultObj, 'a', req)).to.throw(/property/);
    });

    it('condition is not specified (not fail)', () => {
      const req = true;
      expect(option.assertForbid.bind(null, defaultObj, 'd', req)).not.to.throw(/property/);
    });

    it('object has a forbidden property', () => {
      const req = { when: { present: ['b'] } };
      expect(option.assertForbid.bind(null, defaultObj, 'a', req)).to.throw(/property/);
    });

    it('specified property is not forbidden', () => {
      const req = { when: { present: ['d'] } };
      expect(option.assertForbid.bind(null, defaultObj, 'a', req)).not.to.throw(/property/);
    });

    it('object does\'nt have the specified property', () => {
      const req = { when: { present: ['a'] } };
      expect(option.assertForbid.bind(null, defaultObj, 'd', req)).not.to.throw(/property/);
    });
  });

  describe('assertEnum test', () => {
    it('object is null', () => {
      expect(option.assertEnum.bind(null, null, 'a', { array: [] })).not.throw(Error);
    });

    it('object is empty', () => {
      expect(option.assertEnum.bind(null, {}, 'a', { array: [] })).not.throw(Error);
    });

    it('object doesn\'t have the specified property', () => {
      const obj = { a: 1 };
      expect(option.assertEnum.bind(null, obj, 'b', { array: [1] })).not.throw(Error);
    });

    it('object has the specified property and value is in array', () => {
      const obj = { a: 1 };
      expect(option.assertEnum.bind(null, obj, 'a', { array: [1, 2] })).not.throw(Error);
    });

    it('object has the specified property and value is not in array', () => {
      const obj = { a: 1 };
      expect(option.assertEnum.bind(null, obj, 'a', { array: [2, 3] })).throw(Error);
    });
  });

  describe('assertJSON test', () => {
    it('json is null', () => {
      expect(option.assertJSON.bind(null, null, {})).not.to.throw(Error);
    });

    it('config is null', () => {
      expect(option.assertJSON.bind(null, {}, null)).not.to.throw(Error);
    });

    it('type check (object doesn\'t have the specified property)', () => {
      const config = {
        a: {
          type: 'string',
        },
      };
      expect(option.assertJSON.bind(null, {}, config)).not.to.throw(Error);
    });

    it('type check (oject has the specified property)', () => {
      const config = {
        a: {
          type: 'string',
        },
      };
      expect(option.assertJSON.bind(null, { a: 'a' }, config)).not.to.throw(Error);
    });

    it('type check error', () => {
      const config = {
        a: {
          type: 'string',
        },
      };
      expect(option.assertJSON.bind(null, { a: 1 }, config)).to.throw(/type/);
    });

    it('enum check', () => {
      const config = {
        a: {
          checks: {
            'enum': {
              array: ['foo', 'bar'],
            },
          },
        },
      };
      expect(option.assertJSON.bind(null, { a: 'foo' }, config)).not.to.throw(Error);
    });

    it('enum check error', () => {
      const config = {
        a: {
          checks: {
            'enum': {
              array: ['foo', 'bar'],
            },
          },
        },
      };
      expect(option.assertJSON.bind(null, { a: 'baz' }, config)).to.throw(Error);
    });

    it('require check', () => {
      const config = {
        a: {
          checks: {
            require: true,
          },
        },
      };
      expect(option.assertJSON.bind(null, { a: 1 }, config)).not.to.throw(Error);
    });

    it('require check error', () => {
      const config = {
        a: {
          checks: {
            require: true,
          },
        },
      };
      expect(option.assertJSON.bind(null, { b: 1 }, config)).to.throw(Error);
    });

    it('forbid check', () => {
      const config = {
        a: {
          checks: {
            forbid: true,
          },
        },
      };
      expect(option.assertJSON.bind(null, { b: 1 }, config)).not.to.throw(Error);
    });

    it('forbid check error', () => {
      const config = {
        a: {
          checks: {
            forbid: true,
          },
        },
      };
      expect(option.assertJSON.bind(null, { a: 1 }, config)).to.throw(Error);
    });
  });
});
