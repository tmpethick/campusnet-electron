const GhReleases = require('electron-gh-releases')
const electron = require('electron');
const dialog = electron.dialog;

// Updater
const createUpdater = app => {
  const updater = new GhReleases({
    repo: 'tmpethick/campusnet-electron',
    currentVersion: app.getVersion()
  });

  const checkUpdate = () => {
    // Check for updates
    // `status` returns true if there is a new update available
    updater.check((err, status) => {
      if (!err && status) {
        updater.download();
      }
    });
  };

  // https://github.com/electron/electron/issues/4306
  // hack for now until we use electron ^v0.37.7.
  const args = process.argv[1];
  if (args && args.startsWith('--squirrel')) {
      setTimeout(()=> {
          checkUpdate();
      }, 3000)
  } else {
      checkUpdate();
  }

  // When an update has been downloaded
  updater.on('update-downloaded', (info) => {
    dialog.showMessageBox({
      type: 'question',
      buttons: ['Update and Restart app', 'Cancel'],
      title: 'Update Available for CampusNetSync',
      cancelId: 99,
      message: `There is an update available for CampusNetSync.\
                Would you like to update CampusNetSync now?`
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
