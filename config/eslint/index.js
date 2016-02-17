const glob = require('glob');
const path = require('path');
const ruleFiles = path.resolve(__dirname, 'rules/**/*.js');

module.exports = {
  extends: glob.sync(ruleFiles).map(require.resolve),
  rules: {},
  env: {
    'es6': true,
    'browser': true,
  },
  globals: {
    'require': true,
    'logger': true,
  },
  parser: 'babel-eslint',
};
