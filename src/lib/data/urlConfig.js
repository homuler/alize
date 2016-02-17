'use strict';

import _ from 'lodash/wrapperLodash';
import mixin from 'lodash/mixin';
import assign from 'lodash/assign';

mixin(_, { assign });

import { assertJSON, calcAccessPath } from 'helper/option';

export default class UrlConfig {
  constructor(config) {
    if (config == null) {
      throw new Error('config must not be null');
    }
    UrlConfig.validateOption(config);
    this.initConfig(config);
  }

  initConfig(config) {
    const {
      url, method, template, only, path, headers,
      credentials, assert, process, logMode,
    } = config;
    this.url = url;

    if (template) {
      this.template = template;
      this.only = only;
      this.method = void(0);
    } else {
      this.template = void(0);
      this.only = void(0);
      this.method = method;
    }

    this.path = calcAccessPath({ url, path });
    this.headers = headers;
    this.credentials = credentials;
    this.assert = assert;
    this.process = process;
    this.logMode = logMode;
  }

  static validateOption(option) {
    const methodEnum = [
      'get', 'post', 'put', 'delete', 'patch',
      'head', 'trace', 'track', 'connect', 'options',
    ];
    const credentialEnum = ['omit', 'include', 'same-origin'];
    assertJSON(option, {
      url: {
        type: 'string',
        checks: {
          require: true,
        },
      },
      method: {
        type: 'string',
        checks: {
          'enum': {
            array: methodEnum,
          },
          'require': {
            when: {
              absent: ['template'],
            },
          },
          'forbid': {
            when: {
              present: ['template'],
            },
          },
        },
      },
      template: {
        type: 'string',
        checks: {
          require: {
            when: {
              absent: ['method'],
            },
          },
        },
      },
      only: {
        type: 'object',
        checks: {
          forbid: {
            when: {
              absent: ['template'],
            },
          },
        },
      },
      path: {
        type: 'string',
      },
      headers: {
        type: 'object',
      },
      credentials: {
        type: 'string',
        checks: {
          'enum': {
            array: credentialEnum,
          },
        },
      },
      assert: {
        type: 'object',
        children: {
          pre: {
            type: 'object',
          },
          post: {
            type: 'object',
          },
        },
      },
      process: {
        type: 'object',
        children: {
          pre: {
            type: 'function',
          },
          post: {
            type: 'function',
          },
        },
      },
      logMode: {
        type: 'string',
        checks: {
          'enum': {
            array: ['silent', 'error', 'warn', 'info', 'log', 'debug'],
          },
        },
      },
    });
  }

  fillOptionWith({ headers, credentials, process }) {
    this.headers = _.assign(headers, this.headers);
    this.credentials = this.credentials || credentials;
    this.process = _.assign(process, this.process);
  }

  extendsOption(option) {
    const configObj = this.getConfigObj();
    _.assign(configObj, option);
    UrlConfig.validateOption(configObj);
    this.initConfig(configObj);
  }

  setUrl(url) {
    this.url = url;
  }

  setTemplate(template) {
    this.template = template;
  }

  getOptionObj() {
    const option = { path: this.path };
    if (this.headers) {
      option.headers = this.headers;
    }
    if (this.credentials) {
      option.credentials = this.credentials;
    }
    if (this.assert) {
      option.assert = this.assert;
    }
    if (this.process) {
      option.process = this.process;
    }
    return option;
  }

  getConfigObj() {
    const option = this.getOptionObj();
    option.url = this.url;
    option.template = this.template;
    option.only = this.only;
    option.method = this.method;
    return option;
  }
}

