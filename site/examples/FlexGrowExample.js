"use strict";

var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var n = 0;
function colorizeText(/*string*/ str) {
  return str.split('').map((letter) => {
    var color = 'hsl(' + n++ * 240 / 255 + ', 100%, 50%)';
    return <span style={{color}}>{letter}</span>;
  });
}

function renderDate(/*object*/ cellData) {
  return <span>{cellData.toLocaleString()}</span>;
}

var FlexGrowExample = React.createClass({
  propTypes: {
    onContentDimensionsChange: PropTypes.func,
    left: PropTypes.number,
    top: PropTypes.number,
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
        rowGetter={FakeObjectDataListStore.getObjectAt}
        rowsCount={FakeObjectDataListStore.getSize()}
        width={this.props.tableWidth}
        height={this.props.tableHeight}
        onContentHeightChange={this._onContentHeightChange}
        scrollTop={this.props.top}
        scrollLeft={this.props.left}
        overflowX={controlledScrolling ? "hidden" : "auto"}
        overflowY={controlledScrolling ? "hidden" : "auto"}>
        <Column
          dataKey="firstName"
          fixed={true}
          label="First Name"
          width={100}
        />
        <Column
          label="Sentence! (flexGrow greediness=2)"
          cellRenderer={colorizeText}
          dataKey="sentence"
          flexGrow={2}
          width={200}
        />
        <Column
          flexGrow={1}
          label="Company (flexGrow greediness=1)"
          width={200}
          dataKey="companyName"
        />
        <Column
          dataKey="lastName"
          label="Last Name"
          width={100}
        />
      </Table>
    );
  }
});

module.exports = FlexGrowExample;

