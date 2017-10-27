/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableCellDefault.react
 * @typechecks
 */

var React = require('React');
var createReactClass = require('create-react-class');

var cx = require('cx');
var joinClasses = require('joinClasses');

var PropTypes = require('prop-types');

/**
 * Component that handles default cell layout and styling.
 *
 * All props unless specified below will be set onto the top level `div`
 * rendered by the cell.
 *
 * Example usage via from a `Column`:
 * ```
 * const MyColumn = (
 *   <Column
 *     cell={({rowIndex, width, height}) => (
 *       <Cell
 *         width={width}
 *         height={height}
 *         className="my-class">
 *         Cell number: <span>{rowIndex}</span>
*        </Cell>
 *     )}
 *     width={100}
 *   />
 * );
 * ```
 */
var FixedDataTableCellDefault = createReactClass({
  propTypes: {

    /**
     * Outer height of the cell.
     */
    height: PropTypes.number,

    /**
     * Outer width of the cell.
     */
    width: PropTypes.number,

    /**
     * Optional prop that if specified on the `Column` will be passed to the
     * cell. It can be used to uniquely identify which column is the cell is in.
     */
    columnKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  },

  render() {
    var {
      height,
      width,
      style,
      className,
      children,
      columnKey, // Unused but should not be passed through
      rowIndex, // Unused but should not be passed through
      ...props
    } = this.props;

    var innerStyle = {
      height,
      width,
      ...style,
    };

    return (
      <div
        {...props}
        className={joinClasses(
          cx('fixedDataTableCellLayout/wrap1'),
          cx('public/fixedDataTableCell/wrap1'),
          className,
        )}
        style={innerStyle}>
        <div
          className={joinClasses(
            cx('fixedDataTableCellLayout/wrap2'),
            cx('public/fixedDataTableCell/wrap2'),
          )}>
          <div
            className={joinClasses(
              cx('fixedDataTableCellLayout/wrap3'),
              cx('public/fixedDataTableCell/wrap3'),
            )}>
            <div className={cx('public/fixedDataTableCell/cellContent')}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = FixedDataTableCellDefault;
