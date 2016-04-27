

# CampusNetSync

This app allows you to sync all your DTU CampusNet files from your menubar. It is build with [electron](http://electron.atom.io/) so it works on both Mac, Windows and linux!

## Download

How to get your hands on it...

## Structure

## Scripts
...

## TODO

* Updaterer kun på startup ligenu.
* Linux support (skulle være overskueligt)
* Liste over nyligt synkroniseret filer
* Minor: Liste over kurser direkte i appen

Bugs
* Menubar position without clicking the tray icon – occures after download: https://github.com/maxogden/menubar/issues/69

## Tests


## Learnings

This project was meant as a way to play around with electron development with reactJS. lessons learned:

* overly complicated with reflux/flux (actions and reducers)
* electron is big..

```
npm run build
electron-release --app release/CampusNetSync-darwin-x64/CampusNetSync.app
```
