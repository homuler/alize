'use strict';

import _ from 'lodash/wrapperLodash';
import assignIn from 'lodash/assignIn';
import mixin from 'lodash/mixin';

mixin(_, { assignIn });

import resourcesGenerator from 'template/resources';
import getGenerator from 'template/get';
import postGenerator from 'template/post';
import putGenerator from 'template/put';
import patchGenerator from 'template/patch';
import deleteGenerator from 'template/delete';
import optionsGenerator from 'template/options';
import headGenerator from 'template/head';
import lazyRESTGenerator from 'template/lazy/rest';

import UrlConfig from 'data/urlConfig';

export default class AlizeConfig {
  constructor({ urls = [], template = {}, option = {} } = {}) {

    if (urls) {
      this.urls = urls.map(url => new UrlConfig(url));
    } else {
      this.urls = [];
    }
    this.template = AlizeConfig.defaultTemplates;
    this.extendsTemplate(template);
    this.extendsTemplate(AlizeConfig.methodTemplates);
    this.registerLazyTemplate({ rest: lazyRESTGenerator });

    this.option = AlizeConfig.defaultOption;
    this.extendsOption(option);
  }

  registerLazyTemplate(lazyTemplate) {
    for (const name in lazyTemplate) {
      if (!lazyTemplate.hasOwnProperty(name)) {
        continue;
      }
      this.extendsTemplate({ [name]: lazyTemplate[name](this.template) });
    }
  }

  extendsTemplate(template) {
    if (this.template == null) {
      this.template = {};
    }
    _.assignIn(this.template, template);
  }

  extendsOption(option) {
    if (this.option == null) {
      this.option = {};
    }
    _.assignIn(this.option, option);
  }
}

AlizeConfig.defaultTemplates = {
  'resources': resourcesGenerator,
  'get': getGenerator,
  'post': postGenerator,
  'put': putGenerator,
  'patch': patchGenerator,
  'delete': deleteGenerator,
  'options': optionsGenerator,
  'head': headGenerator,
};

AlizeConfig.methodTemplates = {
  _get: getGenerator,
  _post: postGenerator,
  _put: putGenerator,
  _patch: patchGenerator,
  _delete: deleteGenerator,
  _options: optionsGenerator,
  _head: headGenerator,
};

AlizeConfig.defaultOption = {
  logMode: 'silent',
  process: {},
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: null,
};
