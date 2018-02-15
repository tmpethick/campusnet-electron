'use strict';

const path = require('path');
const MenuBar = require('menubar');
const AutoLaunch = require('auto-launch');
const autoUpdater = require("electron-updater").autoUpdater
const electron = require('electron');
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const startupHandler = require('./startupHandler');

if (process.env.NODE_ENV === 'development')
  require('electron-debug')();

electron.crashReporter.start({
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
  preloadWindow: true,
  resizable: false,
  alwaysOnTop: process.env.NODE_ENV === 'development'
});

if (startupHandler(menu.app)) {
  return;
}

// Prevent multiple instances on Windows.
const shouldQuit = menu.app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (menu.window) {
    menu.showWindow();
  }
});

if (shouldQuit) {
  menu.app.quit();
  return;
}

menu.on('ready', () => {
  menu.tray.setToolTip('CampusNet Sync');
  
  // Updater
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('show-menubar', function() {
  menu.showWindow();
});


// On Mac, work around a bug in auto-launch where it opens a Terminal window
// https://github.com/feross/webtorrent-desktop/pull/923
const appPath = process.platform === 'darwin'
  ? menu.app.getPath('exe').replace(/\.app\/Content.*/, '.app')
  : undefined; // Use the default

// Launch on boot
const appLauncher = new AutoLaunch({
  name: 'CampusNetSync',
  path: appPath,
  isHidden: true
});

appLauncher.isEnabled().then(function(enabled) {
  if (enabled) return;
  return appLauncher.enable();
});

// Updater
ipcMain.on('check-update', event => {
  // `status` returns true if there is a new update available
  autoUpdater.checkForUpdatesAndNotify()
    .then(result => {
      if (result == null)
        event.sender.send('check-update-response', false);
    });
});
