import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import querystring from 'querystring';
import bluebird from 'bluebird';
import FormData from 'form-data';
import mkdirp from 'mkdirp';
import {xmlParser, getFilesFromXML} from './xmlParser';

fetch.Promise = bluebird;

const AUTH_URL = 'https://auth.dtu.dk/dtu/mobilapp.jsp';
const BASE_URL = 'https://www.campusnet.dtu.dk/data/CurrentUser';
const appName = 'campusnet-electron';
const appToken = 'b6d080a8-d6a1-4355-bc79-fc45657cb8e1';

export default class CampusNetClient {
  constructor(username, password='', PApassword='') {
    this.username = username;
    this.password = password;
    this.PApassword = PApassword;
  }

  login() {
    let form = new FormData();
    form.append('username', this.username);
    form.append('password', this.password);
    return this.request(AUTH_URL, {
      method: 'post',
      body: form
    }).then($ => {
        // new password that can be stored..
        this.PApassword = $('LimitedAccess').attr('Password');
        if (!this.PApassword) {
          // "<xml><BlockedAccess Ip="62.61.130.35" Reason="IpWrongUserCredentials" TryAgainIn="00:00:01.5312088"/></xml>"
          throw new Error('PA password not found');
        }
        return true;
      });

  }

  authRequest(url, options = {}, parse=true) {
    const auth = Buffer(`${this.username}:${this.PApassword}`, 'binary')
                    .toString('base64');
    return this.request(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'X-appname': appName,
        'X-token': appToken
      }
    }, parse);
  }

  request(url, options = {}, parse=true) {
    let promise = fetch(url, Object.assign({
      method: 'get'
    }, options))

    if (parse)
      // TODO: error handling on Error tagName
      promise = promise
        .then(res => res.text())
        .then(content => xmlParser(content));

    return promise;
  }

  getElements() {
    return this.authRequest(
      `${BASE_URL}/Elements`
    ).then(function($) {
      return $('Element').toArray().map(el => {
        const $el = $(el);
        return {
          parentId: $el.attr('ParentId'),
          id: $el.attr('Id'),
          name: $el.attr('Name'),
          contextName: $el.attr('ContextName')
        };
      });
    });
  }

  getElementFiles(elementId) {
    const url = `${BASE_URL}/Elements/${elementId}/Files`;
    return this.authRequest(url)
      .then($ => getFilesFromXML($))
  }

  downloadFile(elementId, fileId, downloadPath) {
    const url = `${BASE_URL}/Elements/${elementId}/Files/${fileId}/Bytes`;
    return this.authRequest(url, {}, false)
      .then(res => {
        let dirName = path.dirname(downloadPath);
        return Promise.all([res, createDir(dirName)]);
      })
      .then(([res]) => {
        return new Promise((resolve, reject) => {
          let wstream = fs.createWriteStream(downloadPath);
          res.body.on('end', () => {
            wstream.end();
            resolve();
          });
          res.body.on('error', err => reject());
          res.body.pipe(wstream);
        });
      });
  }
}

export const createDir = function(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err) => {
      if (err) reject(err);
      else resolve();
    });
    // for some reason the following async version doesn't work..
    /*fs.lstat(path, (err, stats) => {
      if (err) {
        fs.mkdir(path, (err) => {
          if (err) reject(err);
          else resolve();
        })
      }
    });*/
  });
};
