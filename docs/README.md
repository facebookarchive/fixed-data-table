Getting Started
===============

The easiest way to start using on FixedDataTable is to install it via npm:

```shell
npm install react --save
npm install fixed-data-table --save
```

If your using a standard build system such as [`browserify`](http://browserify.org/) or [`webpack`](https://webpack.github.io/) it can then be required directly:
```
const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');
```

For layout and styling the default stylesheet will need to be added: `fixed-data-table/dist/fixed-data-table.min.css`.

## Create your `Table`
Setting up your table can be done via the `Table` component. To be able to handle large amounts of data the table only renders the parts that are visible to the user, in order to calculate this a static `width`, `height`, `rowsCount` and `rowHeight` are required:

```javascript
const React = require('react');
const {Table} = require('fixed-data-table');

class MyTable extends React.Component {
  render() {
    return (
      <Table
        rowsCount={100}
        rowHeight={50}
        width={1000}
        height={500}>
        // TODO: Add columns
      </Table>
    );
  }
}
```

## Create your `Column`s
For each column that needs to be displayed a `Column` config with 2 important props are required. The `width` of the column and the `cell` content to render. The `Cell` component can wrap any content to provide default table styles and centering.

```javascript
const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');

class MyTable extends React.Component {
  render() {
    return (
      <Table
        rowsCount={100}
        rowHeight={50}
        width={1000}
        height={500}>
        <Column
          cell={<Cell>Basic content</Cell>}
          width={200}
        />
      </Table>
    );
  }
}
```

## Provide Custom Data
Typically you will want to render custom data per row, let's add some data to our table and add a header to the column.

```javascript
const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');

class MyTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myTableData: [
        {name: 'Rylan'},
        {name: 'Amelia'},
        {name: 'Estevan'},
        {name: 'Florence'},
        {name: 'Tressa'},
      ],
    };
  }

  render() {
    return (
      <Table
        rowsCount={this.state.myTableData.length}
        rowHeight={50}
        headerHeight={50}
        width={1000}
        height={500}>
        <Column
          header={<Cell>Name</Cell>}
          cell={props => (
            <Cell {...props}>
              {this.state.myTableData[props.rowIndex].name}
            </Cell>
          )}
          width={200}
        />
      </Table>
    );
  }
}
```

Instead of providing a static `cell` we can use a function for our `cell`, this function will be passed the `rowIndex` plus the `width` and `height` of the cell. By using the `rowIndex` and we can get different data from `this.state.myTableData` for each cell.

## Create Reusable Cells

With larger table setups you will want to reuse the `cell` render functions. To do this you can create your own React Component for each unique `Cell`. Let's add another column that displays emails with links.

```javascript
const React = require('react');
const {Table, Column, Cell} = require('fixed-data-table');

class MyTextCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    return (
      <Cell {...props}>
        {data[rowIndex][field]}
      </Cell>
    );
  }
}

class MyLinkCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    const link = data[rowIndex][field];
    return (
      <Cell {...props}>
        <a href={link}>{link}</a>
      </Cell>
    );
  }
}

class MyTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myTableData: [
        {name: 'Rylan', email: 'Angelita_Weimann42@gmail.com'},
        {name: 'Amelia', email: 'Dexter.Trantow57@hotmail.com'},
        {name: 'Estevan', email: 'Aimee7@hotmail.com'},
        {name: 'Florence', email: 'Jarrod.Bernier13@yahoo.com'},
        {name: 'Tressa', email: 'Yadira1@hotmail.com'},
      ],
    };
  }

  render() {
    return (
      <Table
        rowsCount={this.state.myTableData.length}
        rowHeight={50}
        headerHeight={50}
        width={1000}
        height={500}>
        <Column
          header={<Cell>Name</Cell>}
          cell={
            <MyTextCell
              data={this.state.myTableData}
              field="name"
            />
          }
          width={200}
        />
        <Column
          header={<Cell>Email</Cell>}
          cell={
            <MyLinkCell
              data={this.state.myTableData}
              field="email"
            />
          }
          width={200}
        />
      </Table>
    );
  }
}
```

## Next Steps

The FixedDataTable has many more options, for more information see the [examples section](http://facebook.github.io/fixed-data-table/example-object-data.html) or the [API docs](http://facebook.github.io/fixed-data-table/api-table.html).
