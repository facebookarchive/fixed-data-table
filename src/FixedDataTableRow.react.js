/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableRow.react
 * @typechecks
 */
'use strict';

var FixedDataTableHelper = require('FixedDataTableHelper');
var React = require('React');
var ReactComponentWithPureRenderMixin = require('ReactComponentWithPureRenderMixin');
var FixedDataTableCellGroup = require('FixedDataTableCellGroup.react');

var cx = require('cx');
var joinClasses = require('joinClasses');
var translateDOMPositionXY = require('translateDOMPositionXY');

var DIR_SIGN = FixedDataTableHelper.DIR_SIGN;
var {PropTypes} = React;

/**
 * Component that renders the row for <FixedDataTable />.
 * This component should not be used directly by developer. Instead,
 * only <FixedDataTable /> should use the component internally.
 */
var FixedDataTableRowImpl = React.createClass({
  mixins: [ReactComponentWithPureRenderMixin],

  propTypes: {
    /**
     * The row data to render. The data format can be a simple Map object
     * or an Array of data.
     */
    data: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ]),

    /**
     * Array of <FixedDataTableColumn /> for the fixed columns.
     */
    fixedColumns: PropTypes.array.isRequired,

    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    /**
     * The row index.
     */
    index: PropTypes.number.isRequired,

    /**
     * Array of <FixedDataTableColumn /> for the scrollable columns.
     */
    scrollableColumns: PropTypes.array.isRequired,

    /**
     * The distance between the left edge of the table and the leftmost portion
     * of the row currently visible in the table.
     */
    scrollLeft: PropTypes.number.isRequired,

    /**
     * Width of the row.
     */
    width: PropTypes.number.isRequired,

    /**
     * Fire when a row is clicked.
     */
    onClick: PropTypes.func,

    /**
     * Callback for when resizer knob (in FixedDataTableCell) is clicked
     * to initialize resizing. Please note this is only on the cells
     * in the header.
     * @param number combinedWidth
     * @param number leftOffset
     * @param number cellWidth
     * @param number|string columnKey
     * @param object event
     */
    onColumnResize: PropTypes.func,
  },

  render() /*object*/ {
    var style = {
      width: this.props.width,
      height: this.props.height,
    };

    var className = cx({
      'public/fixedDataTableRow/main': true,
      'public/fixedDataTableRow/highlighted': (this.props.index % 2 === 1)
    });

    if (!this.props.data) {
      return (
        <div
          className={joinClasses(className, this.props.className)}
          style={style}
        />
      );
    }

    var fixedColumns =
      <FixedDataTableCellGroup
        key="fixed_cells"
        height={this.props.height}
        left={0}
        zIndex={2}
        columns={this.props.fixedColumns}
        data={this.props.data}
        onColumnResize={this.props.onColumnResize}
        rowHeight={this.props.height}
        rowIndex={this.props.index}
      />;
    var fixedColumnsWidth = this._getColumnsWidth(this.props.fixedColumns);
    var columnsShadow = this._renderColumnsShadow(fixedColumnsWidth);
    var scrollableColumns =
      <FixedDataTableCellGroup
        key="scrollable_cells"
        height={this.props.height}
        left={(fixedColumnsWidth - this.props.scrollLeft) * DIR_SIGN}
        zIndex={0}
        columns={this.props.scrollableColumns}
        data={this.props.data}
        onColumnResize={this.props.onColumnResize}
        rowHeight={this.props.height}
        rowIndex={this.props.index}
      />;

    var optionalProps = {};
    if ('draggable' in this.props) {
      optionalProps.draggable = this.props.draggable;
    }

    return (
      <div
        className={joinClasses(className, this.props.className)}
        onClick={this.props.onClick ? this._onClick : null}
        onContextMenu={this.props.onContextMenu ? this._onContextMenu : null}
        onDoubleClick={this.props.onDoubleClick ? this._onDoubleClick : null}
        onDrag={this.props.onDrag ? this._onDrag : null}
        onDragEnd={this.props.onDragEnd ? this._onDragEnd : null}
        onDragEnter={this.props.onDragEnter ? this._onDragEnter : null}
        onDragExit={this.props.onDragExit ? this._onDragExit : null}
        onDragLeave={this.props.onDragLeave ? this._onDragLeave : null}
        onDragOver={this.props.onDragOver ? this._onDragOver : null}
        onDragStart={this.props.onDragStart ? this._onDragStart : null}
        onDrop={this.props.onDrop ? this._onDrop : null}
        onMouseDown={this.props.onMouseDown ? this._onMouseDown : null}
        onMouseEnter={this.props.onMouseEnter ? this._onMouseEnter : null}
        onMouseLeave={this.props.onMouseLeave ? this._onMouseLeave : null}
        onMouseMove={this.props.onMouseMove ? this._onMouseMove : null}
        onMouseOut={this.props.onMouseOut ? this._onMouseOut : null}
        onMouseOver={this.props.onMouseOver ? this._onMouseOver : null}
        onMouseUp={this.props.onMouseUp ? this._onMouseUp : null}
        style={style}
        {...optionalProps}>
        <div className={cx('fixedDataTableRow/body')}>
          {fixedColumns}
          {scrollableColumns}
          {columnsShadow}
        </div>
      </div>
    );
  },

  _getColumnsWidth(/*array*/ columns) /*number*/ {
    var width = 0;
    for (var i = 0; i < columns.length; ++i) {
      width += columns[i].props.width;
    }
    return width;
  },

  _renderColumnsShadow(/*number*/ left) /*?object*/ {
    if (left > 0) {
      var className = cx({
        'fixedDataTableRow/fixedColumnsDivider': true,
        'fixedDataTableRow/columnsShadow': this.props.scrollLeft > 0,
      });
      var style = {
        left: left,
        height: this.props.height
      };
      return <div className={className} style={style} />;
    }
  },

  _onClick(/*object*/ event) {
    this.props.onClick(event, this.props.index, this.props.data);
  },

  _onContextMenu(/*object*/ event) {
    this.props.onContextMenu(event, this.props.index, this.props.data);
  },

  _onDoubleClick(/*object*/ event) {
    this.props.onDoubleClick(event, this.props.index, this.props.data);
  },

  _onDrag(/*object*/ event) {
    this.props.onDrag(event, this.props.index, this.props.data);
  },

  _onDragEnd(/*object*/ event) {
    this.props.onDragEnd(event, this.props.index, this.props.data);
  },

  _onDragEnter(/*object*/ event) {
    this.props.onDragEnter(event, this.props.index, this.props.data);
  },

  _onDragExit(/*object*/ event) {
    this.props.onDragExit(event, this.props.index, this.props.data);
  },

  _onDragLeave(/*object*/ event) {
    this.props.onDragLeave(event, this.props.index, this.props.data);
  },

  _onDragOver(/*object*/ event) {
    this.props.onDragOver(event, this.props.index, this.props.data);
  },

  _onDragStart(/*object*/ event) {
    this.props.onDragStart(event, this.props.index, this.props.data);
  },

  _onDrop(/*object*/ event) {
    this.props.onDrop(event, this.props.index, this.props.data);
  },

  _onMouseDown(/*object*/ event) {
    this.props.onMouseDown(event, this.props.index, this.props.data);
  },

  _onMouseEnter(/*object*/ event) {
    this.props.onMouseEnter(event, this.props.index, this.props.data);
  },

  _onMouseLeave(/*object*/ event) {
    this.props.onMouseLeave(event, this.props.index, this.props.data);
  },

  _onMouseMove(/*object*/ event) {
    this.props.onMouseMove(event, this.props.index, this.props.data);
  },

  _onMouseOut(/*object*/ event) {
    this.props.onMouseOut(event, this.props.index, this.props.data);
  },

  _onMouseOver(/*object*/ event) {
    this.props.onMouseOver(event, this.props.index, this.props.data);
  },

  _onMouseUp(/*object*/ event) {
    this.props.onMouseUp(event, this.props.index, this.props.data);
  },

});

var FixedDataTableRow = React.createClass({
  mixins: [ReactComponentWithPureRenderMixin],

  propTypes: {
    /**
     * Height of the row.
     */
    height: PropTypes.number.isRequired,

    /**
     * Z-index on which the row will be displayed. Used e.g. for keeping
     * header and footer in front of other rows.
     */
    zIndex: PropTypes.number,

    /**
     * The vertical position where the row should render itself
     */
    offsetTop: PropTypes.number.isRequired,

    /**
     * Width of the row.
     */
    width: PropTypes.number.isRequired,
  },

  render() /*object*/ {
    var style = {
      width: this.props.width,
      height: this.props.height,
      zIndex: (this.props.zIndex ? this.props.zIndex : 0),
    };
    translateDOMPositionXY(style, 0, this.props.offsetTop);

    return (
      <div
        style={style}
        className={cx('fixedDataTableRow/rowWrapper')}>
        <FixedDataTableRowImpl
          {...this.props}
          offsetTop={undefined}
          zIndex={undefined}
        />
      </div>
    );
  },
});


module.exports = FixedDataTableRow;
