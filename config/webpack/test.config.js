'use strict';
  
const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

const testPaths = glob.sync(path.resolve(__dirname, '../../test/**/*.js'));
module.exports = {
  name: 'test',
  devtool: 'eval-cheap-module-sourcemap',
  entry: {
    alizeTest: testPaths,
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].js',
  },
  resolve: {
    root: [
      path.resolve(__dirname, '../../src'),
      path.resolve(__dirname, '../../src/lib'),
      path.resolve(__dirname, '../../test/lib'),
      path.resolve(__dirname, '../../test'),
    ],
    alias: {
      'logger': 'helper/logger',
    },
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /(test|node_modules)/,
        loader: 'isparta',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
    loaders: [
      { test: /\.spec\.js$/, loaders: ['mocha-loader', 'babel-loader'] },
      { test: /sinon/, loader: 'imports?define=>false,require=>false' },
      { test: /\.js$/, exclude: /(\.spec\.js$|node_modules)/, loader: 'babel-loader' },
    ],
  },
  eslint: {
    configFile: path.resolve(__dirname, '../eslint/test-index.js'),
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
      'babel-polyfill': 'imports?this=>global',
      'logger': 'imports?this=>global!exports?global.logger',
    }),
  ],
};

