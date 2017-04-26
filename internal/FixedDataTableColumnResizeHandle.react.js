/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * This is to be used with the FixedDataTable. It is a read line
 * that when you click on a column that is resizable appears and allows
 * you to resize the corresponding column.
 *
 * @providesModule FixedDataTableColumnResizeHandle.react
 * @typechecks
 */

'use strict';

var DOMMouseMoveTracker = require('./DOMMouseMoveTracker');
var Locale = require('./Locale');
var React = require('./React');
var ReactComponentWithPureRenderMixin = require('./ReactComponentWithPureRenderMixin');

var clamp = require('./clamp');
var cx = require('./cx');

var PropTypes = React.PropTypes;

var FixedDataTableColumnResizeHandle = React.createClass({
  displayName: 'FixedDataTableColumnResizeHandle',

  mixins: [ReactComponentWithPureRenderMixin],

  propTypes: {
    visible: PropTypes.bool.isRequired,

    /**
     * This is the height of the line
     */
    height: PropTypes.number.isRequired,

    /**
     * Offset from left border of the table, please note
     * that the line is a border on diff. So this is really the
     * offset of the column itself.
     */
    leftOffset: PropTypes.number.isRequired,

    /**
     * Height of the clickable region of the line.
     * This is assumed to be at the top of the line.
     */
    knobHeight: PropTypes.number.isRequired,

    /**
     * The line is a border on a diff, so this is essentially
     * the width of column.
     */
    initialWidth: PropTypes.number,

    /**
     * The minimum width this dragger will collapse to
     */
    minWidth: PropTypes.number,

    /**
     * The maximum width this dragger will collapse to
     */
    maxWidth: PropTypes.number,

    /**
     * Initial click event on the header cell.
     */
    initialEvent: PropTypes.object,

    /**
     * When resizing is complete this is called.
     */
    onColumnResizeEnd: PropTypes.func,

    /**
     * Column key for the column being resized.
     */
    columnKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  },

  getInitialState: function getInitialState() /*object*/{
    return {
      width: 0,
      cursorDelta: 0
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps( /*object*/newProps) {
    if (newProps.initialEvent && !this._mouseMoveTracker.isDragging()) {
      this._mouseMoveTracker.captureMouseMoves(newProps.initialEvent);
      this.setState({
        width: newProps.initialWidth,
        cursorDelta: newProps.initialWidth
      });
    }
  },

  componentDidMount: function componentDidMount() {
    this._mouseMoveTracker = new DOMMouseMoveTracker(this._onMove, this._onColumnResizeEnd, document.body);
  },

  componentWillUnmount: function componentWillUnmount() {
    this._mouseMoveTracker.releaseMouseMoves();
    this._mouseMoveTracker = null;
  },

  render: function render() /*object*/{
    var style = {
      width: this.state.width,
      height: this.props.height
    };
    if (Locale.isRTL()) {
      style.right = this.props.leftOffset;
    } else {
      style.left = this.props.leftOffset;
    }
    return React.createElement(
      'div',
      {
        className: cx({
          'fixedDataTableColumnResizerLineLayout/main': true,
          'fixedDataTableColumnResizerLineLayout/hiddenElem': !this.props.visible,
          'public/fixedDataTableColumnResizerLine/main': true
        }),
        style: style },
      React.createElement('div', {
        className: cx('fixedDataTableColumnResizerLineLayout/mouseArea'),
        style: { height: this.props.height }
      })
    );
  },

  _onMove: function _onMove( /*number*/deltaX) {
    if (Locale.isRTL()) {
      deltaX = -deltaX;
    }
    var newWidth = this.state.cursorDelta + deltaX;
    var newColumnWidth = clamp(newWidth, this.props.minWidth, this.props.maxWidth);

    // Please note cursor delta is the different between the currently width
    // and the new width.
    this.setState({
      width: newColumnWidth,
      cursorDelta: newWidth
    });
  },

  _onColumnResizeEnd: function _onColumnResizeEnd() {

    this._mouseMoveTracker.releaseMouseMoves();
    this.props.onColumnResizeEnd(this.state.width, this.props.columnKey);
  }
});

module.exports = FixedDataTableColumnResizeHandle;