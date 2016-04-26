"use strict";

const path = require('path');
const MenuBar = require('menubar');
const AutoLaunch = require('auto-launch');
const GhReleases = require('electron-gh-releases')

//if (process.env.NODE_ENV === 'development')
  require('electron-debug')();

require('crash-reporter').start({
  productName: 'CampusNetSync',
  companyName: 'Pethick',
  submitURL: 'https://pethick.dk',
  autoSubmit: true
});

const menu = MenuBar({
  width: 360,
  height: 250,
  icon: path.join(__dirname, 'logo', 'menuIconTemplate.png'),
  index: `file://${__dirname}/index.html`,
  'preload-window': true,
  resizable: false,
  'always-on-top': process.env.NODE_ENV === 'development'
});

menu.on('ready', () => {
  menu.tray.setToolTip('CampusNet Sync');
});


// Launch on boot
var appLauncher = new AutoLaunch({
  name: 'CampusNetSync'
});
 
appLauncher.isEnabled().then(function(enabled){
  if(enabled) return;
  return appLauncher.enable()
});


// Updater
const updater = new GhReleases({
  repo: 'jenslind/electron-gh-releases',
  currentVersion: menu.app.getVersion()
})

// Check for updates
// `status` returns true if there is a new update available
updater.check((err, status) => {
  if (!err && status) {
    // Download the update
    updater.download()
  }
})

// When an update has been downloaded
updater.on('update-downloaded', (info) => {
  // Restart the app and install the update
  updater.install()
})

// Access electrons autoUpdater
updater.autoUpdater;
