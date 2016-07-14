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

var DOMMouseMoveTracker = require('DOMMouseMoveTracker');

var FixedDataTableHelper = require('FixedDataTableHelper');
var React = require('React');
var FixedDataTableCell = require('FixedDataTableCell.react');

var cx = require('cx');
var translateDOMPositionXY = require('translateDOMPositionXY');

var {PropTypes} = React;

var DIR_SIGN = FixedDataTableHelper.DIR_SIGN;

var FixedDataTableCellGroupImpl = React.createClass({

  getInitialState: function () {
    return {
      reorderColumnIndex: null,
      reorderColumnWidth: null,
      dragOffset: 0,
      positionShifts: null
    };
  },

  /**
   * PropTypes are disabled in this component, because having them on slows
   * down the FixedDataTable hugely in DEV mode. You can enable them back for
   * development, but please don't commit this component with enabled propTypes.
   */
  propTypes_DISABLED_FOR_PERFORMANCE: {

    /**
     * Array of <FixedDataTableColumn />.
     */
    columns: PropTypes.array.isRequired,

    isScrolling: PropTypes.bool,

    isReorderingColumn: PropTypes.bool,

    left: PropTypes.number,

    onColumnResize: PropTypes.func,

    rowHeight: PropTypes.number.isRequired,

    rowIndex: PropTypes.number.isRequired,

    width: PropTypes.number.isRequired,

    zIndex: PropTypes.number.isRequired,
  },

  _onColumnReorderStart (index, event) {
    console.log('start');
    this.mouseMoveTracker = new DOMMouseMoveTracker(
      this._onColumnReorderMove,
      this._onColumnReorderEnd,
      document.body
    );
    this.mouseMoveTracker.captureMouseMoves(event);

    this.setState({
      reorderColumnIndex: index,
      reorderColumnWidth: this.props.columns[index].props.width,
      dragOffset: 0,
      isInitialDrag: true
    });
  },

  _onColumnReorderMove (deltaX) {
    if (!this.curtain) {
      console.log('adding curtain');
      var curtain = document.createElement('div');
      curtain.style.zIndex = 10000000;
      curtain.style.position = 'fixed';
      curtain.style.top = 0;
      curtain.style.left = 0;
      curtain.style.bottom = 0;
      curtain.style.right = 0;
      curtain.style.cursor = 'grabbing';
      if (!curtain.style.cursor) {
        curtain.style.cursor = '-webkit-grabbing';
      }
      curtain.className = cx('fixedDataTable/columnReorderCurtain');
      document.body.appendChild(curtain);
      this.curtain = curtain;
    }

    var reorderColumnIndex = this.state.reorderColumnIndex;
    var reorderColumnWidth = this.state.reorderColumnWidth;
    var currentPosition = 0;
    var lefts = this.props.columns.map(function (column) {
      var oldCurrentPosition = currentPosition;
      currentPosition += column.props.width;
      return oldCurrentPosition;
    });

    var reorderColumnLeft = lefts[reorderColumnIndex] + this.state.dragOffset;
    var reorderColumnRight = reorderColumnLeft + reorderColumnWidth;

    var self = this;
    var positionShifts = lefts.map(function (left, i) {
      var centerOfThisColumn = left + (self.props.columns[i].props.width / 2);
      if (i < reorderColumnIndex && reorderColumnLeft < centerOfThisColumn) {
        return 1;
      } else if (i > reorderColumnIndex && reorderColumnRight > centerOfThisColumn) {
        return -1;
      }
      return 0;
    });

    this.setState({
      dragOffset: this.state.dragOffset + deltaX,
      isInitialDrag: false,
      positionShifts: positionShifts
    });
  },

  _onColumnReorderEnd () {
    console.log('done!');
    this.mouseMoveTracker.releaseMouseMoves();
    if (this.curtain) {
      var curtain = this.curtain;
      this.curtain = null;
      // this stops the mouseUp from triggering a click event.
      setTimeout(function () {
        document.body.removeChild(curtain);
      }, 100);
    }
    var columnBeforeIndex, columnAfterIndex;
    var shifts = this.state.positionShifts.reduce(function (a, b) { return a + b; });
    if (shifts > 0) {
      // moved left
      columnAfterIndex = this.state.positionShifts.indexOf(1);
      columnBeforeIndex = columnAfterIndex - 1;
    } else if (shifts < 0) {
      // moved right
      columnBeforeIndex = this.state.positionShifts.lastIndexOf(-1);
      columnAfterIndex = columnBeforeIndex + 1;
    }

    if (columnBeforeIndex || columnAfterIndex) {
      var columnBefore;
      var columnAfter;
      var reorderColumn = this.props.columns[this.state.reorderColumnIndex].props.columnKey;
      if (columnBeforeIndex !== -1) {
        columnBefore = this.props.columns[columnBeforeIndex].props.columnKey;
      }
      if (columnAfterIndex !== this.props.columns.length) {
        columnAfter = this.props.columns[columnAfterIndex].props.columnKey;
      }
      this.props.onColumnReorder({
        columnBefore,
        columnBeforeIndex,
        columnAfter,
        columnAfterIndex,
        reorderColumn,
        reorderColumnIndex: this.state.reorderColumnIndex
      });
    }

    this.setState(this.getInitialState());
  },

  render() /*object*/ {
    var props = this.props;
    var columns = props.columns;
    var cells = new Array(columns.length);

    var currentPosition = 0;
    var lefts = columns.map(function (column) {
      var oldCurrentPosition = currentPosition;
      currentPosition += column.props.width;
      return oldCurrentPosition;
    });

    if (this.state.reorderColumnIndex !== null) {
      var self = this;
      lefts = lefts.map(function (left, i) {
        if (i === self.state.reorderColumnIndex) {
          var fullWidth = columns.reduce(function (acc, column) {
            return acc + column.props.width;
          }, 0);
          left = left + self.state.dragOffset;
          left = Math.max(left, 0);
          left = Math.min(left, fullWidth - columns[i].props.width);
          return left;
        }
        switch (self.state.positionShifts && self.state.positionShifts[i]) {
          case 0:
          case null:
            return left;
          case 1:
            return left + self.state.reorderColumnWidth;
          case -1:
            return left - self.state.reorderColumnWidth;
        }
      });
    }

    for (var i = 0, j = columns.length; i < j; i++) {
      var columnProps = columns[i].props;
      if (!columnProps.allowCellsRecycling || (
            lefts[i] - props.left <= props.width &&
            lefts[i] - props.left + columnProps.width >= 0)) {
        var key = 'cell_' + i;
        cells[i] = this._renderCell(
          props.rowIndex,
          props.rowHeight,
          columnProps,
          lefts[i],
          key,
          i
        );
      }
    }

    var contentWidth = this._getColumnsWidth(columns);

    var style = {
      height: props.height,
      position: 'absolute',
      width: contentWidth,
      zIndex: props.zIndex,
    };
    translateDOMPositionXY(style, -1 * DIR_SIGN * props.left, 0);

    return (
      <div
        className={cx('fixedDataTableCellGroupLayout/cellGroup')}
        style={style}>
        {cells}
      </div>
    );
  },

  _renderCell(
    /*number*/ rowIndex,
    /*number*/ height,
    /*object*/ columnProps,
    /*number*/ left,
    /*string*/ key,
    /*number*/ index,
  ) /*object*/ {

    var cellIsResizable = columnProps.isResizable &&
      this.props.onColumnResize;
    var onColumnResize = cellIsResizable ? this.props.onColumnResize : null;

    var className = columnProps.cellClassName;

    return (
      <FixedDataTableCell
        isScrolling={this.props.isScrolling}
        align={columnProps.align}
        className={className}
        height={height}
        key={key}
        maxWidth={columnProps.maxWidth}
        minWidth={columnProps.minWidth}
        onColumnResize={onColumnResize}
        rowIndex={rowIndex}
        columnKey={columnProps.columnKey}
        width={columnProps.width}
        left={left}
        cell={columnProps.cell}
        onColumnReorderStart={this.props.onColumnReorder ? this._onColumnReorderStart.bind(this, index) : null}
        isReorderingThisColumn={this.state.reorderColumnIndex === index}
      />
    );
  },

  _getColumnsWidth(/*array*/ columns) /*number*/ {
    var width = 0;
    for (var i = 0; i < columns.length; ++i) {
      width += columns[i].props.width;
    }
    return width;
  },
});

var FixedDataTableCellGroup = React.createClass({

  /**
   * PropTypes are disabled in this component, because having them on slows
   * down the FixedDataTable hugely in DEV mode. You can enable them back for
   * development, but please don't commit this component with enabled propTypes.
   */
  propTypes_DISABLED_FOR_PERFORMANCE: {
    isScrolling: PropTypes.bool,
    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    offsetLeft: PropTypes.number,

    left: PropTypes.number,
    /**
     * Z-index on which the row will be displayed. Used e.g. for keeping
     * header and footer in front of other rows.
     */
    zIndex: PropTypes.number.isRequired,
  },

  shouldComponentUpdate(/*object*/ nextProps) /*boolean*/ {
    return (
      !nextProps.isScrolling ||
      this.props.rowIndex !== nextProps.rowIndex ||
      this.props.left !== nextProps.left
    );
  },

  getDefaultProps() /*object*/ {
    return {
      offsetLeft: 0,
    };
  },

  render() /*object*/ {
    var {offsetLeft, ...props} = this.props;

    var style = {
      height: props.height,
    };

    if (DIR_SIGN === 1) {
      style.left = offsetLeft;
    } else {
      style.right = offsetLeft;
    }

    var onColumnResize = props.onColumnResize ? this._onColumnResize : null;

    return (
      <div
        style={style}
        className={cx('fixedDataTableCellGroupLayout/cellGroupWrapper')}>
        <FixedDataTableCellGroupImpl
          {...props}
          onColumnResize={onColumnResize}
        />
      </div>
    );
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
