"use strict";

var ROWS = 1000000;

var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Cell = FixedDataTable.Cell;
var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

function colorizeText(/*string*/ str, key, data, index) {
  var val, n = 0;
  return str.split('').map((letter) => {
    val = index * 70 + n++;
    var color = 'hsl(' + val + ', 100%, 50%)';
    return <span style={{color}} key={n}>{letter}</span>;
  });
}

var ImageCell = React.createClass({
  propTypes: {
    data: PropTypes.any,
    dataKey: PropTypes.string,
    rowIndex: PropTypes.number,
  },
  _getData() {
    return this.props.data.getObjectAt(this.props.rowIndex)[this.props.dataKey];
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
    return this.props.data.getObjectAt(this.props.rowIndex)[this.props.dataKey];
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

var ColoredTextCell = React.createClass({
  PropTypes: {
    dataKey: PropTypes.string,
    data: PropTypes.any,
    rowIndex: PropTypes.number,
  },
  _getData() {
    return this.props.data.getObjectAt(this.props.rowIndex)[this.props.dataKey];
  },
  render() {
    return (
      <Cell
        {...this.props}>
        {colorizeText(this._getData(), this.props.dataKey, null, this.props.rowIndex)}
      </Cell>
    )
  }
})

var FlexGrowExample = React.createClass({
  propTypes: {
    onContentDimensionsChange: PropTypes.func,
    left: PropTypes.number,
    top: PropTypes.number,
  },

  getInitialState() {
    return {
      dataList: new FakeObjectDataListStore(ROWS)
    };
  },

  _onContentHeightChange(contentHeight) {
    this.props.onContentDimensionsChange &&
      this.props.onContentDimensionsChange(
        contentHeight,
        Math.max(600, this.props.tableWidth)
      );
  },

  render() {
    var controlledScrolling =
      this.props.left !== undefined || this.props.top !== undefined;

    return (
      <Table
        rowHeight={50}
        headerHeight={50}
        rowGetter={this._rowGetter}
        rowsCount={this.state.dataList.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}
        onContentHeightChange={this._onContentHeightChange}
        scrollTop={this.props.top}
        scrollLeft={this.props.left}
        overflowX={controlledScrolling ? "hidden" : "auto"}
        overflowY={controlledScrolling ? "hidden" : "auto"}>
        <Column
          header="First Name"
          cell={<ColoredTextCell data={this.state.dataList} dataKey="firstName" />}
          fixed={true}
          width={100}
        />
        <Column
          header="Sentence! (flexGrow greediness=2)"
          cell={<ColoredTextCell data={this.state.dataList} dataKey="sentence" />}
          dataKey="sentence"
          flexGrow={2}
          width={200}
        />
        <Column
          flexGrow={1}
          header="Company (flexGrow greediness=1)"
          width={200}
          cell={<TextCell data={this.state.dataList} dataKey="companyName" />}
        />
        <Column
          header="Last Name"
          cell={<TextCell data={this.state.dataList} dataKey="lastName" />}
          width={100}
        />
      </Table>
    );
  }
});

module.exports = FlexGrowExample;
