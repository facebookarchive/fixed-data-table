<!-- File generated from "src/FixedDataTableColumnGroup.react.js" -->
`ColumnGroup` (component)
=========================

Component that defines the attributes of a table column group.

Props
-----

### `align`

The horizontal alignment of the table cell content.

type: `enum('left'|'center'|'right')`


### `fixed`

Controls if the column group is fixed when scrolling in the X axis.

type: `bool`
defaultValue: `false`


### `columnGroupData`

Bucket for any data to be passed into column group renderer functions.

type: `object`


### `label`

The column group's header label.

type: `string`


### `groupHeaderRenderer`

The cell renderer that returns React-renderable content for a table
column group header. If it's not specified, the label from props will
be rendered as header content.
```
function(
  label: ?string,
  cellDataKey: string,
  columnGroupData: any,
  rowData: array<?object>, // array of labels of all columnGroups
  width: number
): ?$jsx
```

type: `func`

