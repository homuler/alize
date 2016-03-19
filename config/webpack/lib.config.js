'use strict';
  
const webpack = require('webpack');
const path = require('path');

module.exports = {
  name: 'lib',
  entry: {
    alize: [path.resolve(__dirname, '../../src/lib/index.js')],
  },
  output: {
    path: path.resolve(__dirname, '../../build'),
    filename: '[name].bundle.js',
    library: '[name]',
  },
  resolve: {
    root: [
      path.resolve(__dirname, '../../src/lib'),
    ],
  },
  module: {
    preLoaders: [
      { test: /\.js$/, exclude: /logger\.js/, loader: 'eslint-loader' },
    ],
    loaders: [
      { test: /\.js$/, exclude: /logger\.js/, loader: 'babel-loader' },
      { test: /logger\.js$/, loader: 'expose?logger!babel-loader' },
    ],
  },
  eslint: {
    configFile: path.resolve(__dirname, '../eslint/index.js'),
  },
};
