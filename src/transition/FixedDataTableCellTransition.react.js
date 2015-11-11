/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableCellTransition.react
 */

/**
 * TRANSITION SHIM
 * This acts to provide an intermediate mapping from the old API to the new API.
 *
 * When ready, remove this file and rename the providesModule in
 * FixedDataTableCellNew.react and dependency in FixedDataTableCellGroup.react
 */

var React = require('React');
var {PropTypes} = React;

var cx = require('cx');
var joinClasses = require('joinClasses');
var shallowEqual = require('shallowEqual');

var CellDefault = require('FixedDataTableCellDefault.react');

var TransitionCell = React.createClass({

  propTypes: {
    label: PropTypes.string, // header, footer
    className: PropTypes.string,
    rowIndex: PropTypes.number,
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
    isFooterCell: PropTypes.bool, // footer
  },

  shouldComponentUpdate(/*object*/ nextProps): boolean {
    var update = false;
    var rowData;
    if (nextProps.rowGetter) {
      rowData = nextProps.rowGetter(nextProps.rowIndex);
      if (this._rowData !== rowData) {
        update = true;
      }
    }

    var cellData;
    if (nextProps.dataKey != null) {
      if (nextProps.cellDataGetter) {
        cellData = nextProps.cellDataGetter(nextProps.dataKey, rowData);
      }
      if (!cellData && rowData) {
        cellData = rowData[nextProps.dataKey];
      }
    }
    if (this._cellData !== cellData) {
      update = true;
    }
    this._rowData = rowData;
    this._cellData = cellData;

    return update || !shallowEqual(nextProps, this.props);
  },

  _getCellData(props) {
    var dataKey = props.dataKey;
    if (dataKey == null) {
      return null;
    }

    var rowData;
    if (props.rowGetter) {
      rowData = props.rowGetter(props.rowIndex);
    }

    if (props.cellDataGetter) {
      return props.cellDataGetter(dataKey, rowData);
    }

    if (rowData) {
      return rowData[dataKey];
    }

    if (props.footerDataGetter) {
      return props.footerDataGetter()[dataKey];
    }

    if (props.footerData) {
      return props.footerData[dataKey];
    }

    if (props.headerDataGetter) {
      return props.headerDataGetter[dataKey];
    }
  },

  _getRowData(props): Object {
    if (props.rowGetter) {
      return props.rowGetter(props.rowIndex) || {};
    }

    if (props.footerDataGetter) {
      return props.footerDataGetter() || {};
    }

    if (props.footerData) {
      return props.footerData || {};
    }

    return {};
  },

  render() {
    var props = this.props;

    var cellData = this._getCellData(props);
    var content = cellData;
    var rowData = this._getRowData(props);
    var usingRenderer = !!(props.cellRenderer || props.groupHeaderRenderer);

    if (props.isHeaderCell || props.isFooterCell) {
      content = content || props.label;
    }

    if (props.cellRenderer) {
      if (props.isHeaderCell || props.isFooterCell) {
        content = props.cellRenderer(
          props.label,
          props.dataKey,
          props.columnData,
          rowData,
          props.width,
        ) || props.label;
      } else {
        content = props.cellRenderer(
          cellData,
          props.dataKey,
          rowData,
          props.rowIndex,
          props.columnData,
          props.width,
        );
      }
    }

    if (props.groupHeaderRenderer) {
      content = props.groupHeaderRenderer(
        props.label,
        props.dataKey, // index in children
        props.groupHeaderData,
        props.groupHeaderLabels,
        props.width,
      ) || content;
    }

    var contentClass = cx('public/fixedDataTableCell/cellContent');

    if (React.isValidElement(content) && usingRenderer) {
      content = React.cloneElement(content, {
        className: joinClasses(content.props.className, contentClass)
      });
    } else {
      return (
        <CellDefault
          {...props}>
          {content}
        </CellDefault>
      );
    }

    var innerStyle = {
      height: props.height,
      width: props.width,
      ...props.style,
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
    );

  }
});

module.exports = TransitionCell;
