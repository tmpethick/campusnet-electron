const path = require('path');
const packager = require('electron-packager');
const pkg = require('./package.json');

const devDeps = Object.keys(pkg.devDependencies);

packager({
  dir: './',
  name: pkg.productName,
  out: 'release',
  version: pkg.electronVersion,
  icon: path.join(__dirname, 'logo/logo'),
  asar: true,
  overwrite: true,
  // all: true,
  platform: 'darwin',
  arch: 'x64',
  prune: true,
  ignore: [
    '/test($|/)',
    '^/release$',
  ].concat(devDeps.map(name => `/node_modules/${name}($|/)`))
}, function done (err, appPath) {
  if (err)
    console.log(err);
  else
    console.log(appPath);
});
