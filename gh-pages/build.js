var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var inPlace = require('metalsmith-in-place');
var senseSass = require('metalsmith-sense-sass');
var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');
var rootPath = require('metalsmith-rootpath');
var webpack = require('metalsmith-webpack');
var path = require('path');

Metalsmith(__dirname)
  .use(senseSass({
    sass: {
      outputDir: 'css/',
      sourceMap: true,
      sourceMapContents: true
    }
  }))
  .use(
    watch({
      paths: {
        "${source}/**/*": true,
        "${source}/scss/**/*.scss": "scss/index.scss",
      },
      livereload: true,
    })
  )
  .use(webpack({
    context: path.resolve(__dirname, './src/js/'),
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, './build/js/'),
      filename: 'bundle.js'
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      ]
    },
    resolveLoader: { root: path.join(__dirname, "node_modules") },
    resolve: { modulesDirectories: ['node_modules'] }

  }))
  .use(rootPath())
  .use(layouts({
      "engine": "handlebars"
  }))
  .use(inPlace({
      "engine": "handlebars"
  }))
  .source('./src')
  .destination('./build')
  .use(serve())
  .build(function(err){
    if (err){
      console.log(err);
    } else {
      console.log('Site build complete!');
    }
  });
