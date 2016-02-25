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
    user: PropTypes.object,
    path: PropTypes.string,
    interval: PropTypes.integer,
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

    if (oldProps.interval !== newProps.interval) {
      // remove and add again
    }

    if (shallowEqual(oldProps.user, newProps.user)) {
      const {username, PApassword} = newProps.user || {};
      this.client.initialize(username, PApassword);
      // TODO: clear folder?
    }
    this.syncWithProps(newProps);
  }

  syncWithProps = async (props) => {
    if (props.isAuthenticated && props.path)
      await download(this.client, props.path);
    this.props.syncStop();
  }

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
    user: state.auth.get('user'),
    isAuthenticated: isAuthenticated(state),
    path: state.destination,
    interval: state.sync.get('interval')
  }),
  (dispatch) => bindActionCreators(Actions, dispatch)
)(Sync);
