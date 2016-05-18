"use strict";

const path = require('path');
const MenuBar = require('menubar');
const AutoLaunch = require('auto-launch');
const GhReleases = require('electron-gh-releases')
const electron = require('electron');
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const promoteWindowsTrayItems = require('electron-promote-windows-tray-items');

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

// Promote the app to the toolbar itself on windows.
if (process.platform === 'win32') {
  promoteWindowsTrayItems(function(err) {});
}

menu.on('ready', () => {
  menu.tray.setToolTip('CampusNet Sync');
});

ipcMain.on('show-menubar', function() {
  menu.showWindow();
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
  repo: 'tmpethick/campusnet-electron',
  currentVersion: menu.app.getVersion()
});

// Check for updates
// `status` returns true if there is a new update available
updater.check((err, status) => {
  if (!err && status) {
    // Download the update
    updater.download();
  }
});

// When an update has been downloaded
updater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Update & Restart', 'Cancel'],
    title: 'Update Available',
    cancelId: 99,
    message: 'There is an update available. Would you like to update CampusNetSync now?'
  }, function (response) {
    console.log('Exit: ' + response);
    if (response === 0) {
      // Restart the app and install the update
      updater.install();
    }
  });
});

// Access electrons autoUpdater
updater.autoUpdater;
