import React from 'react';
import Component from 'react-pure-render/component';
import {remote} from 'electron';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {changeDestination} from '../actions/destination';
import {flashMessageFor} from '../actions/flash';

const {dialog, app} = remote;

export const DEFAULT_DESTINATION = app.getPath('documents') + '/CampusNet';

class FolderPicker extends Component {
  static propTypes = {
    chooseFolder: React.PropTypes.bool
  }

  selectFolder = () => {
    let path = dialog.showSaveDialog({
      title: 'Create destination',
      defaultPath: this.props.destination || DEFAULT_DESTINATION,
      properties: ['createDirectory']
    });
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
      <button className="folder-picker-container" 
        onClick={this.selectFolder}
        title={path}>
          <div className="folder-picker-icon"></div>
          <span className="folder-picker-path">
            {path ? path : this.renderMissingPath()}
          </span>
      </button>
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
  (state) => ({destination: state.destination}),
  (dispatch) => bindActionCreators(
    {changeDestination,flashMessageFor}, dispatch),
)(FolderPicker);
