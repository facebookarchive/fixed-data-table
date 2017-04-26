/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableColumn.react
 */

/**
 * TRANSITION SHIM
 * This acts to provide an intermediate mapping from the old API to the new API.
 *
 * When ready, remove this file and rename the providesModule in
 * FixedDataTableColumnNew.react
 */

'use strict';

var React = require('./React');

var TransitionColumn = React.createClass({
  displayName: 'TransitionColumn',

  statics: {
    __TableColumn__: true
  },

  render: function render() {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Component <TransitionColumn /> should never render');
    }
    return null;
  }
});

module.exports = TransitionColumn;