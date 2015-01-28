<!-- File generated from "src/FixedDataTableColumnGroup.react.js" -->
API: `ColumnGroup` (component)
==============================

Component that defines the attributes of a table column group.

Props
-----

### `align`

The horizontal alignment of the table cell content.

type: `enum('left'|'center'|'right')`


### `fixed` (required)

Whether the column group is fixed.

type: `bool`


### `groupHeaderRenderer`

The function that takes a label and column group data as params and
returns React-renderable content for table header. If this is not set
the label will be the only thing rendered in the column group header
cell.

type: `func`


### `columnGroupData`

Bucket for any data to be passed into column group renderer functions.

type: `object`


### `label`

The column's header label.

type: `string`

