/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableCell.react
 */

/**
 * TRANSITION SHIM
 * This acts to provide an intermediate mapping from the old API to the new API.
 *
 * When ready, remove this file and rename the providesModule in FixedDataTableCellNew.react
 * and dependency in FixedDataTableCellGroup.react
 */


var React = require('React');
var PropTypes = React.PropTypes;

var cx = require('cx');
var joinClasses = require('joinClasses');

var CellDefault = require('FixedDataTableCellDefault.react');

var TransitionCell = React.createClass({
  propTypes: {
    label: PropTypes.string, // header, footer
    className: PropTypes.string,
    rowGetter: PropTypes.func, // cell
    dataKey: PropTypes.oneOfType([ // cell, footer
      PropTypes.string,
      PropTypes.number
    ]),
    cellRenderer: PropTypes.func,
    cellDataGetter: PropTypes.func,
    footerDataGetter: PropTypes.func, // footer
    footerData: PropTypes.any, // footer
    columnData: PropTypes.any, // cell, header
    width: PropTypes.number,
    height: PropTypes.number,
    isHeaderCell: PropTypes.bool, // header
    isFooterCell: PropTypes.bool // footer
  },

  _getRowData() {
    if (this.props.rowGetter){
      return this.props.rowGetter(this.props.rowIndex);
    }
  },

  _getData() {
    var dataKey = this.props.dataKey;
    var rowData = this._getRowData();

    if (this.props.cellDataGetter){
      return this.props.cellDataGetter(dataKey, rowData);
    }

    if (rowData && dataKey){
      return rowData[dataKey];
    }

    if (this.props.footerDataGetter){
      return this.props.footerDataGetter()[dataKey];
    }

    if (this.props.footerData){
      return this.props.footerData[dataKey];
    }
  },

  render() {
    var props = this.props;

    var content = this._getData();

    // Is it a basic cell?
    if (props.cellRenderer){
      content = props.cellRenderer(
        this._getData(),
        props.dataKey,
        this._getRowData(),
        props.rowIndex,
        props.columnData,
        props.width
      );
    }

    // Is it a header?
    if (props.isHeaderCell || props.isFooterCell){
      content = content || props.label;
    }

    if (props.headerRenderer){
      content = props.headerRenderer(
        props.label,
        props.dataKey,
        props.columnData,
        props.width
      ) || props.label;
    }

    // Is it a footer?
    if (props.footerRenderer){
      content = props.footerRenderer(
        props.label,
        props.dataKey,
        props.columnData,
        props.width
      );
    }

    var contentClass = cx('public/fixedDataTableCell/cellContent');

    if (React.isValidElement(content)){
      content = React.cloneElement(content,{
        className: contentClass
      })

    } else {

      return (
        <CellDefault
          {...props}>
          {content}
        </CellDefault>
      );
    }

    var innerStyle = {
      height: this.props.cellHeight,
      width: this.props.cellWidth,
      ...this.props.style,
    };

    return (
      <div
        {...this.props}
        className={joinClasses(
          cx('fixedDataTableCellLayout/wrap1'),
          cx('public/fixedDataTableCell/wrap1'),
          this.props.className
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
            {content}
          </div>
        </div>
      </div>
    )

  }
});

module.exports = TransitionCell;