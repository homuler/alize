'use strict';

import _ from 'lodash/wrapperLodash';
import mixin from 'lodash/mixin';
import set from 'lodash/set';
import get from 'lodash/get';
import has from 'lodash/has';
import assign from 'lodash/assign';

mixin(_, { set, get, has, assign });

import { enproxy } from 'helper/proxy';

export default class AlizeClient {
  constructor(logger, options = {}) {
    this.options = options;
    if (typeof Proxy !== 'undefined') {
      this._template = {};

      for (const prop in this) {
        if (!this.hasOwnProperty(prop)) {
          continue;
        }
        if (typeof this[prop] !== 'function') {
          continue;
        }
        this[prop] = enproxy(this[prop], prop, logger);
      }
      return new Proxy(this, {
        get(target, prop) {
          if (prop in target) {
            return target[prop];
          }

          if (prop in target._template) {
            return target._template[prop];
          }

          return void(0);
        },

        has(target, prop) {
          return prop in target || prop in target._template;
        },
      });
    }

    return this;
  }

  setTemplate(path, funcs) {
    let setPath = path;
    if (typeof Proxy !== 'undefined') {
      setPath = `_template.${path}`;
    }

    if (_.has(this, setPath)) {
      _.assign(_.get(this, setPath), funcs);
    } else {
      _.set(this, setPath, funcs);
    }
  }

  // fetch helper
  wrapFetch(method, url, option) {
    return fetch(url, { ...this.options, ...option, method });
  }

  get(url, option) {
    return this.wrapFetch('get', url, option);
  }

  post(url, option) {
    return this.wrapFetch('post', url, option);
  }

  delete(url, option) {
    return this.wrapFetch('delete', url, option);
  }

  put(url, option) {
    return this.wrapFetch('put', url, option);
  }

  patch(url, option) {
    return this.wrapFetch('patch', url, option);
  }

  head(url, option) {
    return this.wrapFetch('head', url, option);
  }

  trace(url, option) {
    return this.wrapFetch('trace', url, option);
  }

  track(url, option) {
    return this.wrapFetch('track', url, option);
  }

  connect(url, option) {
    return this.wrapFetch('connect', url, option);
  }

  options(url, option) {
    return this.wrapFetch('options', url, option);
  }
}
