/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableRoot
 */

'use strict';

var FixedDataTable = require('FixedDataTable.react');
var FixedDataTableCellDefault = require('FixedDataTableCellDefault.react');
var FixedDataTableColumn = require('FixedDataTableColumn.react');
var FixedDataTableColumnGroup = require('FixedDataTableColumnGroup.react');

var FixedDataTableRoot = {
  Cell: FixedDataTableCellDefault,
  Column: FixedDataTableColumn,
  ColumnGroup: FixedDataTableColumnGroup,
  Table: FixedDataTable,
};

FixedDataTableRoot.version = '0.6.1';
module.exports = FixedDataTableRoot;
