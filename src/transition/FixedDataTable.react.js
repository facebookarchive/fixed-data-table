/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTable.react
 */

 /**
  * TRANSITION SHIM
  * This acts to provide an intermediate mapping from the old API to the new API
  *
  * Remove this entire file and replace the two lines in FixedDataTableRoot
  * when ready to continue to the new API.
  */

'use strict';

var React = require('React');

var ReactChildren = React.Children;

var {PropTypes} = React;

// New Table API
var Table = require('FixedDataTableNew.react');
var Column = require('FixedDataTableColumnNew.react');
var ColumnGroup = require('FixedDataTableColumnGroupNew.react');

// Transition Cell
var TransitionCell = require('FixedDataTableCellTransition.react');

var NEXT_VERSION = '0.6.0';
var DOCUMENTATION_URL = 'http://facebook.github.io/fixed-data-table';

var EMPTY_OBJECT = {};

/**
 * Notify in console that some prop has been deprecated.
 */
var notified = {};
function notifyDeprecated(prop, reason) {
  if (__DEV__) {
    if (!notified[prop]) {
      console.warn(
        prop + ' will be DEPRECATED in versions ' +
        NEXT_VERSION + ' of FixedDataTable and beyond. \n' +
        reason + '\n' +
        'Read the docs at: ' + DOCUMENTATION_URL
      );
      notified[prop] = true;
    }
  }
}

/**
 * Data grid component with fixed or scrollable header and columns.
 *
 * This is currently in a transition mode, as the new API is used.
 * DEPRECATED endpoints work, but will not be supported in later versions.
 *
 * The layout of the data table is as follows:
 *
 * ```
 * +---------------------------------------------------+
 * | Fixed Column Group    | Scrollable Column Group   |
 * | Header                | Header                    |
 * |                       |                           |
 * +---------------------------------------------------+
 * |                       |                           |
 * | Fixed Header Columns  | Scrollable Header Columns |
 * |                       |                           |
 * +-----------------------+---------------------------+
 * |                       |                           |
 * | Fixed Body Columns    | Scrollable Body Columns   |
 * |                       |                           |
 * +-----------------------+---------------------------+
 * |                       |                           |
 * | Fixed Footer Columns  | Scrollable Footer Columns |
 * |                       |                           |
 * +-----------------------+---------------------------+
 * ```
 *
 * - Fixed Column Group Header: These are the headers for a group
 *   of columns if included in the table that do not scroll
 *   vertically or horizontally.
 *
 * - Scrollable Column Group Header: The header for a group of columns
 *   that do not move while scrolling vertically, but move horizontally
 *   with the horizontal scrolling.
 *
 * - Fixed Header Columns: The header columns that do not move while scrolling
 *   vertically or horizontally.
 *
 * - Scrollable Header Columns: The header columns that do not move
 *   while scrolling vertically, but move horizontally with the horizontal
 *   scrolling.
 *
 * - Fixed Body Columns: The body columns that do not move while scrolling
 *   horizontally, but move vertically with the vertical scrolling.
 *
 * - Scrollable Body Columns: The body columns that move while scrolling
 *   vertically or horizontally.
 */
var TransitionTable = React.createClass({
  propTypes: {
    /**
     * Pixel width of table. If all columns do not fit,
     * a horizontal scrollbar will appear.
     */
    width: PropTypes.number.isRequired,

    /**
     * Pixel height of table. If all rows do not fit,
     * a vertical scrollbar will appear.
     *
     * Either `height` or `maxHeight` must be specified.
     */
    height: PropTypes.number,

    /**
     * Maximum pixel height of table. If all rows do not fit,
     * a vertical scrollbar will appear.
     *
     * Either `height` or `maxHeight` must be specified.
     */
    maxHeight: PropTypes.number,

    /**
     * Pixel height of table's owner, this is used in a managed scrolling
     * situation when you want to slide the table up from below the fold
     * without having to constantly update the height on every scroll tick.
     * Instead, vary this property on scroll. By using `ownerHeight`, we
     * over-render the table while making sure the footer and horizontal
     * scrollbar of the table are visible when the current space for the table
     * in view is smaller than the final, over-flowing height of table. It
     * allows us to avoid resizing and reflowing table when it is moving in the
     * view.
     *
     * This is used if `ownerHeight < height` (or `maxHeight`).
     */
    ownerHeight: PropTypes.number,

    overflowX: PropTypes.oneOf(['hidden', 'auto']),
    overflowY: PropTypes.oneOf(['hidden', 'auto']),

    /**
     * Number of rows in the table.
     */
    rowsCount: PropTypes.number.isRequired,

    /**
     * Pixel height of rows unless `rowHeightGetter` is specified and returns
     * different value.
     */
    rowHeight: PropTypes.number.isRequired,

    /**
     * If specified, `rowHeightGetter(index)` is called for each row and the
     * returned value overrides `rowHeight` for particular row.
     */
    rowHeightGetter: PropTypes.func,

    /**
     * DEPRECATED
     *
     * To get rows to display in table, `rowGetter(index)`
     * is called. `rowGetter` should be smart enough to handle async
     * fetching of data and return temporary objects
     * while data is being fetched.
     */
    rowGetter: PropTypes.func,

    /**
     * To get any additional CSS classes that should be added to a row,
     * `rowClassNameGetter(index)` is called.
     */
    rowClassNameGetter: PropTypes.func,

    /**
     * Pixel height of the column group header.
     */
    groupHeaderHeight: PropTypes.number,

    /**
     * Pixel height of header.
     */
    headerHeight: PropTypes.number.isRequired,

    /**
     * DEPRECATED
     *
     * Function that is called to get the data for the header row.
     * If the function returns null, the header will be set to the
     * Column's label property.
     */
    headerDataGetter: PropTypes.func,

    /**
     * Pixel height of footer.
     */
    footerHeight: PropTypes.number,

    /**
     * DEPRECATED - use footerDataGetter instead.
     * Data that will be passed to footer cell renderers.
     */
    footerData: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),

    /**
     * DEPRECATED
     *
     * Function that is called to get the data for the footer row.
     */
    footerDataGetter: PropTypes.func,

    /**
     * Value of horizontal scroll.
     */
    scrollLeft: PropTypes.number,

    /**
     * Index of column to scroll to.
     */
    scrollToColumn: PropTypes.number,

    /**
     * Value of vertical scroll.
     */
    scrollTop: PropTypes.number,

    /**
     * Index of row to scroll to.
     */
    scrollToRow: PropTypes.number,

    /**
     * Callback that is called when scrolling starts with current horizontal
     * and vertical scroll values.
     */
    onScrollStart: PropTypes.func,

    /**
     * Callback that is called when scrolling ends or stops with new horizontal
     * and vertical scroll values.
     */
    onScrollEnd: PropTypes.func,

    /**
     * Callback that is called when `rowHeightGetter` returns a different height
     * for a row than the `rowHeight` prop. This is necessary because initially
     * table estimates heights of some parts of the content.
     */
    onContentHeightChange: PropTypes.func,

    /**
     * Callback that is called when a row is clicked.
     */
    onRowClick: PropTypes.func,

    /**
     * Callback that is called when a row is double clicked.
     */
    onRowDoubleClick: PropTypes.func,

    /**
     * Callback that is called when a mouse-down event happens on a row.
     */
    onRowMouseDown: PropTypes.func,

    /**
     * Callback that is called when a mouse-enter event happens on a row.
     */
    onRowMouseEnter: PropTypes.func,

    /**
     * Callback that is called when a mouse-leave event happens on a row.
     */
    onRowMouseLeave: PropTypes.func,

    /**
     * Callback that is called when resizer has been released
     * and column needs to be updated.
     *
     * Required if the isResizable property is true on any column.
     *
     * ```
     * function(
     *   newColumnWidth: number,
     *   dataKey: string,
     * )
     * ```
     */
    onColumnResizeEndCallback: PropTypes.func,

    /**
     * Whether a column is currently being resized.
     */
    isColumnResizing: PropTypes.bool,
  },

  getInitialState() {
    // Throw warnings on deprecated props.
    var state = {};
    state.needsMigration = this._checkDeprecations();

    return state;
  },

  _checkDeprecations() {
    var needsMigration = false;

    if (this.props.rowGetter) {
      notifyDeprecated('rowGetter',
        'Please use the cell API in Column to fetch data for your cells.'
      );

      // ROWGETTER??? You need to migrate.
      needsMigration = true;
    }

    if (this.props.headerDataGetter) {
      notifyDeprecated('headerDataGetter',
        'Please use the header API in Column to ' +
        'fetch data for your header cells.'
      );
    }

    if (this.props.footerData) {
      notifyDeprecated('footerData',
        'Please use the footer API in Column to ' +
        'fetch data for your footer cells.'
      );
    }

    if (this.props.footerDataGetter) {
      notifyDeprecated('footerDataGetter',
        'Please use the footer API in Column to ' +
        'fetch data for your footer cells.'
      );
    }

    ReactChildren.forEach(this.props.children, (child) => {
      if (!child || !child.props) {
        return;
      }

      var props = child.props;

      if (props.label) {
        notifyDeprecated('label',
          'Please use `header` instead.'
        );
      }

      if (props.dataKey) {
        notifyDeprecated('dataKey',
          'Please use the `cell` API to pass in a dataKey'
        );
      }

      if (props.cellRenderer) {
        notifyDeprecated('cellRenderer',
          'Please use the `cell` API to pass in a React Element instead.'
        );
      }

      if (props.headerRenderer) {
        notifyDeprecated('headerRenderer',
          'Please use the `header` API to pass in a React Element instead.'
        );
      }

      if (props.columnData) {
        notifyDeprecated('columnData',
          'Please pass data in through props to your header, cell or footer.'
        );
      }

      if (props.groupHeaderRenderer) {
        notifyDeprecated('groupHeaderRenderer',
          'Please use the `header` API in ColumnGroup to ' +
          'pass in a React Element instead of a function that creates one.'
        );
      }

      if (props.groupHeaderData) {
        notifyDeprecated('groupHeaderData',
          'Please pass in any data through props to your header.'
        );
      }
    });

    return needsMigration;
  },

  // Wrapper for onRow callbacks, since we don't have rowData at that level.
  _onRowAction(props, callback) {
    if (!callback) {
      return undefined;
    }

    return (e, rowIndex) => {
      callback(e, rowIndex, props.rowGetter(rowIndex) || EMPTY_OBJECT);
    };
  },

  _transformColumn(column, tableProps, key) {

    var props = column.props;

    if (column.type.__TableColumn__) {
      // Constuct the cell to be used using the rowGetter
      return (
        <Column
          key={'column_' + key}
          {...props}
          header={
            <TransitionCell
              isHeaderCell={true}
              label={props.label}
              width={props.width}
              dataKey={props.dataKey}
              className={props.headerClassName}
              columnData={props.columnData || EMPTY_OBJECT}
              cellRenderer={props.headerRenderer}
              headerDataGetter={tableProps.headerDataGetter}
            />
          }
          columnKey={props.dataKey}
          cell={
            <TransitionCell
              dataKey={props.dataKey}
              className={props.cellClassName}
              rowGetter={tableProps.rowGetter}
              width={props.width}
              columnData={props.columnData || EMPTY_OBJECT}
              cellDataGetter={props.cellDataGetter}
              cellRenderer={props.cellRenderer}
            />
          }
          footer={
            <TransitionCell
              isFooterCell={true}
              label={props.label}
              className={props.footerClassName}
              dataKey={props.dataKey}
              cellRenderer={props.footerRenderer}
              footerDataGetter={tableProps.footerDataGetter}
              footerData={tableProps.footerData || EMPTY_OBJECT}
            />
          }
        />
      );
    }
  },

  _transformColumnGroup(group, tableProps, key, labels) {
    var props = group.props;

    var j = 0;
    var columns = ReactChildren.map(props.children, (child) => {
      j++;
      return this._transformColumn(child, tableProps, key + '_' + j);
    });

    return (
      <ColumnGroup
        {...props}
        key={'group_' + key}
        header={
          <TransitionCell
            isHeaderCell={true}
            label={group.props.label}
            dataKey={key}
            groupHeaderRenderer={props.groupHeaderRenderer}
            groupHeaderLabels={labels}
            groupHeaderData={props.columnGroupData || EMPTY_OBJECT}
          />
        }>
        {columns}
      </ColumnGroup>
    );
  },

  _convertedColumns(needsMigration) {
    // If we don't need to migrate, map directly to the new API.
    if (!needsMigration) {
      return ReactChildren.map(this.props.children, (child) => {

        if (!child) {
          return null;
        }

        if (child.type.__TableColumn__) {
          return <Column {...child.props} />;
        }

        if (child.type.__TableColumnGroup__) {
          return <ColumnGroup {...child.props} />;
        }
      });
    }

    var tableProps = this.props;

    // Otherwise, if a migration is needed, we need to transform each Column
    // or ColumnGroup.
    var i = 0;
    return ReactChildren.map(this.props.children, (child) => {

      if (!child) {
        return null;
      }

      if (child.type.__TableColumn__) {
        child = this._transformColumn(child, tableProps, i);
      }

      if (child.type.__TableColumnGroup__) {
        // Since we apparently give an array of labels to groupHeaderRenderer
        var labels = [];
        ReactChildren.forEach(this.props.children, (child) => {
          labels.push(child.props.label);
        });

        child = this._transformColumnGroup(child, tableProps, i, labels);
      }

      i++;
      return child;
    });
  },

  render() {
    var props = this.props;
    return (
      <Table
        {...props}
        onRowMouseDown={this._onRowAction(props, props.onRowMouseDown)}
        onRowClick={this._onRowAction(props, props.onRowClick)}
        onRowDoubleClick={this._onRowAction(props, props.onRowDoubleClick)}
        onRowMouseEnter={this._onRowAction(props, props.onRowMouseEnter)}
        onRowMouseLeave={this._onRowAction(props, props.onRowMouseLeave)}
        >
        {this._convertedColumns(this.state.needsMigration)}
      </Table>
    );
  },
});

module.exports = TransitionTable;
