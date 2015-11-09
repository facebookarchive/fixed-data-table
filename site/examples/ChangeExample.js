"use strict";

var ROWS = 1000000;

var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var faker = require('faker');
var ImmutableObject = require('ImmutableObject');

var columnWidths = {
  firstName: 200,
  lastName: 200,
  sentence: 200,
  companyName: 200,
};

var ChangeExample = React.createClass({
  propTypes: {
    onContentDimensionsChange: PropTypes.func,
    left: PropTypes.number,
    top: PropTypes.number,
  },

  getInitialState() {
    return {
      dataList: new FakeObjectDataListStore(ROWS),
      randomColor: [255, 255, 255],
    }
  },

  _cellRenderer(cellData) {
    var style = {
      backgroundColor: 'rgb(' + this.state.randomColor[0] + ',' +
        this.state.randomColor[1] + ',' + this.state.randomColor[2] + ')'
    };

    return(
      <div style={style}>
        {cellData}
      </div>
    )
  },

  _rowGetter(index) {
    return this.state.dataList.getObjectAt(index);
  },

  _onRowClick(e, index) {
    var dataList = this.state.dataList;
    var obj = dataList.getObjectAt(index);
    obj = ImmutableObject.setProperty(obj, 'firstName', faker.name.firstName());
    dataList.setObjectAt(index, obj);

    this.setState({
      randomColor: [
        Math.floor(Math.random()*255),
        Math.floor(Math.random()*255),
        Math.floor(Math.random()*255)
      ],
      dataList: dataList,
    });
  },

  render() {
    var controlledScrolling =
      this.props.left !== undefined || this.props.top !== undefined;

    return (
      <div>
        <Table
          rowHeight={30}
          headerHeight={50}
          rowGetter={this._rowGetter}
          rowsCount={this.state.dataList.getSize()}
          width={this.props.tableWidth}
          height={200}
          scrollTop={this.props.top}
          scrollLeft={this.props.left}
          onRowClick={this._onRowClick}
          overflowX={controlledScrolling ? "hidden" : "auto"}
          overflowY={controlledScrolling ? "hidden" : "auto"}
        >
          <Column
            cellRenderer={this._cellRenderer}
            dataKey="firstName"
            label="First Name"
            width={columnWidths['firstName']}
          />
          <Column
            cellRenderer={this._cellRenderer}
            label="Last Name (min/max constrained)"
            dataKey="lastName"
            flexGrow={1}
            width={columnWidths['lastName']}
          />
          <Column
            cellRenderer={this._cellRenderer}
            label="Company"
            dataKey="companyName"
            flexGrow={1}
            width={columnWidths['companyName']}
          />
          <Column
            cellRenderer={this._cellRenderer}
            label="Sentence"
            dataKey="sentence"
            flexGrow={1}
            width={columnWidths['sentence']}
          />
        </Table>
        <hr />
        <Table
          rowHeight={30}
          headerHeight={50}
          rowGetter={this._rowGetter}
          rowsCount={this.state.dataList.getSize()}
          width={this.props.tableWidth}
          height={200}
          scrollTop={this.props.top}
          scrollLeft={this.props.left}
          onRowClick={this._onRowClick}
          overflowX={controlledScrolling ? "hidden" : "auto"}
          overflowY={controlledScrolling ? "hidden" : "auto"}
        >
          <Column
            cellRenderer={this._cellRenderer}
            dataKey="firstName"
            label="First Name"
            width={columnWidths['firstName']}
            pureCellRendering={true}
          />
          <Column
            cellRenderer={this._cellRenderer}
            label="Last Name (min/max constrained)"
            dataKey="lastName"
            flexGrow={1}
            width={columnWidths['lastName']}
            pureCellRendering={true}
          />
          <Column
            cellRenderer={this._cellRenderer}
            label="Company"
            dataKey="companyName"
            flexGrow={1}
            width={columnWidths['companyName']}
            pureCellRendering={true}
          />
          <Column
            cellRenderer={this._cellRenderer}
            label="Sentence"
            dataKey="sentence"
            flexGrow={1}
            width={columnWidths['sentence']}
            pureCellRendering={true}
          />
        </Table>
      </div>
    );
  }
});

module.exports = ChangeExample;
