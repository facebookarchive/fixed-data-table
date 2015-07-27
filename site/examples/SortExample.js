"use strict";

var ExampleImage = require('./ExampleImage');
var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;
var Cell = FixedDataTable.Cell;

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

var TextCell = React.createClass({
  propTypes: {
    dataKey: PropTypes.string,
  },
  _getData() {
    return this.props.data[this.props.rowIndex][this.props.dataKey];
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

var SortHeaderCell = React.createClass({
  render() {
    return (
      <Cell
        {...this.props}>
        <a onClick={this.props.sortBy.bind(null, this.props.dataKey)}>
          {this.props.label + " " + this.props.arrow}
        </a>
      </Cell>
    )
  }
})

var SortExample = React.createClass({
  getInitialState() {
    return {
      rows: new FakeObjectDataListStore().getAll(),
      sortBy: 'year',
      sortDir: null,
    };
  },

  _sortRowsBy(cellDataKey) {
    var sortDir = this.state.sortDir;
    var sortBy = cellDataKey;
    if (sortBy === this.state.sortBy) {
      sortDir = this.state.sortDir === SortTypes.ASC ? SortTypes.DESC : SortTypes.ASC;
    } else {
      sortDir = SortTypes.DESC;
    }

    var rows = this.state.rows.slice();
    rows.sort((a, b) => {
      var sortVal = 0;
      if (a[sortBy] > b[sortBy]) {
        sortVal = 1;
      }
      if (a[sortBy] < b[sortBy]) {
        sortVal = -1;
      }

      if (sortDir === SortTypes.DESC) {
        sortVal = sortVal * -1;
      }

      return sortVal;
    });

    this.setState({
      rows,
      sortBy,
      sortDir,
    });
  },

  render() {
    var sortDirArrow = '';

    if (this.state.sortDir !== null){
      sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
    }

    return (
      <Table
        rowHeight={50}
        rowsCount={this.state.rows.length}
        width={this.props.tableWidth}
        height={this.props.tableHeight}
        headerHeight={50}>
        <Column
          header={<SortHeaderCell sortBy={this._sortRowsBy} arrow={sortDirArrow} label="id" dataKey='id' />}
          cell={<TextCell data={this.state.rows} dataKey="id" />}
          width={100}
        />
        <Column
          header={<SortHeaderCell sortBy={this._sortRowsBy} arrow={sortDirArrow} label="First Name" dataKey='firstName' />}
          cell={<TextCell data={this.state.rows} dataKey="firstName" />}
          width={200}
        />
        <Column
          header={<SortHeaderCell sortBy={this._sortRowsBy} arrow={sortDirArrow} label="Last Name" dataKey='lastName' />}
          cell={<TextCell data={this.state.rows} dataKey="lastName" />}
          width={200}
        />
        <Column
          header={<SortHeaderCell sortBy={this._sortRowsBy} arrow={sortDirArrow} label="City" dataKey='city' />}
          cell={<TextCell data={this.state.rows} dataKey="city" />}
          width={200}
        />
         <Column
          header={<SortHeaderCell sortBy={this._sortRowsBy} arrow={sortDirArrow} label="Company Name" dataKey='companyName' />}
          cell={<TextCell data={this.state.rows} dataKey="companyName" />}
          width={200}
        />

      </Table>
    );
  },

});

module.exports = SortExample;
