import React from 'react';
import Component from 'react-pure-render/component';
import Dropdown from './Dropdown.react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {logoutUser} from '../actions/auth';
import {shell, remote, ipcRenderer} from 'electron';
import {isAuthenticated} from '../store/helpers';


class Header extends Component {
  static PropTypes = {
    isAuthenticated: React.PropTypes.bool,
    destination: React.PropTypes.string,
    isSyncing: React.PropTypes.bool
  };

  static contextTypes = {
    syncAndOpenFolder: React.PropTypes.func
  };
  
  openCampusnet() {
    shell.openExternal('https://www.campusnet.dtu.dk/cnnet/');
  }

  checkUpdate = () => {
    ipcRenderer.send('check-update');
  };

  quitApp = () => {
    remote.app.quit();
  };

  render() {
    const isAuth = this.props.isAuthenticated;
    return (
       <div className="header">
          <div className="header-left">
            {isAuth ? [
              <button className="header-action ion-folder" 
                title="Open folder on your computer"
                onClick={this.context.syncAndOpenFolder}
                key="openFolder" />,
              <div className="header-seperator" key="seperator"/>
            ] : ''}
            <button 
                title="Open CampusNet"
              className="header-action ion-earth"
              onClick={this.openCampusnet}/>
          </div>
          <div className="header-title">
            Campusnet
          </div>
          <div className="header-right">
            <Dropdown>
              <Link to="/" onClick={this.props.logoutUser}>
                Logout
              </Link>
              <button className="link" onClick={this.checkUpdate}>Update</button>
              <button className="link" onClick={this.quitApp}>Quit</button>
            </Dropdown>
          </div>
        </div>
    );
  }
}

export default connect(
  (state) => ({
    isAuthenticated: isAuthenticated(state),
    isSyncing: state.get('sync').get('isSyncing'),
    destination: state.get('destination')
  }),
  (dispatch) => bindActionCreators({logoutUser}, dispatch)
)(Header);
