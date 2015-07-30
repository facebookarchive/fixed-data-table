/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableTransition.react
 */

 /**
  * TRANSITION SHIM
  * This acts to provide an intermediate mapping from the old API to the new API.
  *
  * Remove this entire file and replace the two lines in FixedDataTableRoot when ready
  * to continue to the new API.
  */

'use strict';

var React = require('React');
var ReactChildren = React.Children;

var cx = require('cx');
var invariant = require('invariant');
var joinClasses = require('joinClasses');

var PropTypes = React.PropTypes;

// Current Table API
var Table = require('FixedDataTable.react');
var CellDefault = require('FixedDataTableCellDefault.react');
var Column = require('FixedDataTableColumn.react');
var ColumnGroup = require('FixedDataTableColumnGroup.react');

var NextVersion = '6.0.0';
var DocumentationUrl = 'http://facebook.github.io/fixed-data-table'

/**
 * Notify in console that some prop has been deprecated.
 */
function notifyDeprecated(prop, reason){
  if (__DEV__){
    console.warn(
      prop + ' will be DEPRECATED in versions ' + NextVersion + ' and beyond. \n' +
      reason + '\n' +
      'Read the docs at: ' + DocumentationUrl
    )
  }
}

var TransitionColumn = React.createClass({
  statics: {
    __TableColumn__: true
  },

  render() {
    if (__DEV__) {
      throw new Error(
        'Component <TransitionColumn /> should never render'
      );
    }
    return null;
  }
});

var TransitionColumnGroup = React.createClass({
  statics: {
    __TableColumnGroup__: true
  },

  render() {
    if (__DEV__) {
      throw new Error(
        'Component <TransitionColumnGroup /> should never render'
      );
    }
    return null;
  }
});

var TransitionCell = React.createClass({
  propTypes: {
    className: PropTypes.string,
    rowGetter: PropTypes.func.isRequired,
    dataKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    cellRenderer: PropTypes.func,
    cellDataGetter: PropTypes.func,
    columnData: PropTypes.any,
    width: PropTypes.number,
    height: PropTypes.number,
  },

  _getRowData() {
    return this.props.rowGetter(this.props.rowIndex);
  },

  _getData() {
    var dataKey = this.props.dataKey;
    var rowData = this._getRowData();
    if (this.props.cellDataGetter){
      return this.props.cellDataGetter(dataKey, rowData);
    }

    return rowData[dataKey];
  },

  render() {
    var props = this.props;

    var content = this._getData();

    if (props.cellRenderer){
      content = props.cellRenderer(
        this._getData(),
        props.dataKey,
        this._getRowData(),
        props.rowIndex,
        props.columnData,
        props.width
      );
    }

    if (!React.isValidElement(content)){
      return (
        <CellDefault
          {...props}>
          {content}
        </CellDefault>
      );
    }

    var innerStyle = {
      height: this.props.cellHeight,
      width: this.props.cellWidth,
      ...this.props.style,
    };

    var contentClass = cx('public/fixedDataTableCell/cellContent');

    return (
      <div
        {...this.props}
        className={joinClasses(
          cx('fixedDataTableCellLayout/wrap1'),
          cx('public/fixedDataTableCell/wrap1'),
          this.props.className
        )}
        style={innerStyle}>
        <div
          className={joinClasses(
            cx('fixedDataTableCellLayout/wrap2'),
            cx('public/fixedDataTableCell/wrap2'),
          )}>
          <div
            className={joinClasses(
              cx('fixedDataTableCellLayout/wrap3'),
              cx('public/fixedDataTableCell/wrap3'),
            )}>
            {content}
          </div>
        </div>
      </div>
    )

  }
});

var TransitionHeader = React.createClass({
  propTypes: {
    label: PropTypes.string,
    headerRenderer: PropTypes.func,
    dataKey: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    columnData: PropTypes.any,
    width: PropTypes.number
  },

  render() {
    var props = this.props;

    var content = props.label;

    if (props.headerRenderer){
      content = props.headerRenderer(
        props.label,
        props.dataKey,
        props.columnData,
        props.width
      ) || props.label;
    }

    return (
      <CellDefault
        {...this.props} >
        {content}
      </CellDefault>
    )
  }
});

/**
 * Transition Table takes in the table and maps it to the new api.
 *
 * Creates warnings for API endpoints that are deprecated.
 */
var TransitionTable = React.createClass({
  propTypes: {
    /**
     * DEPRECATED
     * rowGetter(index) to feed data into each cell.
     */
    rowGetter: PropTypes.func
  },

  getInitialState() {
    // Throw warnings on deprecated props.
    var state = {}
    state.needsMigration = this._checkDeprecations();

    return state;
  },

  _checkDeprecations() {
    var needsMigration = false;

    if (this.props.rowGetter){
      notifyDeprecated('rowGetter', 'Please use the cell API in Column to fetch data ' +
        'for your cells.');

      // This needs a migration.
      needsMigration = true;
    }

    this.props.children.forEach((child) => {
      var props = child.props;

      if (props.label) {
        notifyDeprecated('label', 'Please use `header` instead.');
      }

      if (props.dataKey) {
        notifyDeprecated('dataKey', 'Please use the `cell` API to pass in a dataKey');
      }

      if (props.cellRenderer) {
        notifyDeprecated('cellRenderer', 'Please use the `cell` API to pass in a React Element,' +
          ' instead of a funciton that returns one.')
      }

      if (props.headerRenderer) {
        notifyDeprecated('headerRenderer', 'Please use the `header` API to pass in a React Element,' +
          ' instead of a function that creates one.')
      }

      if (props.columnData) {
        notifyDeprecated('columnData', 'Please pass data in through props to your' +
          ' header, cell or footer.')
      }

    })

    return needsMigration;
  },

  _convertColumns(needsMigration) {
    var rowGetter = this.props.rowGetter;

    // If we don't need to migrate, then
    if (!needsMigration){
      return this.props.children.map((child, i) => {
        // Convert them directly
        if (child.type.__TableColumn__){
          return <Column {...child.props} />
        }

        if (child.type.__TableColumnGroup__){
          return <ColumnGroup {...child.props} />
        }
      });
    }

    // Do some conversions
    return this.props.children.map((child, i) => {

      var props = child.props;

      // Constuct the cell to be used using the rowGetter
      return (
        <Column
          key={'column_' + i}
          {...props}
          header={
            <TransitionHeader
              label={props.label}
              headerRenderer={props.headerRenderer}
              dataKey={props.dataKey}
              columnData={props.columnData}
              width={props.width}
            />
          }
          columnKey={props.dataKey}
          cell={
            <TransitionCell
              dataKey={props.dataKey}
              className={props.cellClassName}
              rowGetter={this.props.rowGetter}
              cellDataGetter={props.cellDataGetter}
              cellRenderer={props.cellRenderer}
              columnData={props.columnData}
              width={props.width}
            />
          }
          footer={
            null
          }
        />
      )
    })
  },

  render() {
    return (
      <Table
        {...this.props}>
        {this._convertColumns(this.state.needsMigration)}
      </Table>
    )
  },
});

var TransitionRoot = {
  Cell: CellDefault, // NEW API, just use the cell that's provided :)
  Column: TransitionColumn,
  ColumnGroup: TransitionColumnGroup,
  Table: TransitionTable,
};

module.exports = TransitionRoot;