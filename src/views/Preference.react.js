import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import FolderPicker from './FolderPicker.react';
import SyncIntervalSelect from './SyncIntervalSelect.react';
import {connect} from 'react-redux';
import Spinner from './Spinner.react';
import open from 'open';

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
          <div className="row">
            <div className="col">
              <label>Sync interval</label>
              <SyncIntervalSelect/>
            </div>
            <div className="col">
              <label>Include old courses</label>
              <button 
                className="button button-block button-light"
                onClick={() => open('https://www.campusnet.dtu.dk/cnnet/archive/archive.aspx')}>
                  Add courses
              </button>
            </div>
          </div>
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
