import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';

export default class Spinner extends Component {
  render() {
    return (
      <div className="spinner">
        <div className="spinner-dot spinner-dot-first"/>
        <div className="spinner-dot spinner-dot-second"/>
        <div className="spinner-dot spinner-dot-third"/>
      </div>
    );
  }
}
