v0.6 API Migration
==========================

The FixedDataTable v0.6 release deprecated a large number of APIs in an effort to simplify its use and increase  flexibility. The changes come under two major areas, **customizable cell rendering** and **flexible data sources**.

Quick Overview
---------------
Here is a quick list of what has been removed and how to upgrade:

### Table
* `rowGetter` - Provide data directly via the `cell` on each Column.
* `headerDataGetter` - Provide data directly via the `header` on each Column.
* `footerData` - Provide data directly via the `footer` on each Column.
* `footerDataGetter` - Provide data directly via the `header` on each Column.

### Column
* `dataKey` - The FixedDataTable no longer needs this but it can be provided on the cell if required for user code.
* `cellRenderer` - Replaced with the `cell` API, it supports either a React Element or a function.
* `cellClassName` - This can be set directly on the `cell` element.
* `label` - Replaced with the `header` API, it supports either a React Element or a function.
* `headerRenderer` - Replaced with the `header` API, it supports either a React Element or a function.
* `headerClassName` - This can be set directly on the `header` element.
* `footerRenderer` - Replaced with the `footer` API, it supports either a React Element or a function.
* `footerClassName` - This can be set directly on the `footer` element.
* `cellDataGetter` - Provide data directly via the `cell`.
* `columnData` - Provide data directly via the `cell`.

### ColumnGroup
* `label` - Replaced with the `header` API, it supports either a React Element or a function.
* `groupHeaderRenderer` - Replaced with the `header` API, it supports either a React Element or a function.
* `columnGroupData` - Provide data directly via the `cell`.

Customizable Cell Rendering
---------------------------
In previous versions of FixedDataTable, it was possible to customize what was rendered into a cell via the `cellRenderer` prop but it was very limited at what could changed as the `cellRenderer` would always wrap the content with a default cell and this default cell could only be customizable in limited ways via column props like `cellClassName`. A typical `Column` config would look like:

```javascript
const {Column} = require('fixed-data-table');

function renderLink(cellData) {
  return <a href="#">{cellData}</a>;
}

const MyColumn = (
  <Column
    label="Email"
    dataKey="email"
    cellRenderer={renderLink}
    cellClassName="my-class"
    width={200}
  />
);
```

The current FixedDataTable version provides the new API's `cell`, `header` and `footer` for `Column`s to render data. These API's will no longer wrap the content in a default cell, if the FixedDataTable default styles are needed you can use the new `Cell` component or your own optimized `Cell`.

To render static content provide a React Element. FixedDataTable will pass through any positional props needed to render the cell:
```javascript
const {Column, Cell} = require('fixed-data-table');

const MyColumn = (
  <Column
    header={<Cell>Email</Cell>}
    cell={<Cell className="my-class">Static content</Cell>}
    width={200}
  />
);
```

More likely you will want to provide different content per row in a column, this is possible via creating a React Component and handling any necessary logic to get data based on the `rowIndex`. When rendered the `Cell` will receive the props `rowIndex`, `width`, `height` plus any other props provided when initializing the `Cell` component in the `Column` config:
```javascript
const {Column, Cell} = require('fixed-data-table');

class MyDataFetchingCell extends React.Component {
  render() {
    var {rowIndex, field, ...props} = this.props;
    return (
      <Cell {...props}>
        content: {this._getMyDataForIndex(rowIndex, field)}
      </Cell>
    );
  }

  _getMyDataForIndex(index, field) {
    ...
  }
}

const MyColumn = (
  <Column
    header={<Cell>Email</Cell>}
    cell={<MyDataFetchingCell field="email" />}
    width={200}
  />
);
```

The `cell` prop can also accept render functions. This works well a simple `Cell` that renders based on the parents `state` or `props` is needed:
```javascript
const {Column, Cell} = require('fixed-data-table');

const MyColumn = (
  <Column
    header={<Cell>Email</Cell>}
    cell={({rowIndex, ...props}) => (
      <Cell {...props}>
        content: {getMyDataForIndex(rowIndex)}
      </Cell>
    )}
    width={200}
  />
);
```

Flexible Data Sources
---------------------
Previously FixedDataTable needed to own the data required to render the table, this data was provided via the `rowGetter` prop. `Cell`s would then be given the relevant data based on the `dataKey` and would render the cell only if the data changed. A typical setup would look like this:
```javascript
const {Table, Column} = require('fixed-data-table');

const rows = [
  {name: 'Sally', email: 'sally@gmail.com'},
  // .... and more
];

function rowGetter(index) {
  return rows[index];
},

const MyTable = (
  <Table
    rowGetter={rowGetter}
    rowsCount={rows.length}
    rowHeight={50}
    width={1000}
    height={500}>
    <Column
      label="Email"
      dataKey="email"
      width={200}
    />
  </Table>
);
```

This API was very inflexible for different data setups since all data needed to provided to the top level `rowGetter`. With the current FixedDataTable version we have removed the need to provide any data, instead the user is responsible for passing any required data around.

There are a number of options to consume data depending on the application. For simple use cases the required data can be passed to the cell directly via props and for more complex use cases the `Cell`s themselves can request any required data from a data layer and update over time via subscriptions.

Example basic usage:
```javascript
const {Table, Column, Cell} = require('fixed-data-table');

const rows = [
  {name: 'Sally', email: 'sally@gmail.com'},
  // .... and more
];

class MyCell extends React.Component {
  render() {
    var {rowIndex, data, field, ...props} = this.props;
    return (
      <Cell {...props}>
        {data[rowIndex][field]}
      </Cell>
    );
  }
}

const MyTable = (
  <Table
    rowsCount={rows.length}
    rowHeight={50}
    width={1000}
    height={500}>
    <Column
      header={<Cell>Email</Cell>}
      cell={<MyCell data={rows} field="email" />}
      width={200}
    />
  </Table>
);
```

More Information
---------
For more information see the updated [examples](http://facebook.github.io/fixed-data-table/example-object-data.html) or [API docs](http://facebook.github.io/fixed-data-table/api-table.html).
