/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableColumn.react
 * @typechecks
 */

var React = require('React');

var {PropTypes} = React;

/**
 * Component that defines the attributes of table column.
 */
var FixedDataTableColumn = React.createClass({
  statics: {
    __TableColumn__: true
  },

  propTypes: {
    /**
     * The horizontal alignment of the table cell content.
     */
    align: PropTypes.oneOf(['left', 'center', 'right']),

    /**
     * Controls if the column is fixed when scrolling in the X axis.
     */
    fixed: PropTypes.bool,

    /**
     * Header Cell
     * TODO: node or string.
     * If its a node, use the node. Otherwise, just render a basic string.
     * (renderToString)
     */
    header: PropTypes.node,

    /**
     * Define the cell node
     */
    cell: PropTypes.node,

    /**
     * Footer Cell
     * @type {[type]}
     */
    footer: PropTypes.node,

    /**
     * The pixel width of the column.
     */
    width: PropTypes.number.isRequired,

    /**
     * If this is a resizable column this is its minimum pixel width.
     */
    minWidth: PropTypes.number,

    /**
     * If this is a resizable column this is its maximum pixel width.
     */
    maxWidth: PropTypes.number,

    /**
     * The grow factor relative to other columns. Same as the flex-grow API
     * from http://www.w3.org/TR/css3-flexbox/. Basically, take any available
     * extra width and distribute it proportionally according to all columns'
     * flexGrow values. Defaults to zero (no-flexing).
     */
    flexGrow: PropTypes.number,

    /**
     * Whether the column can be resized with the
     * FixedDataTableColumnResizeHandle. Please note that if a column
     * has a flex grow, once you resize the column this will be set to 0.
     *
     * This property only provides the UI for the column resizing. If this
     * is set to true, you will need ot se the onColumnResizeEndCallback table
     * property and render your columns appropriately.
     */
    isResizable: PropTypes.bool,

    /**
     * Experimental feature
     * Whether cells in this column can be removed from document when outside
     * of viewport as a result of horizontal scrolling.
     * Setting this property to true allows the table to not render cells in
     * particular column that are outside of viewport for visible rows. This
     * allows to create table with many columns and not have vertical scrolling
     * performance drop.
     * Setting the property to false will keep previous behaviour and keep
     * cell rendered if the row it belongs to is visible.
     */
    allowCellsRecycling: PropTypes.bool,
  },

  getDefaultProps() /*object*/ {
    return {
      allowCellsRecycling: false,
      fixed: false,
    };
  },

  render() {
    if (__DEV__) {
      throw new Error(
        'Component <FixedDataTableColumn /> should never render'
      );
    }
    return null;
  },
});

module.exports = FixedDataTableColumn;
