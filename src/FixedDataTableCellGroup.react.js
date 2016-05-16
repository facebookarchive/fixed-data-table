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

const FixedDataTableHelper = require('FixedDataTableHelper');
const React = require('React');
const FixedDataTableCell = require('FixedDataTableCell.react');

const cx = require('cx');
const translateDOMPositionXY = require('translateDOMPositionXY');

const {PropTypes} = React;

const DIR_SIGN = FixedDataTableHelper.DIR_SIGN;

const FixedDataTableCellGroupImpl = React.createClass({

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

    left: PropTypes.number,

    onColumnResize: PropTypes.func,

    rowHeight: PropTypes.number.isRequired,

    rowIndex: PropTypes.number.isRequired,

    width: PropTypes.number.isRequired,

    zIndex: PropTypes.number.isRequired,
  },

  render() /*object*/ {
    const props = this.props;
    const columns = props.columns;
    const cells = new Array(columns.length);

    let currentPosition = 0;
    for (let i = 0, j = columns.length; i < j; i++) {
      const columnProps = columns[i].props;
      if (!columnProps.allowCellsRecycling || (
            currentPosition - props.left <= props.width &&
            currentPosition - props.left + columnProps.width >= 0)) {
        const key = 'cell_' + i;
        cells[i] = this._renderCell(
          props.rowIndex,
          props.rowHeight,
          columnProps,
          currentPosition,
          key,
        );
      }
      currentPosition += columnProps.width;
    }

    const contentWidth = this._getColumnsWidth(columns);

    const style = {
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
    /*string*/ key
  ) /*object*/ {

    const cellIsResizable = columnProps.isResizable &&
      this.props.onColumnResize;
    var onColumnResize = cellIsResizable ? this.props.onColumnResize : null;

    const className = columnProps.cellClassName;

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
      />
    );
  },

  _getColumnsWidth(/*array*/ columns) /*number*/ {
    let width = 0;
    for (let i = 0; i < columns.length; ++i) {
      width += columns[i].props.width;
    }
    return width;
  },
});

const FixedDataTableCellGroup = React.createClass({

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
    const {offsetLeft, ...props} = this.props;

    const style = {
      height: props.height,
    };

    if (DIR_SIGN === 1) {
      style.left = offsetLeft;
    } else {
      style.right = offsetLeft;
    }

    const onColumnResize = props.onColumnResize ? this._onColumnResize : null;

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
