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

var ImmutableObject = require('ImmutableObject');

// New Table API
var Table = require('FixedDataTableNew.react');
var Column = require('FixedDataTableColumnNew.react');
var ColumnGroup = require('FixedDataTableColumnGroupNew.react');

// Transition Cell
var TransitionCell = require('FixedDataTableCellTransition.react');

var NEXT_VERSION = '0.6.0';
var DOCUMENTATION_URL = 'http://facebook.github.io/fixed-data-table';

var EMPTY_OBJECT = new ImmutableObject({});

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
    var state = {};
    state.needsMigration = this._checkDeprecations();

    return state;
  },

  _checkDeprecations() {
    var needsMigration = false;

    if (this.props.rowGetter) {
      notifyDeprecated('rowGetter',
        'Please use the cell API in Column to fetch data for your cells.');

      // ROWGETTER??? You need to migrate.
      needsMigration = true;
    }

    if (this.props.headerDataGetter) {
      notifyDeprecated('headerDataGetter',
        'Please use the header API in Column to ' +
        'fetch data for your header cells.');
    }

    if (this.props.footerData) {
      notifyDeprecated('footerData',
        'Please use the footer API in Column to ' +
        'fetch data for your footer cells.');
    }

    if (this.props.footerDataGetter) {
      notifyDeprecated('footerDataGetter',
        'Please use the footer API in Column to ' +
        'fetch data for your footer cells.');
    }

    this.props.children.forEach((child) => {
      var props = child.props;

      if (props.label) {
        notifyDeprecated('label',
          'Please use `header` instead.');
      }

      if (props.dataKey) {
        notifyDeprecated('dataKey',
          'Please use the `cell` API to pass in a dataKey');
      }

      if (props.cellRenderer) {
        notifyDeprecated('cellRenderer',
          'Please use the `cell` API to pass in a React Element instead.');
      }

      if (props.headerRenderer) {
        notifyDeprecated('headerRenderer',
          'Please use the `header` API to pass in a React Element instead.');
      }

      if (props.columnData) {
        notifyDeprecated('columnData',
          'Please pass data in through props to your header, cell or footer.');
      }

      if (props.groupHeaderRenderer) {
        notifyDeprecated('groupHeaderRenderer',
          'Please use the `header` API in ColumnGroup to ' +
          'pass in a React Element instead of a function that creates one.');
      }

      if (props.groupHeaderData) {
        notifyDeprecated('groupHeaderData',
          'Please pass in any data through props to your header.');
      }

    });

    return needsMigration;
  },

  // Wrapper for onRow callbacks, since we don't have rowData at that level.
  _onRow(props, callback) {
    if (!callback) {
      return undefined;
    }

    return (e, idx) => {
      callback(e, idx, props.rowGetter(idx) || EMPTY_OBJECT);
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
              headerRenderer={props.headerRenderer}
              headerDataGetter={tableProps.headerRenderer}
            />
          }
          columnKey={props.dataKey}
          cell={
            <TransitionCell
              dataKey={props.dataKey}
              className={props.cellClassName}
              rowGetter={this.props.rowGetter}
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
              footerRenderer={props.footerRenderer}
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

    var width = 0;
    ReactChildren.forEach(props.children, (child) => {
      width += child.props.width;
    });

    var j = 0;
    var columns = ReactChildren.map(props.children, (child) => {
      j++;
      return this._transformColumn(child, tableProps, key + '_' + j);
    }.bind(this));

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
            groupHeaderWidth={width}
            groupHeaderData={props.columnGroupData || EMPTY_OBJECT}
          />
        }>
        {columns}
      </ColumnGroup>
    );
  },

  _convertedColumns(needsMigration) {
    // If we don't need to migrate, then
    if (!needsMigration) {
      return ReactChildren.map(this.props.children, (child) => {
        // Convert them directly
        if (child.type.__TableColumn__) {
          return <Column {...child.props} />;
        }

        if (child.type.__TableColumnGroup__) {
          return <ColumnGroup {...child.props} />;
        }
      });
    }

    var tableProps = this.props;

    // Do some conversions
    var i = 0;
    return ReactChildren.map(this.props.children, (child) => {

      if (child.type.__TableColumn__) {
        return this._transformColumn(child, tableProps, i);
      }

      if (child.type.__TableColumnGroup__) {
        // Since we apparently give an array of labels to groupHeaderRenderer
        var labels = [];
        ReactChildren.forEach(this.props.children, (child) => {
          labels.push(child.props.label);
        });

        return this._transformColumnGroup(child, tableProps, i, labels);
      }

      i++;

    }.bind(this));
  },

  render() {
    var props = this.props;
    return (
      <Table
        {...props}
        onRowMouseDown={this._onRow(props, props.onRowMouseDown)}
        onRowClick={this._onRow(props, props.onRowClick)}
        onRowDoubleClick={this._onRow(props, props.onRowDoubleClick)}
        onRowMouseEnter={this._onRow(props, props.onRowMouseEnter)}
        onRowMouseLeave={this._onRow(props, props.onRowMouseLeave)}
        >
        {this._convertedColumns(this.state.needsMigration)}
      </Table>
    );
  },
});

module.exports = TransitionTable;
