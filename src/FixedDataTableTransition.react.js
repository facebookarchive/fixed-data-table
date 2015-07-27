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

var PropTypes = React.PropTypes;

// Current Table API
var Table = require('FixedDataTable.react');
var CellDefault = require('FixedDataTableCellDefault.react');
var Column = require('FixedDataTableColumn.react');
var ColumnGroup = require('FixedDataTableColumnGroup.react');

var NextVersion = '6.0.0';
var DocumentationUrl = 'http://facebook.github.io/fixed-data-table'

function notifyDeprecated(prop, reason){
  if (__DEV__){
    console.warn(
      prop + ' will be DEPRECATED in versions ' + NextVersion + ' and beyond. \n' +
      reason + '\n' +
      'Read the docs at: ' + DocumentationUrl
    )
  }
}

var TransitionCell = React.createClass({
  render() {
    return <div> "hello" </div>
  }
});

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

  componentWillMount() {
    // Throw warnings on deprecated props.
    if (this.props.rowGetter){
      notifyDeprecated('rowGetter', 'Please use the cell API in Column to fetch data ' +
        'for your cells.');
    }
  },

  _checkAPI() {

    var children = [];
    ReactChildren.forEach(props.children, (child, index) => {
      if (child == null) {
        return;
      }
      invariant(
        child.type.__TableColumnGroup__ ||
        child.type.__TableColumn__,
        'child type should be <FixedDataTableColumn /> or ' +
        '<FixedDataTableColumnGroup />'
      );
      children.push(child);
    });

  },

  render() {
    if (this.props.rowGetter){

    }
    return <div> "hello" </div>
  },
});

var TransitionRoot = {
  Cell: TransitionCell,
  Column: TransitionColumn,
  ColumnGroup: TransitionColumnGroup,
  Table: TransitionTable,
};

module.exports = TransitionRoot;