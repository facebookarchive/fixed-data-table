"use strict";

var ROWS = 1000000;

var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var columnWidths = {
  firstName: 240,
  lastName: 150,
  sentence: 140,
  companyName: 60,
};
var isColumnResizing;

var ResizeExample = React.createClass({
  propTypes: {
    onContentDimensionsChange: PropTypes.func,
    left: PropTypes.number,
    top: PropTypes.number,
  },

  getInitialState() {
    return {
      dataList: new FakeObjectDataListStore(ROWS),
      columnWidths: columnWidths
    }
  },

  _rowGetter(index) {
    return this.state.dataList.getObjectAt(index);
  },

  _onContentHeightChange(contentHeight) {
    this.props.onContentDimensionsChange &&
      this.props.onContentDimensionsChange(
        contentHeight,
        Math.max(600, this.props.tableWidth)
      );
  },

  _onColumnResizeEndCallback(newColumnWidth, dataKey) {
    var columnWidths = this.state.columnWidths;
    columnWidths[dataKey] = newColumnWidth;
    isColumnResizing = false;
    this.setState({
      columnWidths
    })
  },

  render() {
    var controlledScrolling =
      this.props.left !== undefined || this.props.top !== undefined;

    return (
      <Table
        rowHeight={30}
        headerHeight={50}
        rowGetter={this._rowGetter}
        rowsCount={this.state.dataList.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}
        onContentHeightChange={this._onContentHeightChange}
        scrollTop={this.props.top}
        scrollLeft={this.props.left}
        overflowX={controlledScrolling ? "hidden" : "auto"}
        overflowY={controlledScrolling ? "hidden" : "auto"}
        isColumnResizing={isColumnResizing}
        onColumnResizeEndCallback={this._onColumnResizeEndCallback}>
        <Column
          dataKey="firstName"
          fixed={true}
          label="First Name"
          width={columnWidths['firstName']}
          isResizable={true}
        />
        <Column
          label="Last Name (min/max constrained)"
          dataKey="lastName"
          width={columnWidths['lastName']}
          isResizable={true}
          minWidth={70}
          maxWidth={170}
        />
        <Column
          label="Company"
          dataKey="companyName"
          width={columnWidths['companyName']}
          isResizable={true}
        />
        <Column
          label="Sentence"
          dataKey="sentence"
          width={columnWidths['sentence']}
          isResizable={true}
        />
      </Table>
    );
  }
});

module.exports = ResizeExample;
