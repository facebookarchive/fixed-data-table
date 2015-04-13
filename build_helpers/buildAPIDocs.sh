#!/usr/bin/env node
// -*- mode: js -*-
"use strict";

var fs = require('fs');
var generateMarkdown = require('./react_documentation/generateMarkdown');
var path = require('path');
var ReactDocGen = require('react-docgen');

var docsPath = path.join(__dirname, '../docs');
if (!fs.existsSync(docsPath)) {
  fs.mkdirSync(docsPath);
}

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

FILES_TO_READ.forEach(function(file) {
  var fileSource = fs.readFileSync(file.path);
  var fileDocsData = ReactDocGen.parse(fileSource);
  var markdownFilePath = path.join(docsPath, file.markdownFileName);

  var headerComment = '<!-- File generated from "' +
    file.path.replace(PROJECT_ROOT, '') +
    '" -->\n';

  fs.writeFileSync(
    markdownFilePath,
    headerComment + generateMarkdown(file.name, fileDocsData)
  );

  console.log('Wrote: ' + markdownFilePath);
});
