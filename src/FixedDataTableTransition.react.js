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
  * to continue.
  */

'use strict';

var React = require('React');
var ReactChildren = React.Children;

var invariant = require('invariant');

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
    if (this.props.rowGetter){
      notifyDeprecated('rowGetter', 'Please use the cell API in Column to fetch data ' +
        'for your cells.');

      // This needs a migration.
      state.migrationNeeded = true;
    }
    return state;
  },

  render() {
    // If we don't need to do a migration,
    // Just render the table as is.
    if (!this.state.migrationNeeded){
      return (
        <Table
          {...this.props}>
          {this.props.children.map((child, i) => {
            // Convert them directly
            if (child.type.__TableColumn__){
              return <Column key={'column_' + i} {...child.props} />
            }

            if (child.type.__TableColumnGroup__){
              return <ColumnGroup key={'column_' + i} {...child.props} />
            }
          })}
        </Table>
      )
    }

    // Otherwise, migrate as needed.

    return null;
  },
});

var TransitionRoot = {
  Cell: CellDefault, // NEW API, just use the cell that's provided :)
  Column: TransitionColumn,
  ColumnGroup: TransitionColumnGroup,
  Table: TransitionTable,
};

module.exports = TransitionRoot;