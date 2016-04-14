import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Component from 'react-pure-render/component';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Flash extends Component {
  static PropTypes = {
    flash: PropTypes.instanceOf(Immutable.List)
  };

  render() {
    return (
      <div>
        <ReactCSSTransitionGroup 
          transitionName="flash-container" 
          transitionEnterTimeout={200} 
          transitionLeaveTimeout={200}>
            {this.props.flash.map(flash => (
              <div className="flash-container" key={flash.get('id')}>
                <div className={`flash flash-${flash.get('type')}`}>
                  {flash.get('message')}
                </div>
              </div>
            ))}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default connect(
  (state) => ({flash: state.get('flash')}),
)(Flash);
