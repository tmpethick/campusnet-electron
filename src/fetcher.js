import fetch from 'node-fetch';
import querystring from 'querystring';
import bluebird from 'bluebird';
import FormData from 'form-data';
import {xmlParser} from './xmlParser';

fetch.Promise = bluebird;

const LOGIN_URL = 'https://auth.dtu.dk/dtu/mobilapp.jsp';

export default class Fetcher {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  login() {
    let form = new FormData();
    form.append('username', this.username);
    form.append('password', this.password);
    return fetch(LOGIN_URL, {
      method: 'post',
      body: form
    }).then(function(res) {
        return res.text();
      }).then(function(content) {
        return xmlParser({html: content});
      }).then((window) => {
        // new password that can be stored..
        this.PApassword = window.document
          .querySelector('LimitedAccess')
          .getAttribute('Password');
        if (!this.PApassword)
          throw new Error('PA password not found');
        return true;
      });

  }

  request(url) {
    const appName = 'campusnet-electron';
    const appToken = 'b6d080a8-d6a1-4355-bc79-fc45657cb8e1';
    const auth = Buffer(`${this.username}:${this.PApassword}`, 'binary')
                    .toString('base64');
    return fetch(url, {
      method: 'get',
      headers: {
        'Authorization': `Basic ${auth}`,
        'X-appname': appName,
        'X-token': appToken
      }
    });
  }

  getCourses() {
    return this.request(
      'https://www.campusnet.dtu.dk/data/CurrentUser/Elements'
    ).then(function(res) {
        return res.text();
    }).then(function (content) {
      return xmlParser({html: content});
    }).then(function (w) {
      debugger;

      return Array.prototype.map.call(
        w.document.querySelectorAll('Element'),
        el => el.attributes
      );
    });
  }

  getCourseFiles(course) {

  }

  getFilesForCourses(courses) {

  }
}
