"use strict";

var FakeObjectDataListStore = require('../examples/FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');
var Constants = require('../Constants');

var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

// Require common FixedDataTable CSS.
require('fixed-data-table/css/layout/ScrollbarLayout.css');
require('fixed-data-table/css/layout/fixedDataTableLayout.css');
require('fixed-data-table/css/layout/fixedDataTableCellLayout.css');
require('fixed-data-table/css/layout/fixedDataTableCellGroupLayout.css');
require('fixed-data-table/css/layout/fixedDataTableColumnResizerLineLayout.css');
require('fixed-data-table/css/layout/fixedDataTableRowLayout.css');

require('fixed-data-table/css/style/fixedDataTable.css');
require('fixed-data-table/css/style/fixedDataTableCell.css');
require('fixed-data-table/css/style/fixedDataTableColumnResizerLine.css');
require('fixed-data-table/css/style/fixedDataTableRow.css');
require('fixed-data-table/css/style/Scrollbar.css');

var TextCell = React.createClass({
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

var dataList = new FakeObjectDataListStore()

var HeroTable = React.createClass({

  render() {
    return (
      <Table
        scrollLeft={this.props.scrollLeft}
        scrollTop={this.props.scrollTop}
        overflowX="hidden"
        overflowY="hidden"
        rowHeight={50}
        headerHeight={50}
        rowsCount={dataList.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}>
        <Column
          flexGrow={1}
          columnKey="firstName"
          fixed={true}
          header="First Name"
          cell={<TextCell data={dataList} />}
          width={150}
        />
        <Column
          flexGrow={1}
          columnKey="lastName"
          fixed={true}
          header="Last Name"
          cell={<TextCell data={dataList} />}
          width={120}
        />
        <Column
          flexGrow={1}
          columnKey="city"
          header="City"
          cell={<TextCell data={dataList} />}
          width={200}
        />
        <Column
          header="Street"
          width={200}
          columnKey="street"
          cell={<TextCell data={dataList} />}
        />
        <Column
          header="Zip Code"
          width={200}
          columnKey="zipCode"
          cell={<TextCell data={dataList} />}
        />
        <Column
          header="Email"
          width={200}
          columnKey="email"
          cell={<TextCell data={dataList} />}
        />
        <Column
          header="DOB"
          width={400}
          columnKey="date"
          cell={<TextCell data={dataList} />}
        />
        <Column
          flexGrow={1}
          columnKey="city"
          header="City"
          width={400}
          cell={<TextCell data={dataList} />}
        />
        <Column
          columnKey="bs"
          header="BS!"
          width={300}
          cell={<TextCell data={dataList} />}
        />
        <Column
          columnKey="catchPhrase"
          header="Catch Phrase"
          width={400}
          cell={<TextCell data={dataList} />}
        />
        <Column
          columnKey="companyName"
          header="Company Name"
          width={700}
          cell={<TextCell data={dataList} />}
        />
      </Table>
    );
  }
});

module.exports = HeroTable;
