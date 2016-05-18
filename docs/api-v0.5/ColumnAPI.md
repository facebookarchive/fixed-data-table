<!-- File generated from "src/FixedDataTableColumn.react.js" -->
`Column` (component)
====================

Component that defines the attributes of table column.

Props
-----

### `align`

The horizontal alignment of the table cell content.

type: `enum('left'|'center'|'right')`


### `headerClassName`

className for this column's header cell.

type: `string`


### `footerClassName`

className for this column's footer cell.

type: `string`


### `cellClassName`

className for each of this column's data cells.

type: `string`


### `cellRenderer`

The cell renderer that returns React-renderable content for table cell.
```
function(
  cellData: any,
  cellDataKey: string,
  rowData: object,
  rowIndex: number,
  columnData: any,
  width: number
): ?$jsx
```

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


### `fixed`

Controls if the column is fixed when scrolling in the X axis.

type: `bool`
defaultValue: `false`


### `headerRenderer`

The cell renderer that returns React-renderable content for table column
header.
```
function(
  label: ?string,
  cellDataKey: string,
  columnData: any,
  rowData: array<?object>,
  width: number
): ?$jsx
```

type: `func`


### `footerRenderer`

The cell renderer that returns React-renderable content for table column
footer.
```
function(
  label: ?string,
  cellDataKey: string,
  columnData: any,
  rowData: array<?object>,
  width: number
): ?$jsx
```

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

This property only provides the UI for the column resizing. If this
is set to true, you will need ot se the onColumnResizeEndCallback table
property and render your columns appropriately.

type: `bool`


### `allowCellsRecycling`

Experimental feature
Whether cells in this column can be removed from document when outside
of viewport as a result of horizontal scrolling.
Setting this property to true allows the table to not render cells in
particular column that are outside of viewport for visible rows. This
allows to create table with many columns and not have vertical scrolling
performance drop.
Setting the property to false will keep previous behaviour and keep
cell rendered if the row it belongs to is visible.

type: `bool`
defaultValue: `false`

