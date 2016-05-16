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

const React = require('React');

function getTotalWidth(/*array*/ columns) /*number*/ {
  let totalWidth = 0;
  for (let i = 0; i < columns.length; ++i) {
    totalWidth += columns[i].props.width;
  }
  return totalWidth;
}

function getTotalFlexGrow(/*array*/ columns) /*number*/ {
  let totalFlexGrow = 0;
  for (let i = 0; i < columns.length; ++i) {
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
  let remainingFlexGrow = getTotalFlexGrow(columns);
  let remainingFlexWidth = flexWidth;
  const newColumns = [];
  let totalWidth = 0;
  for (let i = 0; i < columns.length; ++i) {
    const column = columns[i];
    if (!column.props.flexGrow) {
      totalWidth += column.props.width;
      newColumns.push(column);
      continue;
    }
    const columnFlexWidth = Math.floor(
      column.props.flexGrow / remainingFlexGrow * remainingFlexWidth
    );
    const newColumnWidth = Math.floor(column.props.width + columnFlexWidth);
    totalWidth += newColumnWidth;

    remainingFlexGrow -= column.props.flexGrow;
    remainingFlexWidth -= columnFlexWidth;

    newColumns.push(React.cloneElement(
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
  const allColumns = [];
  let i;
  for (i = 0; i < columnGroups.length; ++i) {
    React.Children.forEach(
      columnGroups[i].props.children,
      (column) => {
        allColumns.push(column);
      }
    );
  }
  const columnsWidth = getTotalWidth(allColumns);
  let remainingFlexGrow = getTotalFlexGrow(allColumns);
  let remainingFlexWidth = Math.max(expectedWidth - columnsWidth, 0);

  const newAllColumns = [];
  const newColumnGroups = [];

  for (i = 0; i < columnGroups.length; ++i) {
    const columnGroup = columnGroups[i];
    var currentColumns = [];

    React.Children.forEach(
      columnGroup.props.children,
      (column) => {
        currentColumns.push(column);
      }
    );

    const columnGroupFlexGrow = getTotalFlexGrow(currentColumns);
    const columnGroupFlexWidth = Math.floor(
      columnGroupFlexGrow / remainingFlexGrow * remainingFlexWidth
    );

    const newColumnSettings = distributeFlexWidth(
      currentColumns,
      columnGroupFlexWidth
    );

    remainingFlexGrow -= columnGroupFlexGrow;
    remainingFlexWidth -= columnGroupFlexWidth;

    for (let j = 0; j < newColumnSettings.columns.length; ++j) {
      newAllColumns.push(newColumnSettings.columns[j]);
    }

    newColumnGroups.push(React.cloneElement(
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
  const columnsWidth = getTotalWidth(columns);
  if (columnsWidth < expectedWidth) {
    return distributeFlexWidth(columns, expectedWidth - columnsWidth).columns;
  }
  return columns;
}

const FixedDataTableWidthHelper = {
  getTotalWidth,
  getTotalFlexGrow,
  distributeFlexWidth,
  adjustColumnWidths,
  adjustColumnGroupWidths,
};

module.exports = FixedDataTableWidthHelper;
