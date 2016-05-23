"use strict";

const path = require('path');
const MenuBar = require('menubar');
const AutoLaunch = require('auto-launch');
const electron = require('electron');
const dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const promoteWindowsTrayItems = require('electron-promote-windows-tray-items');
const startupHandler = require('./startupHandler');
const open = require('open');
const createUpdater = require('./updater');

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

// Promote the app to the toolbar itself on windows.
/*if (process.platform === 'win32') {
  promoteWindowsTrayItems(function(err) {});
}*/

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
const updater = createUpdater(menu.app);

ipcMain.on('check-update', event => {
  // `status` returns true if there is a new update available
  updater.check((err, status) => {
    const newUpdate = !err && status;
    if (newUpdate) {
      try {
        updater.download();
      } catch (e) {
        console.log('Already checking for updates..');
      }
    }
    event.sender.send('check-update-response', newUpdate);
  });
});