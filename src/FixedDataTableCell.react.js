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

var FixedDataTableCellWrapper = require('FixedDataTableCellWrapper.react');
var FixedDataTableHelper = require('FixedDataTableHelper');
var ImmutableObject = require('ImmutableObject');
var React = require('React');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
var cx = require('cx');
var joinClasses = require('joinClasses');

var DIR_SIGN = FixedDataTableHelper.DIR_SIGN;

var {PropTypes} = React;

var DEFAULT_PROPS = new ImmutableObject({
  align: 'left',
  highlighted: false,
});

var FixedDataTableCell = React.createClass({
  mixins: [ReactComponentWithPureRenderMixin],

  propTypes: {
    align: PropTypes.oneOf(['left', 'center', 'right']),
    className: PropTypes.string,
    highlighted: PropTypes.bool,
    width: PropTypes.number.isRequired,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    height: PropTypes.number.isRequired,

    cell: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),

    columnKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

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

    /**
     * The left offset in pixels of the cell.
     */
    left: PropTypes.number,
  },

  getDefaultProps() /*object*/ {
    return DEFAULT_PROPS;
  },

  render() /*object*/ {
    var props = this.props;

    var style = {
      height: props.height,
      width: props.width,
    };
    if (DIR_SIGN === 1) {
      style.left = props.left;
    } else {
      style.right = props.left;
    }

    var className = joinClasses(
      cx({
        'fixedDataTableCellLayout/main': true,
        'fixedDataTableCellLayout/lastChild': props.lastChild,
        'fixedDataTableCellLayout/alignRight': props.align === 'right',
        'fixedDataTableCellLayout/alignCenter': props.align === 'center',
        'public/fixedDataTableCell/alignRight': props.align === 'right',
        'public/fixedDataTableCell/highlighted': props.highlighted,
        'public/fixedDataTableCell/main': true,
      }),
      props.className,
    );

    var content;
    var contentClass = cx('public/fixedDataTableCell/cellContent');
    if (React.isValidElement(props.cell)) {
      content = React.cloneElement(content, {
        className: joinClasses(content.props.className, contentClass),
        rowIndex: props.rowIndex,
      });
    } else {
      content = <div className={contentClass}>{content}</div>;
    }

    var columnResizerComponent;
    if (props.onColumnResize) {
      var columnResizerStyle = {
        height: props.height
      };
      columnResizerComponent = (
        <div
          className={cx('fixedDataTableCellLayout/columnResizerContainer')}
          style={columnResizerStyle}
          onMouseDown={this._onColumnResizerMouseDown}>
          <div
            className={joinClasses(
              cx('fixedDataTableCellLayout/columnResizerKnob'),
              cx('public/fixedDataTableCell/columnResizerKnob'),
            )}
            style={columnResizerStyle}
          />
        </div>
      );
    }

    var innerStyle = {
      height: props.height,
      width: props.width,
    };

    var content;
    if (React.isValidElement(props.cell)){
      content = React.cloneElement(props.cell, {
        rowIndex: props.rowIndex,
        cellHeight: props.height,
        cellWidth: props.width,
      })
    } else {
      content = (
        <FixedDataTableCellWrapper
          cellHeight={props.height}
          cellWidth={props.width}>
          {props.cell}
        </FixedDataTableCellWrapper>
      )
    }

    return (
      <div className={className} style={style}>
        {columnResizerComponent}
        {content}
      </div>
    );
  },

  _onColumnResizerMouseDown(/*object*/ event) {
    this.props.onColumnResize(
      this.props.left,
      this.props.width,
      this.props.minWidth,
      this.props.maxWidth,
      this.props.columnKey,
      event
    );
  },
});

module.exports = FixedDataTableCell;
