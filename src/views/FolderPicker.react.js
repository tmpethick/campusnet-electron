import React from 'react';
import Component from 'react-pure-render/component';
import {remote} from 'electron';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {changeDestination} from '../actions/destination';
import {flashMessageFor} from '../actions/flash';
import Promise from 'bluebird';
import fs from 'fs';
const {dialog, app} = remote;

// Prepare
Promise.promisifyAll(fs);

// Constants
export const DEFAULT_DESTINATION = app.getPath('documents');

// Helpers
const validFolder = async (path) => {
  const isDir = (await fs.statAsync(path)).isDirectory();
  return isDir && ((await fs.readdirAsync(path)).length === 0);
};

// Component
class FolderPicker extends Component {
  static propTypes = {
    chooseFolder: React.PropTypes.bool
  }

  static contextTypes = {
    syncAndOpenFolder: React.PropTypes.func
  };

  selectFolder = async () => {
    let path = dialog.showOpenDialog({
      title: 'Create destination',
      defaultPath: this.props.destination || DEFAULT_DESTINATION,
      properties: ['openDirectory', 'createDirectory']
    });
    path = path ? path[0] : undefined; // since path is an array
    if (path === DEFAULT_DESTINATION) {
      path = DEFAULT_DESTINATION + '/CampusNet';
    }
    if (!path && !this.props.destination) {
      this.props.flashMessageFor("Choose a destination to get started", "error");
    } else if (path && !(await validFolder(path))) {
      dialog.showErrorBox('The folder has to be empty', 'Please create an empty folder for CampusNetSync. That way you will not accidentally lose any files.');
    } else if (path) {
      this.props.changeDestination(path);
      this.props.flashMessageFor("Destination folder was updated", "success");
    }
    // TODO: alert if it overrides existing folder
  };

  componentDidMount() {
    if (this.props.chooseFolder)
      this.selectFolder();
  }

  render() {
    const path = this.props.destination;
    return (
      <div className="folder-picker-container">
        <button  
          className="folder-picker-dest"
          onClick={path ? this.context.syncAndOpenFolder : this.selectFolder}
          title={path}>
            <div className="folder-picker-icon"></div>
            <span className="folder-picker-path">
              {path ? path : this.renderMissingPath()}
            </span>
        </button>
        <button className="folder-picker-change-btn" 
          onClick={this.selectFolder}>
            {path ? 'Change file destination' : 'Choose file destination'}
        </button>
      </div>
    );
  }

  renderMissingPath() {
    return (
      <span className="text-error">
        No destination selected
      </span>
    );
  }
}

export default connect(
  (state) => ({destination: state.get('destination')}),
  (dispatch) => bindActionCreators(
    {changeDestination,flashMessageFor}, dispatch),
)(FolderPicker);
