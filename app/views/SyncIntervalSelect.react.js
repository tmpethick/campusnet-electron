import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import moment from 'moment';

import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {changeSyncInterval} from '../actions/sync';
import {flashMessageFor} from '../actions/flash';

export const SYNC_OPTIONS = [
  {name: 'Every 15 min', value: moment.duration(15, 'minutes')},
  {name: 'Every hour', value: moment.duration(1, 'hours')},
  {name: 'Every second hour', value: moment.duration(2, 'hours')},
];

class SyncIntervalSelect extends Component {
  changeSyncInterval = (e) => {
    this.props.changeSyncInterval(parseInt(e.target.value, 10));
    this.props.flashMessageFor('Sync interval was changed', 'success');
  };

  render() {
    return (
      <select name="sync-interval"
        value={this.props.syncInterval}
        onChange={this.changeSyncInterval}>
          {SYNC_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
      </select>
    );
  }
}

export default connect(
  (state) => ({syncInterval: state.sync}),
  (dispatch) => bindActionCreators(
    {changeSyncInterval, flashMessageFor}, dispatch),
)(SyncIntervalSelect);
