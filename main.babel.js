"use strict";

import {app, BrowserWindow} from 'electron';
// import menubar from 'menubar';

require('electron-debug')();
require('crash-reporter').start({
  productName: 'CampusNet Sync',
  companyName: 'tmpcode',
  submitURL: 'https://pethick.dk',
  autoSubmit: true
});

let mainWindow;

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

app.on('ready', () => {
  mainWindow = createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function createMainWindow() {
  // const win = new BrowserWindow({
  const win = menubar({
    width: 400,
    height: 300,
    //transparent: true,
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  });

  win.loadURL(`file://${__dirname}/app/index.html`);
  win.on('closed', onClosed);

  // Only open dev tools in dev environment
  if(process.env.ENVIRONMENT === 'DEV') {
    // Open the DevTools.
    // win.openDevTools();
  }

  return win;
}

function onClosed() {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null;
}
