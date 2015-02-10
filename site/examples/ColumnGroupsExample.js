"use strict";

var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Column = FixedDataTable.Column;
var ColumnGroup = FixedDataTable.ColumnGroup;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var ColumnGroupsExample = React.createClass({
  propTypes: {
    onContentDimensionsChange: PropTypes.func,
    left: PropTypes.number,
    top: PropTypes.number,
  },

  render() {
    var controlledScrolling =
      this.props.left !== undefined || this.props.top !== undefined;

    return (
      <Table
        rowHeight={30}
        groupHeaderHeight={30}
        headerHeight={30}
        rowGetter={FakeObjectDataListStore.getObjectAt}
        rowsCount={FakeObjectDataListStore.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}
        scrollTop={this.props.top}
        scrollLeft={this.props.left}
        overflowX={controlledScrolling ? "hidden" : "auto"}
        overflowY={controlledScrolling ? "hidden" : "auto"}>
        <ColumnGroup
          fixed={true}
          label="Name">
          <Column
            fixed={true}
            dataKey="firstName"
            label="First Name"
            width={150}
          />
          <Column
            fixed={true}
            label="Last Name"
            dataKey="lastName"
            width={150}
          />
        </ColumnGroup>
        <ColumnGroup label="About">
          <Column
            label="Company"
            dataKey="companyName"
            flexGrow={1}
            width={150}
          />
          <Column
            label="Sentence"
            dataKey="sentence"
            flexGrow={1}
            width={150}
          />
        </ColumnGroup>
      </Table>
    );
  }
});

module.exports = ColumnGroupsExample;
