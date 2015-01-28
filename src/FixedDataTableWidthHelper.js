/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableWidthHelper
 * @typechecks
 */
'use strict';

var React = require('React');

var cloneWithProps = require('cloneWithProps');

function getTotalWidth(/*array*/ columns) /*number*/ {
  var totalWidth = 0;
  for (var i = 0; i < columns.length; ++i) {
    totalWidth += columns[i].props.width;
  }
  return totalWidth;
}

function getTotalFlexGrow(/*array*/ columns) /*number*/ {
  var totalFlexGrow = 0;
  for (var i = 0; i < columns.length; ++i) {
    totalFlexGrow += columns[i].props.flexGrow || 0;
  }
  return totalFlexGrow;
}

function distributeFlexWidth(
  /*array*/ columns,
  /*number*/ flexWidth
) /*object*/ {
  if (flexWidth <= 0) {
    return {
      columns: columns,
      width: getTotalWidth(columns),
    };
  }
  var columnsFlexGrow = getTotalFlexGrow(columns);
  var flexGrowUnit = flexWidth / columnsFlexGrow;
  var newColumns = [];
  var totalWidth = 0;
  for (var i = 0; i < columns.length; ++i) {
    var column = columns[i];
    if (!column.props.flexGrow) {
      totalWidth += column.props.width;
      newColumns.push(column);
      continue;
    }
    var newColumnWidth =
      Math.floor(column.props.width + column.props.flexGrow * flexGrowUnit);
    totalWidth += newColumnWidth;

    newColumns.push(cloneWithProps(
      column,
      {width: newColumnWidth}
    ));
  }

  return {
    columns: newColumns,
    width: totalWidth,
  };
}

function adjustColumnGroupWidths(
  /*array*/ columnGroups,
  /*number*/ expectedWidth
) /*object*/ {
  var allColumns = [];
  var i;
  for (i = 0; i < columnGroups.length; ++i) {
    React.Children.forEach(
      columnGroups[i].props.children,
      (column) => {allColumns.push(column);}
    );
  }
  var columnsWidth = getTotalWidth(allColumns);
  var totalFlexGrow = getTotalFlexGrow(allColumns);
  var totalFlexWidth = Math.max(expectedWidth - columnsWidth, 0);
  var flexGrowUnit = totalFlexWidth / totalFlexGrow;

  var newAllColumns = [];
  var newColumnGroups = [];

  for (i = 0; i < columnGroups.length; ++i) {
    var columnGroup = columnGroups[i];
    var currentColumns = [];

    React.Children.forEach(
      columnGroup.props.children,
      (column) => {currentColumns.push(column);}
    );

    var columnGroupFlexGrow = getTotalFlexGrow(currentColumns);
    var columnGroupFlexWidth = Math.floor(columnGroupFlexGrow * flexGrowUnit);
    var newColumnSettings = distributeFlexWidth(
      currentColumns,
      columnGroupFlexWidth
    );

    for (var j = 0; j < newColumnSettings.columns.length; ++j) {
      newAllColumns.push(newColumnSettings.columns[j]);
    }

    newColumnGroups.push(cloneWithProps(
      columnGroup,
      {width: newColumnSettings.width}
    ));
  }

  return {
    columns: newAllColumns,
    columnGroups: newColumnGroups,
  };
}

function adjustColumnWidths(
  /*array*/ columns,
  /*number*/ expectedWidth
) /*array*/ {
  var columnsWidth = getTotalWidth(columns);
  if (columnsWidth < expectedWidth) {
    return distributeFlexWidth(columns, expectedWidth - columnsWidth).columns;
  }
  return columns;
}

var FixedDataTableWidthHelper = {
  getTotalWidth,
  getTotalFlexGrow,
  distributeFlexWidth,
  adjustColumnWidths,
  adjustColumnGroupWidths,
};

module.exports = FixedDataTableWidthHelper;
