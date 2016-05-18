/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableCell.react
 * @typechecks
 */

'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var FixedDataTableCellDefault = require('./FixedDataTableCellDefault.react');
var FixedDataTableHelper = require('./FixedDataTableHelper');
var React = require('./React');
var cx = require('./cx');
var joinClasses = require('./joinClasses');

var DIR_SIGN = FixedDataTableHelper.DIR_SIGN;

var PropTypes = React.PropTypes;

var DEFAULT_PROPS = {
  align: 'left',
  highlighted: false
};

var FixedDataTableCell = React.createClass({
  displayName: 'FixedDataTableCell',

  /**
   * PropTypes are disabled in this component, because having them on slows
   * down the FixedDataTable hugely in DEV mode. You can enable them back for
   * development, but please don't commit this component with enabled propTypes.
   */
  propTypes_DISABLED_FOR_PERFORMANCE: {
    isScrolling: PropTypes.bool,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    className: PropTypes.string,
    highlighted: PropTypes.bool,
    width: PropTypes.number.isRequired,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    height: PropTypes.number.isRequired,

    cell: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),

    columnKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * The row index that will be passed to `cellRenderer` to render.
     */
    rowIndex: PropTypes.number.isRequired,

    /**
     * Callback for when resizer knob (in FixedDataTableCell) is clicked
     * to initialize resizing. Please note this is only on the cells
     * in the header.
     * @param number combinedWidth
     * @param number left
     * @param number width
     * @param number minWidth
     * @param number maxWidth
     * @param number|string columnKey
     * @param object event
     */
    onColumnResize: PropTypes.func,
    onResizeHandleDoubleClick: PropTypes.func,

    /**
     * The left offset in pixels of the cell.
     */
    left: PropTypes.number
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return !nextProps.isScrolling || this.props.rowIndex !== nextProps.rowIndex;
  },

  getDefaultProps: function getDefaultProps() /*object*/{
    return DEFAULT_PROPS;
  },

  render: function render() /*object*/{
    var _props = this.props;
    var height = _props.height;
    var width = _props.width;
    var columnKey = _props.columnKey;

    var props = _objectWithoutProperties(_props, ['height', 'width', 'columnKey']);

    var style = {
      height: height,
      width: width
    };

    if (DIR_SIGN === 1) {
      style.left = props.left;
    } else {
      style.right = props.left;
    }

    var className = joinClasses(cx({
      'fixedDataTableCellLayout/main': true,
      'fixedDataTableCellLayout/lastChild': props.lastChild,
      'fixedDataTableCellLayout/alignRight': props.align === 'right',
      'fixedDataTableCellLayout/alignCenter': props.align === 'center',
      'public/fixedDataTableCell/alignRight': props.align === 'right',
      'public/fixedDataTableCell/highlighted': props.highlighted,
      'public/fixedDataTableCell/main': true
    }), props.className);

    var columnResizerComponent;
    if (props.onColumnResize) {
      var columnResizerStyle = {
        height: height
      };
      columnResizerComponent = React.createElement(
        'div',
        {
          className: cx('fixedDataTableCellLayout/columnResizerContainer'),
          style: columnResizerStyle,
          onMouseDown: this._clickDispatcher },
        React.createElement('div', {
          className: joinClasses(cx('fixedDataTableCellLayout/columnResizerKnob'), cx('public/fixedDataTableCell/columnResizerKnob')),
          style: columnResizerStyle
        })
      );
    }

    var cellProps = {
      columnKey: columnKey,
      height: height,
      width: width
    };

    if (props.rowIndex >= 0) {
      cellProps.rowIndex = props.rowIndex;
    }

    var content;
    if (React.isValidElement(props.cell)) {
      content = React.cloneElement(props.cell, cellProps);
    } else if (typeof props.cell === 'function') {
      content = props.cell(cellProps);
    } else {
      content = React.createElement(
        FixedDataTableCellDefault,
        cellProps,
        props.cell
      );
    }

    return React.createElement(
      'div',
      { className: className, style: style },
      columnResizerComponent,
      content
    );
  },
  _clickCount: 0,

  _onDoubleClick: function _onDoubleClick(event) {

    var columnKey = this.props.columnKey;

    this.props.onResizeHandleDoubleClick(columnKey);
  },
  _clickDispatcher: function _clickDispatcher(event) {
    // to dispatch event based on single click or double click

    event.stopPropagation();

    this._clickCount++;

    if (this._clickCount === 1) {

      this.props.onColumnResize(this.props.left, this.props.width, this.props.minWidth, this.props.maxWidth, this.props.columnKey, event);
    } else if (this._clickCount === 2) {

      this._onDoubleClick();
    }

    setTimeout((function () {
      this._clickCount = 0;
    }).bind(this), 500); //if no click in 500 interval, reset click count
  },

  _onColumnResizerMouseDown: function _onColumnResizerMouseDown( /*object*/event) {
    this.props.onColumnResize(this.props.left, this.props.width, this.props.minWidth, this.props.maxWidth, this.props.columnKey, event);
  }
});

module.exports = FixedDataTableCell;