"use strict";

var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;

function renderImage(/*string*/ cellData) {
  return (
    <img 
      src={cellData} 
      key={cellData} 
      width={50} 
      height={50} 
      className="exampleImage" 
    />
  );
}

function renderLink(/*string*/ cellData) {
  return <a href="#">{cellData}</a>;
}

function renderDate(/*object*/ cellData) {
  return <span>{cellData.toLocaleString()}</span>;
}

var ObjectDataExample = React.createClass({
  render() {
    return (
      <Table
        rowHeight={50}
        headerHeight={50}
        rowGetter={FakeObjectDataListStore.getObjectAt}
        rowsCount={FakeObjectDataListStore.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}>
        <Column
          cellClassName="exampleTableCell"
          cellRenderer={renderImage}
          dataKey="avartar"
          fixed={true}
          label=""
          width={50}
        />
        <Column
          dataKey="firstName"
          fixed={true}
          label="First Name"
          width={100}
        />
        <Column
          dataKey="lastName"
          fixed={true}
          label="Last Name"
          width={100}
        />
        <Column
          dataKey="city"
          label="City"
          width={100}
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
          cellRenderer={renderLink}
          label="Email"
          width={200}
          dataKey="email"
        />
        <Column
          cellRenderer={renderDate}
          label="DOB"
          width={200}
          dataKey="date"
        />
      </Table>
    );
  }
});

module.exports = ObjectDataExample;
