

# CampusNetSync

This app allows you to sync all your DTU CampusNet files from your menu bar. It is build with [electron](http://electron.atom.io/) so it works on both Mac and Windows! (Linux support would require minimal effort.)

## Download

You can either go the the [website](http://pethick.dk/campusnet-electron) to download it
or browse all version on [github releases](https://github.com/tmpethick/campusnet-electron/releases).

## Scripts

Check out `package.json` for the possible scripts to run. For a quick overview:

To develop run the following commands in two different sessions:

```
npm run watch
npm start
```

## TODO

* [ ] Promote tray icon on Windows.
* [ ] Improve ugly icon on windows.
* [ ] Add update button so it doesn't only check on startup.
* [ ] Add Linux support.
* [ ] Add List recently changed files.
* [ ] Add List courses directly in the app.

## Bugs

* Misplaced menu bar position when not opened through tray icon click event – occures after download: https://github.com/maxogden/menubar/issues/69

## Tests

Currently only the downloader module itself is tested.

## Learnings

This project was meant as a way to play around with electron development with reactJS. lessons learned:

* Reflux/Flux can quickly get out of hand with its actions and reducers. Typechecking with Flow might help.
* Immutables can seem redudant since you end up unpacking them with `toJS`. But they allow for strong `shouldComponentUpdate` check.
* Electron is big..
