import React from 'react';
import electron from 'electron';
import Component from 'react-pure-render/component';

export default class Dropdown extends Component {
  state = {isOpen: false};

  toggleDropdown = () => {
    // If opening
    if (!this.state.isOpen)
      document.addEventListener("click", this.toggleDropdown);
    else
      document.removeEventListener("click", this.toggleDropdown);
    this.setState({isOpen: !this.state.isOpen});
  };

  render() {
    const {isOpen} = this.state;
    return (
      <div className="dropdown">
        <button className="header-action dropdown-button" onClick={this.toggleDropdown}>
          <i className="ion-gear-a"></i>
        </button>
        <div className={'dropdown-list' + (isOpen ? ' open' : '')}>
          <div key="version-number" className="dropdown-list-item">
            <span className="info">
                v{electron.remote.app.getVersion()}
            </span>
          </div>
          {this.props.children.map((child, i) => (
            <div key={i} className="dropdown-list-item">
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
