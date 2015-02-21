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

"use strict";

if (__DEV__) {
  var ExecutionEnvironment = require('ExecutionEnvironment');
  if (ExecutionEnvironment.canUseDOM && window.top === window.self) {

    if (!Object.assign) {
      console.error(
        'FixedDataTable expected an ES6 compatible `Object.assign` polyfill.'
      );
    }
  }
}

var FixedDataTable = require('FixedDataTable.react');
var FixedDataTableColumn = require('FixedDataTableColumn.react');
var FixedDataTableColumnGroup = require('FixedDataTableColumnGroup.react');

var FixedDataTableRoot = {
  Column: FixedDataTableColumn,
  ColumnGroup: FixedDataTableColumnGroup,
  Table: FixedDataTable,
};

FixedDataTableRoot.version = '0.1.1';

module.exports = FixedDataTableRoot;
