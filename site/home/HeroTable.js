"use strict";

var FakeObjectDataListStore = require('../../examples/helpers/FakeObjectDataListStore');
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

var dataList = new FakeObjectDataListStore();
var FakeTextCell = ({rowIndex, field, ...props}) => (
  <Cell {...props}>
    {dataList.getObjectAt(rowIndex)[field].toString()}
  </Cell>
);

class HeroTable extends React.Component {
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
          fixed={true}
          width={150}
          header={<Cell>First Name</Cell>}
          cell={<FakeTextCell field="firstName" />}
        />
        <Column
          flexGrow={1}
          fixed={true}
          width={120}
          header={<Cell>Last Name</Cell>}
          cell={<FakeTextCell field="lastName" />}
        />
        <Column
          flexGrow={1}
          width={200}
          header={<Cell>City</Cell>}
          cell={<FakeTextCell field="city" />}
        />
        <Column
          width={200}
          header={<Cell>Street</Cell>}
          cell={<FakeTextCell field="street" />}
        />
        <Column
          width={200}
          header={<Cell>Zip Code</Cell>}
          cell={<FakeTextCell field="zipCode" />}
        />
        <Column
          width={200}
          header={<Cell>Email</Cell>}
          cell={<FakeTextCell field="email" />}
        />
        <Column
          width={400}
          header={<Cell>DOB</Cell>}
          cell={<FakeTextCell field="date" />}
        />
        <Column
          flexGrow={1}
          width={400}
          header={<Cell>City</Cell>}
          cell={<FakeTextCell field="city" />}
        />
        <Column
          width={300}
          header={<Cell>BS!</Cell>}
          cell={<FakeTextCell field="bs" />}
        />
        <Column
          width={400}
          header={<Cell>Catch Phrase</Cell>}
          cell={<FakeTextCell field="catchPhrase" />}
        />
        <Column
          width={700}
          header={<Cell>Company Name</Cell>}
          cell={<FakeTextCell field="companyName" />}
        />
      </Table>
    );
  }
}

module.exports = HeroTable;
