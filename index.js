"use strict";

require('electron-debug')();

import electron from 'electron';
const app = electron.app;

require('crash-reporter').start({
  productName: 'YourName',
  companyName: 'YourCompany',
  submitURL: 'https://your-domain.com/url-to-submit',
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
  const win = new electron.BrowserWindow({
    width: 600,
    height: 400
  });

  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', onClosed);

  return win;
}

function onClosed() {
  // dereference the window
  // for multiple windows store them in an array
  mainWindow = null;
}
