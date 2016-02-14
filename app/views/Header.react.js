import React from 'react';
import Component from 'react-pure-render/component';
import Dropdown from './Dropdown.react';
import {Link} from 'react-router';

export default class Header extends Component {
  render() {
    return (
       <div className="header">
          <div className="header-left">
            <button className="header-action ion-folder"></button>
            <div className="header-seperator"/>
            <button className="header-action ion-earth"></button>
          </div>
          <div className="header-title">
            Campusnet
          </div>
          <div className="header-right">
            <Dropdown>
              <Link to="">Preference</Link>
              <Link to="">Logout</Link>
              <Link to="">Quit</Link>
            </Dropdown>
          </div>
        </div>
    );
  }
}
