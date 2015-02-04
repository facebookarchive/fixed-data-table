<!-- File generated from "src/FixedDataTableColumn.react.js" -->
API: `Column` (component)
=========================

Component that defines the attributes of table column.

Props
-----

### `align`

The horizontal alignment of the table cell content.

type: `enum('left'|'center'|'right')`


### `cellClassName`

className for each of this column's data cells.

type: `string`


### `cellRenderer`

The data cell renderer
`function(
  any_cellData,
  string_cellDataKey,
  object_rowData,
  number_rowIndex,
  any_columnData,
  number_width
)`
that returns React-renderable content for table cell.

type: `func`


### `cellDataGetter`

The getter `function(string_cellDataKey, object_rowData)` that returns
the cell data for the `cellRenderer`.
If not provided, the cell data will be collected from
`rowData[cellDataKey]` instead. The value that `cellDataGetter` returns
will be used to determine whether the cell should re-render.

type: `func`


### `dataKey` (required)

The key to retrieve the cell data from the data row. Provided key type
must be either `string` or `number`. Since we use this
for keys, it must be specified for each column.

type: `union(string|number)`


### `headerRenderer`

The header cell renderer
`function(
  any_cellData,
  string_cellDataKey,
  object_rowData,
  any_columnData
)`
that returns React-renderable content for table column header.

type: `func`


### `footerRenderer`

The footer cell renderer
`function(
  any_cellData,
  string_cellDataKey,
  object_rowData,
  any_columnData
)`
that returns React-renderable content for table column footer.

type: `func`


### `columnData`

Bucket for any data to be passed into column renderer functions.

type: `object`


### `label`

The column's header label.

type: `string`


### `width` (required)

The pixel width of the column.

type: `number`


### `minWidth`

If this is a resizable column this is its minimum pixel width.

type: `number`


### `maxWidth`

If this is a resizable column this is its maximum pixel width.

type: `number`


### `flexGrow`

The grow factor relative to other columns. Same as the flex-grow API
from http://www.w3.org/TR/css3-flexbox/. Basically, take any available
extra width and distribute it proportionally according to all columns'
flexGrow values. Defaults to zero (no-flexing).

type: `number`


### `isResizable`

Whether the column can be resized with the
FixedDataTableColumnResizeHandle. Please note that if a column
has a flex grow, once you resize the column this will be set to 0.

type: `bool`

