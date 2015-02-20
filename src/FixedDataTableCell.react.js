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

var ImmutableObject = require('ImmutableObject');
var React = require('React');

var cloneWithProps = require('cloneWithProps');
var cx = require('cx');
var joinClasses = require('joinClasses');

var PropTypes = React.PropTypes;

var DEFAULT_PROPS = new ImmutableObject({
  align: 'left',
  highlighted: false,
  isFooterCell: false,
  isHeaderCell: false,
});

var FixedDataTableCell = React.createClass({

  propTypes: {
    align: PropTypes.oneOf(['left', 'center', 'right']),
    className: PropTypes.string,
    highlighted: PropTypes.bool,
    isFooterCell: PropTypes.bool,
    isHeaderCell: PropTypes.bool,
    width: PropTypes.number.isRequired,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    height: PropTypes.number.isRequired,

    /**
     * The cell data that will be passed to `cellRenderer` to render.
     */
    cellData: PropTypes.any,

    /**
     * The key to retrieve the cell data from the `rowData`.
     */
    cellDataKey: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.number.isRequired,
    ]),

    /**
     * The function to render the `cellData`.
     */
    cellRenderer: PropTypes.func.isRequired,

    /**
     * The column data that will be passed to `cellRenderer` to render.
     */
    columnData: PropTypes.any,

    /**
     * The row data that will be passed to `cellRenderer` to render.
     */
    rowData: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.array.isRequired,
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
     * @param number leftOffset
     * @param number width
     * @param number minWidth
     * @param number maxWidth
     * @param number|string columnKey
     * @param object event
     */
    onColumnResize: PropTypes.func,

    /**
     * Width of the all the cells preceding this cell that
     * are in its column group.
     */
    widthOffset: PropTypes.number,

    /**
     * The left offset in pixels of the cell.
     */
    left: PropTypes.number,
  },

  shouldComponentUpdate(/*object*/ nextProps) /*boolean*/ {
    var props = this.props;
    var key;
    for (key in props) {
      if (props[key] !== nextProps[key] &&
          key !== 'left') {
        return true;
      }
    }
    for (key in nextProps) {
      if (props[key] !== nextProps[key] &&
          key !== 'left') {
        return true;
      }
    }

    return false;
  },

  getDefaultProps() /*object*/ {
    return DEFAULT_PROPS;
  },

  render() /*object*/ {
    var props = this.props;

    var style = {
      width: props.width,
      height: props.height
    };

    var className = joinClasses(
      cx({
        'public/fixedDataTableCell/main': true,
        'public/fixedDataTableCell/highlighted': props.highlighted,
        'public/fixedDataTableCell/lastChild': props.lastChild,
        'public/fixedDataTableCell/alignRight': props.align === 'right',
        'public/fixedDataTableCell/alignCenter': props.align === 'center'
      }),
      props.className
    );

    var content;
    if (props.isHeaderCell || props.isFooterCell) {
      content = props.cellRenderer(
        props.cellData,
        props.cellDataKey,
        props.columnData,
        props.rowData,
        props.width
      );
    } else {
      content = props.cellRenderer(
        props.cellData,
        props.cellDataKey,
        props.rowData,
        props.rowIndex,
        props.columnData,
        props.width
      );
    }

    var contentClass = cx('public/fixedDataTableCell/cellContent');
    if (React.isValidElement(content)) {
      content = cloneWithProps(content, {className: contentClass});
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
          className={cx('fixedDataTableCell/columnResizerContainer')}
          style={columnResizerStyle}
          onMouseDown={this._onColumnResizerMouseDown}>
          <div
            className={cx('fixedDataTableCell/columnResizerKnob')}
            style={columnResizerStyle}
          />
        </div>
      );
    }
    return (
      <div className={className} style={style}>
        {columnResizerComponent}
        <div className={cx('public/fixedDataTableCell/wrap1')} style={style}>
          <div className={cx('public/fixedDataTableCell/wrap2')}>
            <div className={cx('public/fixedDataTableCell/wrap3')}>
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  },

  _onColumnResizerMouseDown(/*object*/ event) {
    this.props.onColumnResize(
      this.props.widthOffset,
      this.props.width,
      this.props.minWidth,
      this.props.maxWidth,
      this.props.cellDataKey,
      event
    );
  },
});

module.exports = FixedDataTableCell;
