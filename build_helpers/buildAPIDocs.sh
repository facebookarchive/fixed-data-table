#!/usr/bin/env node
// -*- mode: js -*-
"use strict";

/**
 *  Extractor for React documentation in JavaScript.
 */
var ReactDocumentationParser = require('./react_documentation/ReactDocumentationParser');
var generateMarkdown = require('./react_documentation/generateMarkdown');
var path = require('path');
var fs = require('fs');

var PROJECT_ROOT = path.join(__dirname, '../');
var FILES_TO_READ = [
  {
    path: path.join(PROJECT_ROOT, 'src/FixedDataTable.react.js'),
    name: 'Table',
    markdownFileName: 'TableAPI.md'
  },
  {
    path: path.join(PROJECT_ROOT, 'src/FixedDataTableColumn.react.js'),
    name: 'Column',
    markdownFileName: 'ColumnAPI.md'
  },
  {
    path: path.join(PROJECT_ROOT, 'src/FixedDataTableColumnGroup.react.js'),
    name: 'ColumnGroup',
    markdownFileName: 'ColumnGroupAPI.md'
  }
];

ReactDocumentationParser.addHandler(
  require('./react_documentation/propTypeHandler'),
  'propTypes'
);
ReactDocumentationParser.addHandler(
  require('./react_documentation/propDocBlockHandler'),
  'propTypes'
);
ReactDocumentationParser.addHandler(
  require('./react_documentation/defaultValueHandler'),
  'getDefaultProps'
);

ReactDocumentationParser.addHandler(
  require('./react_documentation/componentDocblockHandler')
);

FILES_TO_READ.forEach(function(file) {
  var fileSource = fs.readFileSync(file.path);
  var fileDocsData = ReactDocumentationParser.parseSource(fileSource);
  var markdownFilePath = path.join(__dirname, '../docs', file.markdownFileName);

  var headerComment = '<!-- File generated from "' +
    file.path.replace(PROJECT_ROOT, '') +
    '" -->\n';

  fs.writeFileSync(
    markdownFilePath,
    headerComment + generateMarkdown(file.name, fileDocsData)
  );

  console.log('Wrote: ' + markdownFilePath);
});
