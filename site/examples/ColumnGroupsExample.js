"use strict";

var ROWS = 1000000;

var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Cell = FixedDataTable.Cell;
var Column = FixedDataTable.Column;
var ColumnGroup = FixedDataTable.ColumnGroup;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var TextCell = React.createClass({
  propTypes: {
    data: PropTypes.any,
    rowIndex: PropTypes.number,
  },

  _getData() {
    return this.props.data.getObjectAt(this.props.rowIndex)[this.props.columnKey];
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

var ColumnGroupsExample = React.createClass({
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

  render() {
    var controlledScrolling =
      this.props.left !== undefined || this.props.top !== undefined;

    return (
      <Table
        rowHeight={30}
        groupHeaderHeight={30}
        headerHeight={30}
        rowsCount={this.state.dataList.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}
        scrollTop={this.props.top}
        scrollLeft={this.props.left}
        overflowX={controlledScrolling ? "hidden" : "auto"}
        overflowY={controlledScrolling ? "hidden" : "auto"}>
        <ColumnGroup
          fixed={true}
          header="Name">
          <Column
            fixed={true}
            columnKey="firstName"
            header="First Name"
            cell={<TextCell data={this.state.dataList}/>}
            width={150}
          />
          <Column
            fixed={true}
            header="Last Name"
            columnKey="lastName"
            cell={<TextCell data={this.state.dataList}/>}
            width={150}
          />
        </ColumnGroup>
        <ColumnGroup header="About">
          <Column
            header="Company"
            columnKey="companyName"
            cell={<TextCell data={this.state.dataList}/>}
            flexGrow={1}
            width={150}
          />
          <Column
            header="Sentence"
            columnKey="sentence"
            cell={<TextCell data={this.state.dataList}/>}
            flexGrow={1}
            width={150}
          />
        </ColumnGroup>
      </Table>
    );
  }
});

module.exports = ColumnGroupsExample;
