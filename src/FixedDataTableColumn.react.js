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
     * className for this column's header cell.
     */
    headerClassName: PropTypes.string,

    /**
     * className for this column's footer cell.
     */
    footerClassName: PropTypes.string,

    /**
     * className for each of this column's data cells.
     */
    cellClassName: PropTypes.string,

    /**
     * The cell renderer that returns React-renderable content for table cell.
     * ```
     * function(
     *   cellData: any,
     *   cellDataKey: string,
     *   rowData: object,
     *   rowIndex: number,
     *   columnData: any,
     *   width: number
     * ): ?$jsx
     * ```
     */
    cellRenderer: PropTypes.func,

    /**
     * The getter `function(string_cellDataKey, object_rowData)` that returns
     * the cell data for the `cellRenderer`.
     * If not provided, the cell data will be collected from
     * `rowData[cellDataKey]` instead. The value that `cellDataGetter` returns
     * will be used to determine whether the cell should re-render.
     */
    cellDataGetter: PropTypes.func,

    /**
     * The key to retrieve the cell data from the data row. Provided key type
     * must be either `string` or `number`. Since we use this
     * for keys, it must be specified for each column.
     */
    dataKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,

    /**
     * Controls if the column is fixed when scrolling in the X axis.
     */
    fixed: PropTypes.bool,

    /**
     * The cell renderer that returns React-renderable content for table column
     * header.
     * ```
     * function(
     *   label: ?string,
     *   cellDataKey: string,
     *   columnData: any,
     *   rowData: array<?object>,
     *   width: number
     * ): ?$jsx
     * ```
     */
    headerRenderer: PropTypes.func,

    /**
     * The cell renderer that returns React-renderable content for table column
     * footer.
     * ```
     * function(
     *   label: ?string,
     *   cellDataKey: string,
     *   columnData: any,
     *   rowData: array<?object>,
     *   width: number
     * ): ?$jsx
     * ```
     */
    footerRenderer: PropTypes.func,

    /**
     * Bucket for any data to be passed into column renderer functions.
     */
    columnData: PropTypes.object,

    /**
     * The column's header label.
     */
    label: PropTypes.string,

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
