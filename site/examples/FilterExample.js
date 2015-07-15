"use strict";

var ExampleImage = require('./ExampleImage');
var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Cell = FixedDataTable.Cell;
var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var ImageCell = React.createClass({
  propTypes: {
    data: PropTypes.any,
    dataKey: PropTypes.string,
    rowIndex: PropTypes.number,
  },
  _getData() {
    return this.props.data[this.props.rowIndex][this.props.dataKey];
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

var FilterExample = React.createClass({
  getInitialState() {
    return {
      rows : new FakeObjectDataListStore().getAll(),
      filteredRows: null,
      filterBy: null
    };
  },

  componentWillMount() {
    this._filterRowsBy(this.state.filterBy);
  },

  _filterRowsBy(filterBy) {

    var rows = this.state.rows.slice();
    var filteredRows = filterBy ? rows.filter(function(row){
      return row['firstName'].toLowerCase().indexOf(filterBy.toLowerCase()) >= 0
    }) : rows;

    this.setState({
      filteredRows,
      filterBy,
    })
  },

  _onFilterChange(e) {
    this._filterRowsBy(e.target.value);
  },

	render() {
		return (
      <div>
        <input onChange={this._onFilterChange} placeholder='Filter by First Name' />
        <br />
        <Table
          rowHeight={50}
          rowsCount={this.state.filteredRows.length}
          width={this.props.tableWidth}
          height={this.props.tableHeight}
          scrollTop={this.props.top}
          scrollLeft={this.props.left}
          headerHeight={50}>
          <Column
            cell={<ImageCell data={this.state.filteredRows} dataKey='avartar' />}
            fixed={true}
            width={50}
          />
          <Column
            label='First Name'
            cell={<TextCell data={this.state.filteredRows} dataKey='firstName' />}
            fixed={true}
            width={100}
          />
          <Column
            header="Last Name"
            cell={<TextCell data={this.state.filteredRows} dataKey='lastName' />}
            fixed={true}
            width={100}
          />
          <Column
            header="City"
            cell={<TextCell data={this.state.filteredRows} dataKey='city' />}
            width={100}
          />
          <Column
            label='Street'
            cell={<TextCell data={this.state.filteredRows} dataKey='street' />}
            width={200}
          />
          <Column
            header="Zip Code"
            cell={<TextCell data={this.state.filteredRows} dataKey='zipCode' />}
            width={200}
          />
        </Table>
      </div>
    )
	},
})

module.exports = FilterExample;