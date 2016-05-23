const GhReleases = require('electron-gh-releases')
const electron = require('electron');
const dialog = electron.dialog;

// Updater
const createUpdater = app => {
  const updater = new GhReleases({
    repo: 'tmpethick/campusnet-electron',
    currentVersion: app.getVersion()
  });

  // Check for updates
  // `status` returns true if there is a new update available
  updater.check((err, status) => {
    if (!err && status) {
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

  return updater;
};

module.exports = createUpdater;
