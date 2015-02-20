/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableColumnGroup.react
 * @typechecks
 */

var React = require('React');

var PropTypes = React.PropTypes;

/**
 * Component that defines the attributes of a table column group.
 */
var FixedDataTableColumnGroup = React.createClass({
  statics: {
    __TableColumnGroup__: true
  },

  propTypes: {
    /**
     * The horizontal alignment of the table cell content.
     */
    align: PropTypes.oneOf(['left', 'center', 'right']),

    /**
     * Whether the column group is fixed.
     */
    fixed: PropTypes.bool.isRequired,

    /**
     * If not specified, props.label will be rendered into group header.
     * The group header cell renderer
     * `function(
     *   any_label,
     *   string_cellDataKey,
     *   any_columnGroupData,
     *   object_rowData(array of labels of all coludmnGroups),
     *   number_width
     *)`
     * that returns React-renderable content for table column group header.
     */
    groupHeaderRenderer: PropTypes.func,

    /**
     * Bucket for any data to be passed into column group renderer functions.
     */
    columnGroupData: PropTypes.object,

    /**
     * The column's header label.
     */
    label: PropTypes.string,
  },

  render() {
    if (__DEV__) {
      throw new Error(
        'Component <FixedDataTableColumnGroup /> should never render'
      );
    }
    return null;
  },
});

module.exports = FixedDataTableColumnGroup;
