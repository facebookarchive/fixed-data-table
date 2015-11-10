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

var cx = require('cx');
var joinClasses = require('joinClasses');

var {PropTypes} = React;

var FixedDataTableCellDefault = React.createClass({

  propTypes: {
    height: PropTypes.number,
    width: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.string,
  },

  render() {

    var {height, width, style, className, ...props} = this.props;

    var innerStyle = {
      height,
      width,
      ...style,
    };

    return (
      <div
        {...this.props}
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
              {props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FixedDataTableCellDefault;
