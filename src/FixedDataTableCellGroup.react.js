/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableCellGroup.react
 * @typechecks
 */

'use strict';

var FixedDataTableHelper = require('FixedDataTableHelper');
var ImmutableObject = require('ImmutableObject');
var React = require('React');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
// TODO: Switch to next line when no longer new.
var FixedDataTableCell = require('FixedDataTableCellNew.react');
// var FixedDataTableCell = require('FixedDataTableCell.react');

var cx = require('cx');
var renderToString = FixedDataTableHelper.renderToString;
var translateDOMPositionXY = require('translateDOMPositionXY');

var {PropTypes} = React;

var DIR_SIGN = FixedDataTableHelper.DIR_SIGN;
var EMPTY_OBJECT = new ImmutableObject({});

var FixedDataTableCellGroup = React.createClass({
  mixins: [ReactComponentWithPureRenderMixin],

  propTypes: {
    /**
     * Array of <FixedDataTableColumn />.
     */
    columns: PropTypes.array.isRequired,

    offsetLeft: PropTypes.number,

    left: PropTypes.number,

    onColumnResize: PropTypes.func,

    rowIndex: PropTypes.number.isRequired,

    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    width: PropTypes.number.isRequired,

    /**
     * Z-index on which the row will be displayed. Used e.g. for keeping
     * header and footer in front of other rows.
     */
    zIndex: PropTypes.number.isRequired,
  },

  getDefaultProps() /*object*/ {
    return {
      offsetLeft: 0,
    };
  },

  render() /*object*/ {
    var {offsetLeft, ...props} = this.props;

    var onColumnResize = props.onColumnResize ? this._onColumnResize : null;

    var outerStyle = {
      height: props.height,
    };

    if (DIR_SIGN === 1) {
      outerStyle.left = offsetLeft;
    } else {
      outerStyle.right = offsetLeft;
    }

    var columns = props.columns;
    var cells = new Array(columns.length);

    var currentPosition = 0;
    for (var i = 0, j = columns.length; i < j; i++) {
      var columnProps = columns[i].props;
      if (!columnProps.allowCellsRecycling || (
            currentPosition - props.left <= props.width &&
            currentPosition - props.left + columnProps.width >= 0)) {
        var key = 'cell_' + i;
        cells[i] = this._renderCell(
          props.rowIndex,
          props.height,
          columnProps,
          onColumnResize,
          currentPosition,
          key,
        );
      }
      currentPosition += columnProps.width;
    }

    var contentWidth = this._getColumnsWidth(columns);

    var innerStyle = {
      height: props.height,
      position: 'absolute',
      width: contentWidth,
      zIndex: props.zIndex,
    };
    translateDOMPositionXY(innerStyle, -1 * DIR_SIGN * props.left, 0);

    return (
      <div
        style={outerStyle}
        className={cx('fixedDataTableCellGroupLayout/cellGroupWrapper')}>
        <div
          className={cx('fixedDataTableCellGroupLayout/cellGroup')}
          style={innerStyle}>
          {cells}
        </div>
      </div>
    );
  },

  _renderCell(
    /*number*/ rowIndex,
    /*number*/ height,
    /*object*/ columnProps,
    /*function*/ onColumnResize,
    /*number*/ left,
    /*string*/ key
  ) /*object*/ {

    var cellIsResizable = columnProps.isResizable && onColumnResize;
    var className = columnProps.cellClassName;

    return (
      <FixedDataTableCell
        align={columnProps.align}
        className={className}
        height={height}
        key={key}
        maxWidth={columnProps.maxWidth}
        minWidth={columnProps.minWidth}
        onColumnResize={cellIsResizable ? onColumnResize: null}
        rowIndex={rowIndex}
        columnKey={columnProps.columnKey}
        width={columnProps.width}
        left={left}
        cell={columnProps.cell}
      />
    );
  },

  _getColumnsWidth(columns: array): number {
    var width = 0;
    for (var i = 0; i < columns.length; ++i) {
      width += columns[i].props.width;
    }
    return width;
  },

  _onColumnResize(
    /*number*/ left,
    /*number*/ width,
    /*?number*/ minWidth,
    /*?number*/ maxWidth,
    /*string|number*/ columnKey,
    /*object*/ event
  ) {
    this.props.onColumnResize && this.props.onColumnResize(
      this.props.offsetLeft,
      left - this.props.left + width,
      width,
      minWidth,
      maxWidth,
      columnKey,
      event
    );
  },

});

module.exports = FixedDataTableCellGroup;
