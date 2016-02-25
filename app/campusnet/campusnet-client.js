import fs from 'fs';
import path from 'path';
import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
import Bluebird from 'bluebird';
import FormData from 'form-data';
import mkdirp from 'mkdirp';
import {xmlParser, getFilesFromXML} from './xmlParser';
import CampusError, {VALIDATION_ERROR, UNKNOWN_ERROR} from './errors';

fetch.Promise = Bluebird;

const AUTH_URL = 'https://auth.dtu.dk/dtu/mobilapp.jsp';
const BASE_URL = 'https://www.campusnet.dtu.dk/data/CurrentUser';
const appName = 'campusnet-electron';
const appToken = 'b6d080a8-d6a1-4355-bc79-fc45657cb8e1';

export default class CNClient {
  constructor(username, PApassword='') {
    this.initialize(username, PApassword);
  }

  initialize(username, PApassword) {
    this.username = username;
    this.PApassword = PApassword;    
  }

  static login(username, password) {
    let form = new FormData();
    form.append('username', username);
    form.append('password', password);
    return CNClient.request(AUTH_URL, {
      method: 'post',
      body: form
    }).then($ => {
        if ($('BlockedAccess').length)
          throw new CampusError(
            'Username and password did not match', 
            VALIDATION_ERROR);

        // new password that can be stored..
        const PApassword = $('LimitedAccess').attr('Password');
        
        if (!PApassword) {
          throw new CampusError('Could not authenticate', UNKNOWN_ERROR);
        }
        
        return PApassword;
      });

  }

  authRequest(url, options = {}, parse=true) {
    const auth = Buffer(`${this.username}:${this.PApassword}`, 'binary')
                    .toString('base64');
    return CNClient.request(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'X-appname': appName,
        'X-token': appToken
      }
    }, parse);
  }

  static request(url, options = {}, parse=true) {
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
  });
};
