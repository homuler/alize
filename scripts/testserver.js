'use strict';

const path = require('path');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require(path.resolve(__dirname, '../config/webpack/test.config.js'));

Object.keys(config.entry).forEach((key) => {
  console.log(config.entry);
  config.entry[key].unshift(
    'webpack-dev-server/client?http://localhost:8081',
    'webpack/hot/dev-server'
  );
});

config.plugins = [
  new webpack.HotModuleReplacementPlugin(), 
  new webpack.ProvidePlugin({
    'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch',
  }),
];

const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
  publicPath: '/test',
  hot: true,
  proxy: { '/api/*': 'http://localhost:3000' },
});

server.listen(8081);
