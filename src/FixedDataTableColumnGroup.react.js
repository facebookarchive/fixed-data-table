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

var {PropTypes} = React;

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
     * Controls if the column group is fixed when scrolling in the X axis.
     */
    fixed: PropTypes.bool,

    /**
     * This is the header cell for this column group.
     * This can either be a string or a React element. Passing in a string
     * will render a default footer cell with that string. By default, the React
     * element passed in can expect to receive the following props:
     *
     * ```
     * props: {
     *   cellHeight: number // (supplied from the groupHeaderHeight)
     *   cellWidth: number // (supplied from the Column)
     * }
     * ```
     *
     * Because you are passing in your own React element, you can feel free to
     * pass in whatever props you may want or need.
     */
    header: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),
  },

  getDefaultProps() /*object*/ {
    return {
      fixed: false,
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
