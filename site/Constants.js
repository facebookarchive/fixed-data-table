"use strict";

var EXAMPLES_LOCATION_BASE = 'https://github.com/facebook/fixed-data-table/blob/master/examples/';

exports.OtherPages = {
  HOME: {location: 'index.html', title: 'Home'},
};

exports.DocsPages = {
  DOCS: {
    groupTitle: 'Guides',
    GETTING_STARTED: {location: 'getting-started.html', title: 'Getting Started'},
    V6_MIGRATION: {location: 'v6-migration.html', title: 'v0.6 API Migration'},
  },
  API: {
    groupTitle: 'API',
    TABLE_API: {location: 'api-table.html', title: 'Table'},
    COLUMN_API: {location: 'api-column.html', title: 'Column'},
    COLUMNGROUP_API: {location: 'api-columngroup.html', title: 'Column Group'},
    CELL_API: {location: 'api-cell.html', title: 'Cell'},
  },
  API_V5: {
    groupTitle: 'API - v0.5',
    TABLE_API: {location: 'api-table-v0.5.html', title: 'Table'},
    COLUMN_API: {location: 'api-column-v0.5.html', title: 'Column'},
    COLUMNGROUP_API: {location: 'api-columngroup-v0.5.html', title: 'Column Group'},
  }
};

exports.ExamplePages = {
  OBJECT_DATA_EXAMPLE: {
    location: 'example-object-data.html',
    file: EXAMPLES_LOCATION_BASE + 'ObjectDataExample.js',
    title: 'With JSON Data',
    description: 'A basic table example with two fixed columns, fed in some JSON data.',
  },
  FLEXGROW_EXAMPLE: {
    location: 'example-flexgrow.html',
    file: EXAMPLES_LOCATION_BASE + 'FlexGrowExample.js',
    title: 'Fluid column widths',
    description: 'An example of a table with flexible column widths. Here, the middle two columns stretch to fill all remaining space if the table is wider than the sum of all the columns\'s default widths. Note that one column grows twice as greedily as the other, as specified by the flexGrow param.',
  },
  RESIZE_EXAMPLE: {
    location: 'example-resize.html',
    file: EXAMPLES_LOCATION_BASE + 'ResizeExample.js',
    title: 'Resizable columns',
    description: 'Table with drag and drop column resizing and a dummy "store" for persistence. The Last Name column demonstrates the ability to constrain to both a min- and max-width.',
  },
  REORDER_EXAMPLE: {
    location: 'example-reorder.html',
    file: EXAMPLES_LOCATION_BASE + 'ReorderExample.js',
    title: 'Reorderable columns',
    description: 'Table with drag and drop column reordering and a dummy "store" for persistence.',
  },
  COLUMN_GROUPS_EXAMPLE: {
    location: 'example-column-groups.html',
    file: EXAMPLES_LOCATION_BASE + 'ColumnGroupsExample.js',
    title: 'Column Groups',
    description: 'Table with column groupings.',
  },
  FILTER_EXAMPLE: {
    location: 'example-filter.html',
    file: EXAMPLES_LOCATION_BASE + 'FilterExample.js',
    title: 'Client-side Filter',
    description: 'A table example that is filterable by column. In this example, by first name.',
  },
  SORT_EXAMPLE: {
    location: 'example-sort.html',
    file: EXAMPLES_LOCATION_BASE + 'SortExample.js',
    title: 'Client-side Sort',
    description: 'A table example that is sortable by column.'
  },
};

exports.DOCS_DEFAULT = exports.DocsPages.DOCS.GETTING_STARTED;
exports.EXAMPLES_DEFAULT = exports.ExamplePages.OBJECT_DATA_EXAMPLE;
exports.ALL_PAGES = [
  exports.OtherPages,
  exports.DocsPages,
  exports.ExamplePages,
];
