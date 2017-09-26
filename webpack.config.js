let webpack = require('webpack');

module.exports = {
  entry: './src/entry.js',
  target: 'electron-renderer',

  output: {
    filename: 'bundle.js',
    path: __dirname + '/app/app',
    publicPath: process.env.NODE_ENV === 'development' ?
      'http://localhost:8080/app/' : 'app/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],

  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.s(c|a)ss$/, loader: 'style-loader!css-loader!sass-loader'},
      {test: /\.woff/, loader: 'file?prefix=font/&limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf/, loader: 'file?prefix=font/'},
      {test: /\.eot/, loader: 'file?prefix=font/'},
      {test: /\.svg/, loader: 'file?prefix=font/'}
    ]
  }
};
