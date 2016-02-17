'use strict';

import UrlConfig from 'data/urlConfig';

describe('UrlConfig test', () => {
  describe('constructor test', () => {
    it('config is null', () => {
      expect(() => (new UrlConfig(null))).to.throw(Error);
    });

    it('validateOption is called', () => {
      sinon.stub(UrlConfig, 'validateOption').throws(new Error());
      expect(() => (new UrlConfig({}))).to.throw(Error);
      expect(UrlConfig.validateOption.calledOnce).to.be.ok;
      UrlConfig.validateOption.restore();
    });

    it('parameters are set', () => {
      const config = {
        url: '/url',
        method: 'get',
        path: 'path',
        headers: {},
        credentials: 'include',
        assert: {},
        process: {},
        logMode: 'error',
      };
      const urlConfig = new UrlConfig(config);
      expect(urlConfig.url).to.eql(config.url, 'url is not set');
      expect(urlConfig.method).to.eql(config.method, 'method is not set');
      expect(urlConfig.path).to.eql(config.path, 'path is not set');
      expect(urlConfig.headers).to.eql(config.headers, 'headers is not set');
      expect(urlConfig.credentials).to.eql(config.credentials, 'credentials is not set');
      expect(urlConfig.assert).to.eql(config.assert, 'assert is not set');
      expect(urlConfig.process).to.eql(config.process, 'process is not set');
      expect(urlConfig.logMode).to.eql(config.logMode, 'logMode is not set');
    });

    it('parameteres are set (template version)', () => {
      const config = {
        url: '/url',
        template: 'template',
        only: ['only'],
      };
      const urlConfig = new UrlConfig(config);
      expect(urlConfig.template).to.eql(config.template, 'template is not set');
      expect(urlConfig.only).to.eql(config.only, 'only is not set');
      expect(urlConfig.path).to.eql('url', 'path is not set correctly');

    });
  });

  describe('validation test', () => {
    it('url must not be null', () => {
      const config = {
        url: '/url',
        method: 'get',
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/url/);
    });

    it('url must not be null (error)', () => {
      const config = {
        method: 'get',
      };
      expect(() => (new UrlConfig(config))).to.throw(/url/);
    });

    it('method or template must have a value', () => {
      const config = {
        url: '/url',
        method: 'delete',
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/method/);
    });

    it('method or template must have a value (error)', () => {
      const config = {
        url: '/url',
      };
      expect(() => (new UrlConfig(config))).to.throw(/method/);
    });

    it('method must be null when template is not null (error)', () => {
      const config = {
        url: '/url',
        method: 'get',
        template: 'template',
      };
      expect(() => (new UrlConfig(config))).to.throw(/method/);
    });

    it('method must be a specified string', () => {
      const config = {
        url: '/url',
        method: 'post',
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/method/);
    });

    it('method must be a specified string  (error)', () => {
      const config = {
        url: '/url',
        method: 'foo',
      };
      expect(() => (new UrlConfig(config))).to.throw(/method/);
    });

    it('only is a forbidden property when template is null', () => {
      const config = {
        url: '/url',
        template: 'template',
        only: ['only'],
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/only/);
    });

    it('only is a forbidden property when template is null (error)', () => {
      const config = {
        url: '/url',
        method: 'put',
        only: ['only'],
      };
      expect(() => (new UrlConfig(config))).to.throw(/only/);
    });

    it('path is a string value', () => {
      const config = {
        url: '/url',
        method: 'patch',
        path: 'path',
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/path/);
    });

    it('path is a string value (error)', () => {
      const config = {
        url: '/url',
        method: 'patch',
        path: ['path'],
      };
      expect(() => (new UrlConfig(config))).to.throw(/path/);
    });

    it('headers is a object', () => {
      const config = {
        url: '/url',
        method: 'head',
        headers: {
          'content-type': 'application/json',
        },
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/headers/);
    });

    it('headers is a object (error)', () => {
      const config = {
        url: '/url',
        method: 'connect',
        headers: 'content-type: application/json',
      };
      expect(() => (new UrlConfig(config))).to.throw(/headers/);
    });

    it('credentials is a string value', () => {
      const config = {
        url: '/url',
        method: 'head',
        credentials: 'include',
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/credentials/);
    });

    it('credentials must be a specified string', () => {
      const config = {
        url: '/url',
        method: 'head',
        credentials: 'credentials',
      };
      expect(() => (new UrlConfig(config))).to.throw(/credentials/);
    });

    it('credentials is a string value (error)', () => {
      const config = {
        url: '/url',
        method: 'head',
        credentials: ['include'],
      };
      expect(() => (new UrlConfig(config))).to.throw(/credentials/);
    });

    it('assert is a object', () => {
      const config = {
        url: '/url',
        method: 'head',
        assert: {},
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/assert/);
    });

    it('assert may have a "pre" or a "post" property', () => {
      const config = {
        url: '/url',
        method: 'head',
        assert: {
          pre: {},
          post: {},
        },
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/assert/);
    });

    it('assert may have a "pre" or a "post" property (error)', () => {
      const config = {
        url: '/url',
        method: 'head',
        assert: {
          pre: 'pre',
          post: 'post',
        },
      };
      expect(() => (new UrlConfig(config))).to.throw(/assert/);
    });

    it('process is a object', () => {
      const config = {
        url: '/url',
        method: 'head',
        process: {},
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/process/);
    });

    it('process may have a "pre" or a "post" property', () => {
      const config = {
        url: '/url',
        method: 'head',
        process: {
          pre: () => {},
          post: () => {},
        },
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/process/);
    });

    it('process may have a "pre" or a "post" property (error)', () => {
      const config = {
        url: '/url',
        method: 'head',
        process: {
          pre: {},
          post: {},
        },
      };
      expect(() => (new UrlConfig(config))).to.throw(/process/);
    });

    it('logMode is a string value', () => {
      const config = {
        url: '/url',
        method: 'head',
        logMode: 'silent',
      };
      expect(() => (new UrlConfig(config))).not.to.throw(/logMode/);
    });

    it('logMode is a string value (error)', () => {
      const config = {
        url: '/url',
        method: 'head',
        logMode: 1,
      };
      expect(() => (new UrlConfig(config))).to.throw(/logMode/);
    });
  });

  describe('fillOptionWith test', () => {
    it('add headers default option', () => {
      const config = {
        url: '/url',
        method: 'get',
      };
      const urlConfig = new UrlConfig(config);
      urlConfig.fillOptionWith({ headers: { 'content-type': 'application/json' } });
      expect(urlConfig.headers['content-type']).to.eql('application/json');
    });

    it('add headers default option (ignore default)', () => {
      const config = {
        url: '/url',
        method: 'get',
        headers: {
          'content-type': 'application/json',
          'foo': 'bar',
        },
      };
      const defaultConfig = {
        headers: {
          'content-type': 'text',
          'keep-alive': true,
        },
      };
      const urlConfig = new UrlConfig(config);
      urlConfig.fillOptionWith(defaultConfig);
      expect(urlConfig.headers['content-type']).to.eql('application/json');
      expect(urlConfig.headers['keep-alive']).to.eql(true);
      expect(urlConfig.headers.foo).to.eql('bar');
    });

    it('add process default option', () => {
      const config = {
        url: '/url',
        method: 'get',
        process: {
          pre: function pre() {},
        },
      };
      const defaultConfig = {
        process: {
          pre: function pre2() {},
          post: function post() {},
        },
      };
      const urlConfig = new UrlConfig(config);
      urlConfig.fillOptionWith(defaultConfig);
      expect(urlConfig.process.pre.name).to.eql('pre');
      expect(urlConfig.process.post.name).to.eql('post');
    });
  });

  describe('extendsOption test', () => {
    it('override method configuration', () => {
      const config = {
        url: '/url',
        method: 'get',
      };
      const option = {
        method: void(0),
        template: 'template',
      };
      const urlConfig = new UrlConfig(config);
      urlConfig.extendsOption(option);
      expect(urlConfig.method).to.be.undefined;
      expect(urlConfig.template).to.eql(option.template);
    });
  });
});
