/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

var React = require('react');
var ZyngaScroller = require('../ZyngaScroller');
var TouchableArea = require('./TouchableArea');

var PropTypes = React.PropTypes;

function isTouchDevice() {
  return 'ontouchstart' in document.documentElement // works on most browsers
      || 'onmsgesturechange' in window; // works on ie10
};

var ExampleTouchWrapper = React.createClass({
  propTypes: {
    tableWidth: PropTypes.number.isRequired,
    tableHeight: PropTypes.number.isRequired,
  },

  getInitialState() {
    return {
      left: 0,
      top: 0,
      contentHeight: 0,
      contentWidth: 0,
    };
  },

  componentWillMount() {
    this.scroller = new ZyngaScroller(this._handleScroll);
  },

  render() {
    if (!isTouchDevice()) {
      return React.cloneElement(this.props.children, {
        height: this.props.tableHeight,
        width: this.props.tableWidth,
      });
    }

    var example = React.cloneElement(this.props.children, {
      onContentHeightChange: this._onContentHeightChange,
      scrollLeft: this.state.left,
      scrollTop: this.state.top,
      height: this.props.tableHeight,
      width: this.props.tableWidth,
      overflowX: 'hidden',
      overflowY: 'hidden',
    });

    return (
      <TouchableArea scroller={this.scroller}>
        {example}
      </TouchableArea>
    );
  },

  _onContentHeightChange(contentHeight) {
    this.scroller.setDimensions(
      this.props.tableWidth,
      this.props.tableHeight,
      Math.max(600, this.props.tableWidth),
      contentHeight
    );
  },

  _handleScroll(left, top) {
    this.setState({
      left: left,
      top: top
    });
  }
});

module.exports = ExampleTouchWrapper;
