/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableHelper
 * @typechecks
 */

"use strict";

var Locale = require('Locale');
var React = require('React');
var FixedDataTableColumnGroup = require('FixedDataTableColumnGroup.react');
var FixedDataTableColumn = require('FixedDataTableColumn.react');

var cloneWithProps = require('cloneWithProps');

var DIR_SIGN = (Locale.isRTL() ? -1 : +1);
// A cell up to 5px outside of the visible area will still be considered visible
var CELL_VISIBILITY_TOLERANCE = 5; // used for flyouts

function renderToString(value) /*string*/ {
  if (value === null || value === undefined) {
    return '';
  } else {
    return String(value);
  }
}

/**
 * Helper method to execute a callback against all columns given the children
 * of a table.
 * @param {?object|array} children
 *    Children of a table.
 * @param {function} callback
 *    Function to excecute for each column. It is passed the column.
 */
function forEachColumn(children, callback) {
  React.Children.forEach(children, (child) => {
    if (child.type === FixedDataTableColumnGroup.type) {
      forEachColumn(child.props.children, callback);
    } else if (child.type === FixedDataTableColumn.type) {
      callback(child);
    }
  });
}

/**
 * Helper method to map columns to new columns. This takes into account column
 * groups and will generate a new column group if its columns change.
 * @param {?object|array} children
 *    Children of a table.
 * @param {function} callback
 *    Function to excecute for each column. It is passed the column and should
 *    return a result column.
 */
function mapColumns(children, callback) {
  var newChildren = [];
  React.Children.forEach(children, originalChild => {
    var newChild = originalChild;

    // The child is either a column group or a column. If it is a column group
    // we need to iterate over its columns and then potentially generate a
    // new column group
    if (originalChild.type === FixedDataTableColumnGroup.type) {
      var haveColumnsChanged = false;
      var newColumns = [];

      forEachColumn(originalChild.props.children, originalcolumn => {
        var newColumn = callback(originalcolumn);
        if (newColumn !== originalcolumn) {
          haveColumnsChanged = true;
        }
        newColumns.push(newColumn);
      });

      // If the column groups columns have changed clone the group and supply
      // new children
      if (haveColumnsChanged) {
        newChild = cloneWithProps(originalChild, {children: newColumns});
      }
    } else if (originalChild.type === FixedDataTableColumn.type) {
      newChild = callback(originalChild);
    }

    newChildren.push(newChild);
  });

  return newChildren;
}

var FixedDataTableHelper = {
  DIR_SIGN,
  CELL_VISIBILITY_TOLERANCE,
  renderToString,
  forEachColumn,
  mapColumns,
};

module.exports = FixedDataTableHelper;
