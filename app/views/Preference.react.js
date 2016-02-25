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
    forceCampusnetSync: PropTypes.func
  };

  render() {
    const state = this.props.location.state;
    const fromLogin = state ? state.fromLogin : false;
    const chooseFolder = fromLogin && !this.props.destination;
    const {forceCampusnetSync} = this.context;
    return (
      <div>
        <div className="container">
          <label>Choose file destination</label>
          <FolderPicker chooseFolder={chooseFolder}/>
          <label>Sync interval</label>
          <SyncIntervalSelect/>
        </div>
        <div className="footer">
          <button className="button button-block" 
            onClick={forceCampusnetSync}
            disabled={this.props.isSyncing}>
              {this.props.isSyncing ? <Spinner/> : "Sync already!"}
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    isSyncing: state.sync.get('isSyncing'),
    destination: state.destination
  })
)(Preference);
