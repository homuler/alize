'use strict';

import _ from 'lodash/wrapperLodash';
import mixin from 'lodash/mixin';
import isNil from 'lodash/isNil';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import assignIn from 'lodash/assignIn';
import assign from 'lodash/assign';
import get from 'lodash/get';
import has from 'lodash/has';

mixin(_, { isNil, get, set, has, cloneDeep, assign, assignIn });

import queryString from 'query-string';
import logger from 'helper/logger';
import { enproxy } from 'helper/proxy';
import UrlConfig from 'data/urlConfig';
import AlizeClient from 'alizeClient';
import {
  assertJSON,
  injectParamsToUrl,
} from 'helper/option';


export default class Alize {
  constructor(config) {
    this.client = new AlizeClient(logger, config.option);
    this.defaultOption = config.option || {};

    if (this.defaultOption.logMode) {
      logger.setMode(this.defaultOption.logMode);
    }
    this.registerTemplates(config.template);
    this.registerUrls(config.urls);
  }

  static fetch(urlConfig, data) {
    const {
      headers, credentials, process, assert,
    } = urlConfig.getOptionObj();
    const method = urlConfig.method;
    let body = null;
    let url = urlConfig.url;
    switch (method) {
      case 'get': {
        url += queryString.stringify(data);
        break;
      }
      case 'post': {
        body = JSON.stringify(data);
        break;
      }
      case 'put': {
        body = JSON.stringify(data);
        break;
      }
      case 'patch': {
        body = JSON.stringify(data);
        break;
      }
      default: {
        break;
      }
    }
    return (async () => {
      const response = await fetch(url, { method, body, headers, credentials });
      let result = response;
      try {
        if ((assert && assert.post) || (process && process.post)) {
          result = await result.json();
        }

        if (assert && assert.post) {
          assertJSON(result, assert.post);
        }

        if (process && process.post) {
          result = process.post(result);
        }
      } catch (err) {
        const errorMsg = `assert failed: ${err.message}`;
        throw new Error(errorMsg);
      }

      return result;
    })();
  }

  static fetchFactory(name, urlConfig) {
    return function fetchFactory(
        { urlParam = {}, data = {} } = {}, runtimeOption = {}) {
      urlConfig.extendsOption(runtimeOption);
      if (urlConfig.logMode) {
        logger.setMode(urlConfig.logMode);
      }
      const url = injectParamsToUrl(urlConfig.url, urlParam);
      logger.debug(`completed url: ${url}`);
      if (urlConfig.assert && typeof urlConfig.assert.pre === 'object'
          && urlConfig.assert.pre !== null) {
        assertJSON(data, urlConfig.assert.pre);
      }
      const reqData = urlConfig.process && urlConfig.process.pre ?
        urlConfig.process.pre(data) : data;

      return Alize.fetch(urlConfig, reqData);
    };
  }

  generateTemplateMethod(key, templateConfig, urlConfig) {
    const methods = {};
    for (const name in templateConfig) {
      if (!templateConfig.hasOwnProperty(name)) {
        continue;
      }
      const _urlConfig = _.cloneDeep(urlConfig);
      _urlConfig.extendsOption({
        template: void(0),
        ...templateConfig[name],
      });
      methods[name] = Alize.fetchFactory(name, _urlConfig);
      logger.debug(`method ${name} is generated.`);
      this.updateUrlMap(_urlConfig, name);
    }
    return methods;
  }

  registerTemplate(key, template) {
    this[key] = (baseUrl, option) => {
      const templateObj = template(baseUrl);
      const urlConfig = new UrlConfig({
        url: baseUrl,
        template: key,
        ...option,
      });
      urlConfig.fillOptionWith(this.defaultOption);
      if (urlConfig.logMode) {
        logger.setMode(urlConfig.logMode);
      }
      logger.debug(`endpoint is ${urlConfig.path}`);
      const fetchWrappers =
        this.generateTemplateMethod(key, templateObj, urlConfig);
      this.client.setTemplate(urlConfig.path, fetchWrappers);
      return this;
    };
  }

  registerTemplates(templates) {
    for (const key in templates) {
      if (!templates.hasOwnProperty(key)) {
        continue;
      }
      this.registerTemplate(key, templates[key]);
    }
  }

  registerUrl(urlConfig) {
    const option = {};
    urlConfig.fillOptionWith(this.defaultOption);

    if (option.logMode) {
      logger.setMode(option.logMode);
    }

    if (urlConfig.template) {
      this.registerUrlWithTemplate(urlConfig);
    } else {
      this.registerUrlWithMethod(urlConfig);
    }
  }

  registerUrls(urls) {
    for (const urlConfig of urls) {
      this.registerUrl(urlConfig);
    }
  }

  registerUrlWithTemplate(urlConfig) {
    const template = urlConfig.template;
    if (typeof this[template] === 'function') {
      this[template](urlConfig.url, urlConfig.getOptionObj());
    } else {
      throw new Error(`template "${template}" not found`);
    }
  }

  registerUrlWithMethod(urlConfig) {
    const method = urlConfig.method;
    if (typeof this[`_${method}`] === 'function') {
      this[`_${method}`](urlConfig.url, urlConfig.getOptionObj());
    } else {
      throw new Error(`method template "${method}" not found`);
    }
  }

  add(url, method, option) {
    if (typeof method === 'string') {
      const urlConfig = new UrlConfig({ url, method, ...option });
      this.registerUrlWithMethod(urlConfig);
    } else if (typeof method === 'object' && method.length) {
      for (const name of method) {
        const urlConfig = new UrlConfig({ url, method: name, ...option });
        this.registerUrlWithMethod(urlConfig);
      }
    } else {
      throw new Error(
        'method type is invalid. method must be string or array'
      );
    }

    return this;
  }

  updateUrlMap(urlConfig, name) {
    if (_.isNil(this.urlMap)) {
      this.urlMap = new Map();
    }

    const key = urlConfig.url;
    const val = this.urlMap.get(key) || {};
    _.assign(val, { [urlConfig.method]: { ...urlConfig, name } });

    this.urlMap.set(key, val);
  }

  getUrlMap() {
    return this.urlMap;
  }

  getClient() {
    return this.client;
  }
}

if (typeof Proxy !== 'undefined') {
  for (const prop in Alize) {
    if (!Alize.hasOwnProperty(prop)) {
      continue;
    }

    if (typeof Alize[prop] !== 'function') {
      continue;
    }

    Alize[prop] = enproxy(Alize[prop], prop, logger);
  }
}
