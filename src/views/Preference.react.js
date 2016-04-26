import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import FolderPicker from './FolderPicker.react';
import SyncIntervalSelect from './SyncIntervalSelect.react';
import {connect} from 'react-redux';
import Spinner from './Spinner.react';

class Preference extends Component {
  static PropTypes = {
    isSyncing: PropTypes.bool
  }

  static contextTypes = {
    syncAndOpenFolder: PropTypes.func
  };

  render() {
    const state = this.props.location.state;
    const fromLogin = state ? state.fromLogin : false;
    const chooseFolder = fromLogin && !this.props.destination;
    const {syncAndOpenFolder} = this.context;
    return (
      <div>
        <div className="container">
          <FolderPicker chooseFolder={chooseFolder}/>
          <label>Sync interval</label>
          <SyncIntervalSelect/>
        </div>
        <div className="footer">
          <button className="button button-block" 
            onClick={syncAndOpenFolder}
            disabled={this.props.isSyncing}>
              {this.props.isSyncing ? <Spinner/> : "Sync (and open) already!"}
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    isSyncing: state.get('sync').get('isSyncing'),
    destination: state.get('destination')
  })
)(Preference);
