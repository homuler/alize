'use strict';

import AlizeConfig from 'data/alizeConfig';
import Alize from 'alize';

import 'babel-polyfill';

export function setup(config = {}) {
  return new Alize(new AlizeConfig(config));
}

export function build(config = {}) {
  return new Alize(new AlizeConfig(config)).getClient();
}

export default {
  setup,
  build,
};
