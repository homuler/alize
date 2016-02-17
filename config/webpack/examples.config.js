'use strict';
  
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const exampleRoot = path.resolve(__dirname, '../../examples');

module.exports = [
  {
    name: 'restClient',
    devtool: 'eval-cheap-module-sourcemap',
    entry: {
      restClient: [path.resolve(exampleRoot, 'restClient/js/index.js')],
    },
    output: {
      path: path.resolve(exampleRoot, 'restClient/build'),
      filename: '[name].js',
    },
    resolve: {
      root: [
        path.resolve(__dirname, '../../src/lib'),
      ],
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      preLoaders: [
        {
          test: /(\.js|\.jsx)$/,
          loader: 'eslint-loader',
        },
      ],
      loaders: [
        { test: /(\.js|\.jsx)$/, exclude: /logger\.js/, loader: 'babel-loader' },
        { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader') },
        { test: /logger\.js$/, loader: 'expose?logger!babel-loader' },
        { test: require.resolve('react'), loader: 'expose?React' },
        { test: require.resolve('react-dom'), loader: 'expose?ReactDOM' },
      ],
    },
    eslint: {
      configFile: path.resolve(__dirname, '../eslint/example-index.js'),
    },
    plugins: [
      new webpack.ProvidePlugin({
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
      }),
      new ExtractTextPlugin('[name].css'),
    ],
    devServer: {
      hot: true,
      inline: true,
      proxy: {
        '/api/v1*': {
          target: 'http://localhost:3000',
        },
        '/github/*': {
          target: 'https://github.com/',
          rewrite: function(req) {
            req.url = req.url.replace('^/github/', '');
          },
        },
      },
    },
  },
];
