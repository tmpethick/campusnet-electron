import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import {remote} from 'electron';

const {dialog, app} = remote;

export default class Preference extends Component {
  selectFolder = () => {
    let path = dialog.showSaveDialog({
      title: 'Create destination',
      defaultPath: app.getPath('documents') + '/CampusNet',
      properties: ['createDirectory']
    });
    // TODO: alert if it overrides existing folder
  };

  render() {
    return (
      <div>
        <div className="container">
          <label>Choose file destination</label>
          <div className="folder-picker-container" onClick={this.selectFolder}>
            <div className="folder-picker-icon"></div>
            <span className="folder-picker-path">.../Username/path/to/CampusNet</span>
          </div>
          <label>Sync interval</label>
          <select name="sync-interval" id="">
            <option value="">Every hour</option>
          </select>
        </div>
        <div className="footer">
          <div className="button button-block">Sync already!</div>
        </div>
      </div>
    );
  }
}
