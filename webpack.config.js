var webpack = require('webpack');

module.exports = {
  entry: './app/entry.js',
  target: 'electron',

  output: {
    filename: 'bundle.js',
    path: __dirname + '/build',
    publicPath: 'http://localhost:8080/build/'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.s(c|a)ss$/, loader: 'style-loader!css-loader!sass-loader' },
      {test: /\.woff/, loader: 'file?prefix=font/&limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf/, loader: 'file?prefix=font/'}, 
      {test: /\.eot/, loader: 'file?prefix=font/'}, 
      {test: /\.svg/, loader: 'file?prefix=font/'}
    ]
  }
};
