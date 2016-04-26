import React from 'react';
import Component from 'react-pure-render/component';
import {remote} from 'electron';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {changeDestination} from '../actions/destination';
import {flashMessageFor} from '../actions/flash';

const {dialog, app} = remote;

export const DEFAULT_DESTINATION = app.getPath('documents');

class FolderPicker extends Component {
  static propTypes = {
    chooseFolder: React.PropTypes.bool
  }

  static contextTypes = {
    syncAndOpenFolder: React.PropTypes.func
  };

  selectFolder = () => {
    let path = dialog.showOpenDialog({
      title: 'Create destination',
      // Add `2` to path so that that `PATH/Untitled` is not 
      // suggested in the folder picker.
      defaultPath: this.props.destination || DEFAULT_DESTINATION,
      properties: ['openDirectory', 'createDirectory']
    });
    path = path ? path[0] : undefined; // since path is an array
    if (path === DEFAULT_DESTINATION) {
      path = DEFAULT_DESTINATION + '/CampusNet';
    }
    if (!path && !this.props.destination) {
      this.props.flashMessageFor("Choose a destination to get started", "error");
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
