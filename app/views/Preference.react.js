import React from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import FolderPicker from './FolderPicker.react';
import SyncIntervalSelect from './SyncIntervalSelect.react';

export default class Preference extends Component {
  render() {
    const state = this.props.location.state;
    const chooseFolder = state ? state.chooseFolder : false;
    return (
      <div>
        <div className="container">
          <label>Choose file destination</label>
          <FolderPicker chooseFolder={chooseFolder}/>
          <label>Sync interval</label>
          <SyncIntervalSelect/>
        </div>
        <div className="footer">
          <div className="button button-block">Sync already!</div>
        </div>
      </div>
    );
  }
}
