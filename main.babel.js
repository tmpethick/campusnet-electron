"use strict";

import MenuBar from 'menubar';

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
  index: `file://${__dirname}/app/index.html`,
  'always-on-top': true // TODO: remove
});

menu.on('ready', () => {
  menu.tray.setToolTip('CampusNet Sync');
  menu.showWindow(); // TODO: remove
});
