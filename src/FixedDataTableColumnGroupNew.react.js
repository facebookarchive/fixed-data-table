/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableColumnGroupNew.react
 * @typechecks
 */

var React = require('React');

var PropTypes = require('prop-types');

/**
 * Component that defines the attributes of a table column group.
 */
var FixedDataTableColumnGroup = React.createClass({
  statics: {
    __TableColumnGroup__: true,
  },

  propTypes: {
    /**
     * The horizontal alignment of the table cell content.
     */
    align: PropTypes.oneOf(['left', 'center', 'right']),

    /**
     * Controls if the column group is fixed when scrolling in the X axis.
     */
    fixed: PropTypes.bool,
      
    /**
     * Controls if the column group is fixed at the left or the right of the
     * table.
     */
    fixedPosition: PropTypes.oneOf(['left', 'right']),

    /**
     * Bucket for any data to be passed into column group renderer functions.
     */
    columnGroupData: PropTypes.object,

    /**
     * The column group's header label.
     */
    label: PropTypes.string,

    /**
     * The cell renderer that returns React-renderable content for a table
     * column group header. If it's not specified, the label from props will
     * be rendered as header content.
     * ```
     * props: {
     *   height: number // (supplied from the groupHeaderHeight)
     *   width: number // (supplied from the Column)
     * }
     * ```
     *
     * Because you are passing in your own React element, you can feel free to
     * pass in whatever props you may want or need.
     *
     * You can also pass in a function that returns a react elemnt, with the
     * props object above passed in as the first parameter.
     */
    header: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]),

  },

  getDefaultProps() /*object*/ {
    return {
      fixed: false,
      fixedPosition: 'left',
    };
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
