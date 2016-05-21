import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import shallowEqual from 'react-pure-render/shallowEqual';
import Component from 'react-pure-render/component';
import Immutable from 'immutable';
import {shell, remote} from 'electron';
import {isAuthenticated} from './store/helpers';
import CNClient from './campusnet/campusnet-client';
import {download} from './campusnet/downloader';
import CampusError, {VALIDATION_ERROR} from './campusnet/errors';
import fs from 'fs';
import path from 'path';
import mv from 'mv';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from './actions/sync';
import {login} from './actions/auth';
import {CronJob} from 'cron';

function moveFolder(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    mv(oldPath, newPath, {mkdirp: true}, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

class Sync extends Component {
  static PropTypes = {
    user: PropTypes.instanceOf(Immutable.Map).isRequired,
    path: PropTypes.string,
    interval: PropTypes.string,
    isSyncing: PropTypes.bool,
    syncStart: PropTypes.func,
    syncStop: PropTypes.func,
    login: PropTypes.func
  };

  static childContextTypes = {
    forceCampusnetSync: PropTypes.func,
    syncAndOpenFolder: PropTypes.func
  }

  getChildContext() {
    return {
      forceCampusnetSync: this.sync,
      syncAndOpenFolder: this.openFolder
    };
  }

  openFolder = () => {
    if (this.props.path) {
      if (!this.props.isSyncing) this.sync();
      const subPaths = fs.readdirSync(this.props.path);
      const path_ = subPaths.length > 0 ? 
        path.join(this.props.path, subPaths[0]) 
        : this.props.path;
      console.log(path_);
      shell.showItemInFolder(path_);
      remote.getCurrentWindow().hide();
    }
  };

  componentDidMount() {
    const {username, PApassword} = this.props.user.toJS();
    this.client = new CNClient();
    this.client.initialize(username, PApassword);
  }

  componentWillUpdate(nextProps) {
    // Don't update if only sync status has changed.
    if (nextProps.isSyncing !== this.props.isSyncing)
      return;
    this.changeClient(this.props, nextProps);
  }

  async changeClient(oldProps, newProps) {
    this.props.syncStart();

    if (oldProps.path && newProps.path
        && oldProps.path !== newProps.path) {
        await moveFolder(oldProps.path, newProps.path);
    }

    if (!oldProps.user.equals(newProps.user)) {
      const {username, PApassword} = newProps.user.toJS();
      this.client.initialize(username, PApassword);
    }

    if (this.shouldSync(newProps)) {
      this.startCronJob(newProps.interval);
    }

    // Stop cron job if logged out
    if (!newProps.isAuthenticated) {
      this.stopCronJob();
    }

    this.syncWithProps(newProps);
  }

  startCronJob = (interval) => {
    this.stopCronJob();    
    if (interval)
      this._cronJob = new CronJob({
        cronTime: interval,
        onTick: () => this.sync,
        start: true
      });
  };

  stopCronJob = () => {
    this._cronJob && this._cronJob.stop();
  };

  syncWithProps = async (props) => {
    if (this.shouldSync(props)) {
      try {
        await download(this.client, props.path);
      } catch (err) {
        if (err.type === VALIDATION_ERROR) {
          const username = props.user.get('username');
          const password = props.user.get('password');
          this.props.login({username, password});
        }
      }
    }
    this.props.syncStop();
  }

  shouldSync = (props) => !!(props.isAuthenticated && props.path);

  sync = () => {
    this.props.syncStart();
    this.syncWithProps(this.props);
  };

  render() {
    return <div>{this.props.children}</div>;
  }
}

export default connect(
  (state) => ({
    user: state.get('auth').get('user') || Immutable.Map(),
    isAuthenticated: isAuthenticated(state),
    path: state.get('destination'),
    interval: state.get('sync').get('interval'),
    isSyncing: state.get('sync').get('isSyncing')
  }),
  (dispatch) => bindActionCreators({login, ...Actions}, dispatch)
)(Sync);
