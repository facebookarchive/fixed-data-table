"use strict";

exports.Pages = {
  HOME: 'HOME',
  TABLE_API: 'TABLE_API',
  COLUMN_API: 'COLUMN_API',
  COLUMNGROUP_API: 'COLUMNGROUP_API',
  OBJECT_DATA_EXAMPLE: 'OBJECT_DATA_EXAMPLE',
  FLEXGROW_EXAMPLE: 'FLEXGROW_EXAMPLE',
  RESIZE_EXAMPLE: 'RESIZE_EXAMPLE',
  FILTER_EXAMPLE: 'FILTER_EXAMPLE',
  SORT_EXAMPLE: 'SORT_EXAMPLE',
}

exports.OtherPages = {
  HOME: {location: 'index.html', title: 'Home'},
};

exports.APIPages = {
  TABLE_API: {location: 'api-table.html', title: 'Table'},
  COLUMN_API: {location: 'api-column.html', title: 'Column'},
  COLUMNGROUP_API: {location: 'api-columngroup.html', title: 'Column Group'},
};

exports.ExamplePages = {
  OBJECT_DATA_EXAMPLE: {
    location: 'example-object-data.html',
    title: 'With JSON Data',
    description: 'A basic table example with two fixed columns, fed in some JSON data.',
  },
  FLEXGROW_EXAMPLE: {
    location: 'example-flexgrow.html',
    title: 'Fluid column widths',
    description: 'An example of a table with flexible column widths. Here, the middle two columns stretch to fill all remaining space if the table is wider than the sum of all the columns\'s default widths. Note that one column grows twice as greedily as the other, as specified by the flexGrow param.',
  },
  RESIZE_EXAMPLE: {
    location: 'example-resize.html',
    title: 'Resizable columns',
    description: 'Table with drag and drop column resizing and a dummy "store" for persistence. The Last Name column demonstrates the ability to contrain to both a min- and max-width.',
  },
  COLUMN_GROUPS_EXAMPLE: {
    location: 'example-column-groups.html',
    title: 'Column Groups',
    description: 'Table with column groupings.',
  },
  FILTER_EXAMPLE: {
    location: 'example-filter.html',
    title: 'Client-side Filter',
    description: 'A table example that is filterable by column. In this example, by first name.',
  },
  SORT_EXAMPLE: {
    location: 'example-sort.html',
    title: 'Client-side Sort',
    description: 'A table example that is sortable by column.'
  },
};

exports.DOCS_DEFAULT = exports.APIPages.TABLE_API;
exports.EXAMPLES_DEFAULT = exports.ExamplePages.OBJECT_DATA_EXAMPLE;
