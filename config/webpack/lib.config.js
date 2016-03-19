'use strict';
  
const webpack = require('webpack');
const path = require('path');

module.exports = {
  name: 'lib',
  entry: {
    alize: [path.resolve(__dirname, '../../src/index.js')],
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].js',
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
      { test: /\.js$/, loader: 'babel-loader' },
    ],
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
  ],
  eslint: {
    configFile: path.resolve(__dirname, '../eslint/index.js'),
  },
};
