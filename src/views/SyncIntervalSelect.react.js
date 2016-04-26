import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';

import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {changeSyncInterval} from '../actions/sync';
import {flashMessageFor} from '../actions/flash';

export const SYNC_OPTIONS = [
  {name: 'Never', value: ''},
  {name: 'Every 15 min', value: '0 */15 * * * *'},
  {name: 'Every hour', value: '0 0 */1 * * *'},
  {name: 'Every second hour', value: '0 0 */2 * * *'},
];

class SyncIntervalSelect extends Component {
  changeSyncInterval = (e) => {
    this.props.changeSyncInterval(e.target.value);
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
  (state) => ({syncInterval: state.get('sync').get('interval')}),
  (dispatch) => bindActionCreators(
    {changeSyncInterval, flashMessageFor}, dispatch),
)(SyncIntervalSelect);
