var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var inPlace = require('metalsmith-in-place');
var senseSass = require('metalsmith-sense-sass');
var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');
var rootPath = require('metalsmith-rootpath');

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
