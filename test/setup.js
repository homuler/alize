const global = require('global');
const chai = require('chai');
const sinon = require('sinon');

global.sinon = sinon;
require('sinon/lib/sinon/util/core');
require('sinon/lib/sinon/extend');
require('sinon/lib/sinon/walk');
require('sinon/lib/sinon/times_in_words');
require('sinon/lib/sinon/format');
require('sinon/lib/sinon/typeOf');
require('sinon/lib/sinon/match');
require('sinon/lib/sinon/call');
require('sinon/lib/sinon/spy');
require('sinon/lib/sinon/behavior');
require('sinon/lib/sinon/stub');
require('sinon/lib/sinon/mock');
require('sinon/lib/sinon/collection');
require('sinon/lib/sinon/assert');

global.expect = chai.expect;

import { fetch } from 'whatwg-fetch';
if (!global.fetch) {
  global.fetch = fetch;
}

import 'babel-polyfill';
