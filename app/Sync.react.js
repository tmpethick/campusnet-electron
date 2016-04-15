import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import shallowEqual from 'react-pure-render/shallowEqual';
import Component from 'react-pure-render/component';
import Immutable from 'immutable';
import {isAuthenticated} from './store/helpers';
import CNClient from './campusnet/campusnet-client';
import {download} from './campusnet/downloader';
import mv from 'mv';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from './actions/sync';
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
    syncStart: PropTypes.func,
    syncStop: PropTypes.func
  };

  static childContextTypes = {
    forceCampusnetSync: PropTypes.func
  }

  getChildContext() {
    return {forceCampusnetSync: this.sync};
  }

  componentDidMount() {
    this.client = new CNClient();
    this.changeClient({}, this.props);
  }

  componentWillUpdate(nextProps) {
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
      // TODO: clear folder?
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
    if (this.shouldSync(props))
      await download(this.client, props.path);
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
    interval: state.get('sync').get('interval')
  }),
  (dispatch) => bindActionCreators(Actions, dispatch)
)(Sync);
