"use strict";

var ExampleImage = require('./ExampleImage');
var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function renderDate(/*object*/ cellData) {
  return <span>{cellData.toLocaleString()}</span>;
}

var SortExample = React.createClass({
  getInitialState() {
    return {
      rows: new FakeObjectDataListStore().getAll(),
      sortBy: 'id',
      sortDir: null,
    };
  },

  _rowGetter(rowIndex) {
    return this.state.rows[rowIndex];
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

  _renderHeader(label, cellDataKey) {
    return (
      <a onClick={this._sortRowsBy.bind(null, cellDataKey)}>{label}</a>
    );
  },

  render() {
    var sortDirArrow = '';

    if (this.state.sortDir !== null){
      sortDirArrow = this.state.sortDir === SortTypes.DESC ? ' ↓' : ' ↑';
    }

    return (
      <Table
        rowHeight={50}
        rowGetter={this._rowGetter}
        rowsCount={this.state.rows.length}
        width={this.props.tableWidth}
        height={this.props.tableHeight}
        headerHeight={50}>
        <Column
          headerRenderer={this._renderHeader}
          label={'id' + (this.state.sortBy === 'id' ? sortDirArrow : '')}
          width={100}
          dataKey='id'
        />
        <Column
          headerRenderer={this._renderHeader}
          label={'First Name' + (this.state.sortBy === 'firstName' ? sortDirArrow : '')}
          width={200}
          dataKey='firstName'
        />
        <Column
          headerRenderer={this._renderHeader}
          label={'Last Name' + (this.state.sortBy === 'lastName' ? sortDirArrow : '')}
          width={200}
          dataKey='lastName'
        />
        <Column
          headerRenderer={this._renderHeader}
          label={'City' + (this.state.sortBy === 'city' ? sortDirArrow : '')}
          width={200}
          dataKey='city'
        />
         <Column
          headerRenderer={this._renderHeader}
          label={'Company' + (this.state.sortBy === 'companyName' ? sortDirArrow : '')}
          width={200}
          dataKey='companyName'
        />

      </Table>
    );
  },

});

module.exports = SortExample;
