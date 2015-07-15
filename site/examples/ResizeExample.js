"use strict";

var ROWS = 1000000;

var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Cell = FixedDataTable.Cell;
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

var ImageCell = React.createClass({
  propTypes: {
    data: PropTypes.any,
    dataKey: PropTypes.string,
    rowIndex: PropTypes.number,
  },
  _getData() {
    return this.props.data.getObjectAt(this.props.rowIndex)[this.props.dataKey];
  },
  render() {
    return (
      <ExampleImage src={this._getData()} />
    )
  }
})

var TextCell = React.createClass({
  propTypes: {
    dataKey: PropTypes.string,
    data: PropTypes.any,
    rowIndex: PropTypes.number,
  },
  _getData() {
    return this.props.data.getObjectAt(this.props.rowIndex)[this.props.dataKey];
  },
  render() {
    return (
      <Cell
        {...this.props}>
        {this._getData()}
      </Cell>
    )
  }
})

var ResizeExample = React.createClass({
  propTypes: {
    onContentDimensionsChange: PropTypes.func,
    left: PropTypes.number,
    top: PropTypes.number,
  },

  getInitialState() {
    return {
      dataList: new FakeObjectDataListStore(ROWS)
    }
  },

  _onContentHeightChange(contentHeight) {
    this.props.onContentDimensionsChange &&
      this.props.onContentDimensionsChange(
        contentHeight,
        Math.max(600, this.props.tableWidth)
      );
  },

  _onColumnResizeEndCallback(newColumnWidth, dataKey) {
    debugger
    columnWidths[dataKey] = newColumnWidth;
    isColumnResizing = false;
    this.forceUpdate(); // don't do this, use a store and put into this.state!
  },

  render() {
    var controlledScrolling =
      this.props.left !== undefined || this.props.top !== undefined;

    return (
      <Table
        rowHeight={30}
        headerHeight={50}
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
          header="First Name"
          cell={<TextCell data={this.state.dataList} dataKey='firstName' />}
          fixed={true}
          width={columnWidths['firstName']}
          isResizable={true}
          key='firstName'
        />
        <Column
          header="Last Name (min/max constrained)"
          cell={<TextCell data={this.state.dataList} dataKey='lastName' />}
          width={columnWidths['lastName']}
          isResizable={true}
          minWidth={70}
          maxWidth={170}
          key='lastName'
        />
        <Column
          header="Company"
          cell={<TextCell data={this.state.dataList} dataKey='companyName' />}
          width={columnWidths['companyName']}
          isResizable={true}
          key='companyName'
        />
        <Column
          header="Sentence"
          cell={<TextCell data={this.state.dataList} dataKey='sentence' />}
          width={columnWidths['sentence']}
          isResizable={true}
          key='sentence'
        />
      </Table>
    );
  }
});

module.exports = ResizeExample;
