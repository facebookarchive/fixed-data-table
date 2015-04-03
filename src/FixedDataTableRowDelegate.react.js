/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableRowDelegate.react
 * @typechecks
 */

var React = require('React');

var PropTypes = React.PropTypes;

/**
 * Component that defines the attributes of table column.
 */
var FixedDataTableRowDelegate = React.createClass({
  statics: {
    __TableRowDelegate__: true
  },

  propTypes: {
    /**
     * Callback that is called when a row is clicked.
     */
    onClick: PropTypes.func,

    /**
     * Callback that is called when context menu is going to open
     * above a row.
     */
    onContextMenu: PropTypes.func,

    /**
     * Callback that is called when a row is double clicked.
     */
    onDoubleClick: PropTypes.func,

    /**
     * Callback that is called when a row is being dragged.
     */
    onDrag: PropTypes.func,

    /**
     * Callback that is called when a drag operation is being ended
     * above a row.
     */
    onDragEnd: PropTypes.func,

    /**
     * Callback that is called when a dragged target enters a row.
     */
    onDragEnter: PropTypes.func,

    /**
     * Callback that is called when a dragged target exits a row.
     */
    onDragExit: PropTypes.func,

    /**
     * Callback that is called when a dragged target leaves a row.
     */
    onDragLeave: PropTypes.func,

    /**
     * Callback that is called when a dragged target is being dragged
     * over a row.
     */
    onDragOver: PropTypes.func,

    /**
     * Callback that is called when the user starts dragging a row.
     */
    onDragStart: PropTypes.func,

    /**
     * Callback that is called when a dragged target is dropped on a row.
     */
    onDrop: PropTypes.func,

    /**
     * Callback that is called mouse down event happens above a row.
     */
    onMouseDown: PropTypes.func,

    /**
     * Callback that is called when the mouse enters a row.
     */
    onMouseEnter: PropTypes.func,

    /**
     * Callback that is called when the mouse leaves a row.
     */
    onMouseLeave: PropTypes.func,

    /**
     * Callback that is called when the mouse is moving above a row.
     */
    onMouseMove: PropTypes.func,

    /**
     * Callback that is called when the mouse moves out of a row.
     */
    onMouseOut: PropTypes.func,

    /**
     * Callback that is called when the mouse is moving above a row.
     */
    onMouseOver: PropTypes.func,

    /**
     * Callback that is called when mouse up event happens above a row.
     */
    onMouseUp: PropTypes.func,

    /**
     * If specified, attribute `draggable={bool|function}` will be added to
     * nodes of rows.
     *
     * If provided function, row index and row data will be passed in as
     * parameters, and supposed to return a bool.
     */
    draggable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),

  },

  render() {
    if (__DEV__) {
      throw new Error(
        'Component <FixedDataTableRowDelegate /> should never render'
      );
    }
    return null;
  },
});

module.exports = FixedDataTableRowDelegate;
