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
var FixedDataTableCell = require('FixedDataTableCell.react');

var cx = require('cx');
var renderToString = FixedDataTableHelper.renderToString;
var translateDOMPositionXY = require('translateDOMPositionXY');

var {PropTypes} = React;

var EMPTY_OBJECT = new ImmutableObject({});

var FixedDataTableCellGroupImpl = React.createClass({
  mixins: [ReactComponentWithPureRenderMixin],

  propTypes: {

    /**
     * Array of <FixedDataTableColumn />.
     */
    columns: PropTypes.array.isRequired,

    /**
     * The row data to render. The data format can be a simple Map object
     * or an Array of data.
     */
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),

    left: PropTypes.number,

    onColumnResize: PropTypes.func,

    rowHeight: PropTypes.number.isRequired,

    rowIndex: PropTypes.number.isRequired,

    width: PropTypes.number.isRequired,

    zIndex: PropTypes.number.isRequired,
  },

  render() /*object*/ {
    var props = this.props;
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
          props.data,
          props.rowIndex,
          props.rowHeight,
          columnProps,
          currentPosition,
          key
        );
      }
      currentPosition += columnProps.width;
    }

    var contentWidth = this._getColumnsWidth(columns);

    var style = {
      height: props.height,
      position: 'absolute',
      width: contentWidth,
      zIndex: props.zIndex,
    };
    translateDOMPositionXY(style, -1 * props.left, 0);

    return (
      <div className={cx('fixedDataTableCellGroup/cellGroup')} style={style}>
        {cells}
      </div>
    );
  },

  _renderCell(
    /*object|array*/ rowData,
    /*number*/ rowIndex,
    /*number*/ height,
    /*object*/ columnProps,
    /*number*/ left,
    /*string*/ key
  ) /*object*/ {
    var cellRenderer = columnProps.cellRenderer || renderToString;
    var columnData = columnProps.columnData || EMPTY_OBJECT;
    var cellDataKey = columnProps.dataKey;
    var isFooterCell = columnProps.isFooterCell;
    var isHeaderCell = columnProps.isHeaderCell;
    var cellData;

    if (isHeaderCell || isFooterCell) {
      cellData = rowData[cellDataKey];
    } else {
      var cellDataGetter = columnProps.cellDataGetter;
      cellData = cellDataGetter ?
        cellDataGetter(cellDataKey, rowData) :
        rowData[cellDataKey];
    }

    var cellIsResizable = columnProps.isResizable &&
      this.props.onColumnResize;
    var onColumnResize = cellIsResizable ? this.props.onColumnResize : null;

    var className;
    if (isHeaderCell || isFooterCell) {
      className = isHeaderCell ?
        columnProps.headerClassName : columnProps.footerClassName;
    } else {
      className = columnProps.cellClassName;
    }

    return (
      <FixedDataTableCell
        align={columnProps.align}
        cellData={cellData}
        cellDataKey={cellDataKey}
        cellRenderer={cellRenderer}
        className={className}
        columnData={columnData}
        height={height}
        isFooterCell={isFooterCell}
        isHeaderCell={isHeaderCell}
        key={key}
        maxWidth={columnProps.maxWidth}
        minWidth={columnProps.minWidth}
        onColumnResize={onColumnResize}
        rowData={rowData}
        rowIndex={rowIndex}
        width={columnProps.width}
        left={left}
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
});

var FixedDataTableCellGroup = React.createClass({
  mixins: [ReactComponentWithPureRenderMixin],

  propTypes: {
    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    offsetLeft: PropTypes.number,

    /**
     * Z-index on which the row will be displayed. Used e.g. for keeping
     * header and footer in front of other rows.
     */
    zIndex: PropTypes.number.isRequired,
  },

  render() /*object*/ {
    var {offsetLeft, ...props} = this.props;

    var style = {
      height: props.height,
    };

    if (offsetLeft) {
      translateDOMPositionXY(style, offsetLeft, 0);
    }

    var onColumnResize = props.onColumnResize ? this._onColumnResize : null;

    return (
      <div
        style={style}
        className={cx('fixedDataTableCellGroup/cellGroupWrapper')}>
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
    /*string|number*/ cellDataKey,
    /*object*/ event
  ) {
    this.props.onColumnResize && this.props.onColumnResize(
      this.props.offsetLeft,
      left - this.props.left + width,
      width,
      minWidth,
      maxWidth,
      cellDataKey,
      event
    );
  },
});


module.exports = FixedDataTableCellGroup;
