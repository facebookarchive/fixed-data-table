"use strict";

var FakeObjectDataListStore = require('../examples/FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');
var Constants = require('../Constants');

var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

// Require common FixedDataTable CSS.
require('fixed-data-table/css/Scrollbar.css');
require('fixed-data-table/css/fixedDataTable.css');
require('fixed-data-table/css/fixedDataTableCell.css');
require('fixed-data-table/css/fixedDataTableCellGroup.css');
require('fixed-data-table/css/fixedDataTableColumnResizerLine.css');
require('fixed-data-table/css/fixedDataTableRow.css');

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
        rowGetter={FakeObjectDataListStore.getObjectAt}
        rowsCount={FakeObjectDataListStore.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}>
        <Column
          flexGrow={1}
          dataKey="firstName"
          fixed={true}
          label="First Name"
          width={150}
        />
        <Column
          flexGrow={1}
          dataKey="lastName"
          fixed={true}
          label="Last Name"
          width={120}
        />
        <Column
          flexGrow={1}
          dataKey="city"
          label="City"
          width={200}
        />
        <Column
          label="Street"
          width={200}
          dataKey="street"
        />
        <Column
          label="Zip Code"
          width={200}
          dataKey="zipCode"
        />
        <Column
          label="Email"
          width={200}
          dataKey="email"
        />
        <Column
          label="DOB"
          width={200}
          dataKey="date"
        />
      </Table>
    );
  }
});

module.exports = HeroTable;

