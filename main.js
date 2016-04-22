"use strict";

const path = require('path');
const MenuBar = require('menubar');

//if (process.env.NODE_ENV === 'development')
  require('electron-debug')();

require('crash-reporter').start({
  productName: 'CampusNet Sync',
  companyName: 'tmpcode',
  submitURL: 'https://pethick.dk',
  autoSubmit: true
});

const menu = MenuBar({
  width: 360,
  height: 250,
  icon: path.join(__dirname, 'logo', 'menuIconTemplate.png'),
  index: `file://${__dirname}/app/index.html`,
  'preload-window': true,
  resizable: false,
  'always-on-top': process.env.NODE_ENV === 'development'
});

menu.on('ready', () => {
  menu.tray.setToolTip('CampusNet Sync');
});
