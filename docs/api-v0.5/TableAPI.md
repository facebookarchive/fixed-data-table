<!-- File generated from "src/FixedDataTable.react.js" -->
`Table` (component)
===================

Data grid component with fixed or scrollable header and columns.

The layout of the data table is as follows:

```
+---------------------------------------------------+
| Fixed Column Group    | Scrollable Column Group   |
| Header                | Header                    |
|                       |                           |
+---------------------------------------------------+
|                       |                           |
| Fixed Header Columns  | Scrollable Header Columns |
|                       |                           |
+-----------------------+---------------------------+
|                       |                           |
| Fixed Body Columns    | Scrollable Body Columns   |
|                       |                           |
+-----------------------+---------------------------+
|                       |                           |
| Fixed Footer Columns  | Scrollable Footer Columns |
|                       |                           |
+-----------------------+---------------------------+
```

- Fixed Column Group Header: These are the headers for a group
  of columns if included in the table that do not scroll
  vertically or horizontally.

- Scrollable Column Group Header: The header for a group of columns
  that do not move while scrolling vertically, but move horizontally
  with the horizontal scrolling.

- Fixed Header Columns: The header columns that do not move while scrolling
  vertically or horizontally.

- Scrollable Header Columns: The header columns that do not move
  while scrolling vertically, but move horizontally with the horizontal
  scrolling.

- Fixed Body Columns: The body columns that do not move while scrolling
  horizontally, but move vertically with the vertical scrolling.

- Scrollable Body Columns: The body columns that move while scrolling
  vertically or horizontally.

Props
-----

### `width` (required)

Pixel width of table. If all columns do not fit,
a horizontal scrollbar will appear.

type: `number`


### `height`

Pixel height of table. If all rows do not fit,
a vertical scrollbar will appear.

Either `height` or `maxHeight` must be specified.

type: `number`


### `maxHeight`

Maximum pixel height of table. If all rows do not fit,
a vertical scrollbar will appear.

Either `height` or `maxHeight` must be specified.

type: `number`


### `ownerHeight`

Pixel height of table's owner, this is used in a managed scrolling
situation when you want to slide the table up from below the fold
without having to constantly update the height on every scroll tick.
Instead, vary this property on scroll. By using `ownerHeight`, we
over-render the table while making sure the footer and horizontal
scrollbar of the table are visible when the current space for the table
in view is smaller than the final, over-flowing height of table. It
allows us to avoid resizing and reflowing table when it is moving in the
view.

This is used if `ownerHeight < height` (or `maxHeight`).

type: `number`


### `overflowX`

type: `enum('hidden'|'auto')`


### `overflowY`

type: `enum('hidden'|'auto')`


### `rowsCount` (required)

Number of rows in the table.

type: `number`


### `rowHeight` (required)

Pixel height of rows unless `rowHeightGetter` is specified and returns
different value.

type: `number`


### `rowHeightGetter`

If specified, `rowHeightGetter(index)` is called for each row and the
returned value overrides `rowHeight` for particular row.

type: `func`


### `rowGetter` (required)

To get rows to display in table, `rowGetter(index)`
is called. `rowGetter` should be smart enough to handle async
fetching of data and return temporary objects
while data is being fetched.

type: `func`


### `rowClassNameGetter`

To get any additional CSS classes that should be added to a row,
`rowClassNameGetter(index)` is called.

type: `func`


### `groupHeaderHeight`

Pixel height of the column group header.

type: `number`
defaultValue: `0`


### `headerHeight` (required)

Pixel height of header.

type: `number`
defaultValue: `0`


### `headerDataGetter`

Function that is called to get the data for the header row.
If the function returns null, the header will be set to the
Column's label property.

type: `func`


### `footerHeight`

Pixel height of footer.

type: `number`
defaultValue: `0`


### `footerData`

DEPRECATED - use footerDataGetter instead.
Data that will be passed to footer cell renderers.

type: `union(object|array)`


### `footerDataGetter`

Function that is called to get the data for the footer row.

type: `func`


### `scrollLeft`

Value of horizontal scroll.

type: `number`
defaultValue: `0`


### `scrollToColumn`

Index of column to scroll to.

type: `number`


### `scrollTop`

Value of vertical scroll.

type: `number`
defaultValue: `0`


### `scrollToRow`

Index of row to scroll to.

type: `number`


### `onScrollStart`

Callback that is called when scrolling starts with current horizontal
and vertical scroll values.

type: `func`


### `onScrollEnd`

Callback that is called when scrolling ends or stops with new horizontal
and vertical scroll values.

type: `func`


### `onContentHeightChange`

Callback that is called when `rowHeightGetter` returns a different height
for a row than the `rowHeight` prop. This is necessary because initially
table estimates heights of some parts of the content.

type: `func`


### `onRowClick`

Callback that is called when a row is clicked.

type: `func`


### `onRowDoubleClick`

Callback that is called when a row is double clicked.

type: `func`


### `onRowMouseDown`

Callback that is called when a mouse-down event happens on a row.

type: `func`


### `onRowMouseEnter`

Callback that is called when a mouse-enter event happens on a row.

type: `func`


### `onRowMouseLeave`

Callback that is called when a mouse-leave event happens on a row.

type: `func`


### `onColumnResizeEndCallback`

Callback that is called when resizer has been released
and column needs to be updated.

Required if the isResizable property is true on any column.

```
function(
  newColumnWidth: number,
  dataKey: string,
)
```

type: `func`


### `isColumnResizing`

Whether a column is currently being resized.

type: `bool`

