"use strict";

var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var FixedDataTable = require('fixed-data-table');
var React = require('react');

var Column = FixedDataTable.Column;
var PropTypes = React.PropTypes;
var Table = FixedDataTable.Table;

var columnWidths = {
  firstName: 240,
  lastName: 200,
  sentence: 140,
  companyName: 60,
};
var isColumnResizing;

var ResizeExample = React.createClass({
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

  _onColumnResizeEndCallback(newColumnWidth, dataKey) {
    columnWidths[dataKey] = newColumnWidth;
    isColumnResizing = false;
    this.forceUpdate(); // don't do this, use a store and put into this.state!
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
        overflowY={controlledScrolling ? "hidden" : "auto"}
        isColumnResizing={isColumnResizing}
        onColumnResizeEndCallback={this._onColumnResizeEndCallback}>
        <Column
          dataKey="firstName"
          fixed={true}
          label="First Name"
          width={columnWidths['firstName']}
          isResizable={true}
        />
        <Column
          label="Last Name"
          dataKey="lastName"
          width={columnWidths['lastName']}
          isResizable={true}
        />
        <Column
          label="Company"
          dataKey="companyName"
          width={columnWidths['companyName']}
          isResizable={true}
        />
        <Column
          label="Sentence"
          dataKey="sentence"
          width={columnWidths['sentence']}
          isResizable={true}
        />
      </Table>
    );
  }
});

module.exports = ResizeExample;
