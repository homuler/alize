const glob = require('glob');
const path = require('path');
const ruleFiles = path.resolve(__dirname, 'rules/**/*.js');

module.exports = {
  extends: glob.sync(ruleFiles).map(require.resolve),
  rules: {
    'react/jsx-uses-vars': 2,
  },
  parserOptions: {
    'ecmaFeatures': {
      'jsx': true,
    },
  },
  env: {
    'es6': true,
    'browser': true,
  },
  globals: {
    'require': true,
    'logger': true,
    'React': true,
    'ReactDOM': true,
  },
  plugins: ['react'],
  parser: 'babel-eslint',
};
