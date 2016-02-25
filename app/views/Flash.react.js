import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import { connect } from 'react-redux';
import Immutable from 'immutable';

class Flash extends Component {
  static PropTypes = {
    flash: PropTypes.instanceOf(Immutable.List)
  };

  render() {
    return (
      <div>
        {this.props.flash.map(flash => (
          <div className="flash-container" key={flash.message}>
            <div className={`flash flash-${flash.type}`}>
              {flash.message}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default connect(
  (state) => ({flash: state.flash}),
)(Flash);
