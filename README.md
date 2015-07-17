Fixed Data Tables for React
====================================

FixedDataTable is a React component for building and presenting data in a flexible, powerful way. It supports standard table features, like headers, columns, rows, header groupings, and both fixed-position and scrolling columns.

The table was designed to handle thousands of rows of data without sacrificing performance. Scrolling smoothly is a first-class goal of FixedDataTable and it's architected in a way to allow for flexibility and extensibility.

Features of FixedDataTable:
* Fixed headers and footer
* Both fixed and scrollable columns
* Handling huge amounts of data
* Variable row heights (with adaptive scroll positions)
* Column resizing
* Performant scrolling
* Customizable styling
* Jumping to a row or column
* Controlled scroll API allows touch support

Things the FixedDataTable **doesn't** do:
* FixedDataTable does not provide a layout reflow mechanism or calculate content layout information such as width and height of the cell contents. The developer has to provide the layout information to the table instead.
* FixedDataTable does not handle sorting of data. Instead it allows the developer to supply data getters that can be sort-, filter-, or tail-loading-aware.
* FixedDataTable does not fetch the data (see above)

Getting started
---------------

Install `fixed-data-table` using npm.

```shell
npm install fixed-data-table
```
Add the default stylesheet `dist/fixed-data-table.css`, then require it into any module.

### Basic Example

```javascript
var React = require('react');
var ReactDOM = require('react-dom');
var FixedDataTable = require('fixed-data-table');

var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell; // A default cell

// Table data as a list of array.
var rows = [
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  // .... and more
];

// Create your cell class
var BasicCell = React.createClass({
  // Choose how this cell gets data, with whatever function you want!
  // You can assume your cell will receive the rowIndex prop.
  _getData: function() {
    return rows[this.props.rowIndex][this.props.dataKey]
  },
  render: function() {
    // Spread the props (cellWidth and cellHeight) if you want a
    // basic table cell with vertical alignment and padding.
    // Otherwise, you can return any valid React element!
    return (
      <Cell
        {...this.props}>
        {this._getData()}
      </Cell>
    )
  }
});

// Render your table
ReactDOM.render(
  <Table
    rowHeight={50}
    rowsCount={rows.length}
    width={5000}
    height={5000}
    headerHeight={50}>
    <Column
      header="Col 1" // Header text. You can also pass in a React element here!
      cell={<BasicCell dataKey={1} />} // Add whatever props your cell needs!
      width={3000}
    />
    <Column
      header="Col 2"
      width={2000}
      cell={<BasicCell dataKey={2} />}
    />
  </Table>,
  document.getElementById('example')
);
```

Contributions
------------

Use [GitHub issues](https://github.com/facebook/fixed-data-table/issues) for requests.

We actively welcome pull requests; learn how to [contribute](https://github.com/facebook/fixed-data-table/blob/master/CONTRIBUTING.md).


Changelog
---------

Changes are tracked as [GitHub releases](https://github.com/facebook/fixed-data-table/releases).


License
-------

`FixedDataTable` is [BSD-licensed](https://github.com/facebook/fixed-data-table/blob/master/LICENSE). We also provide an additional [patent grant](https://github.com/facebook/fixed-data-table/blob/master/PATENTS).
