#!/usr/bin/env node
// -*- mode: js -*-
"use strict";

require('node-jsx').install({harmony: true});
require('./nodeMarkdown').install();
require('./nodeLessStub').install();

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var IndexPage = require('../site/IndexPage');

var sitePath = path.join(__dirname, '../__site__');
if (!fs.existsSync(sitePath)) {
  fs.mkdirSync(sitePath);
}

var files = {
  'main.css': 'main.css',
  'main.js': 'main.js'
};

if (process.env.NODE_ENV === 'production') {
  Object.keys(files).forEach(function(fileName) {
    var searchPath = path.join(
      __dirname,
      '../__site__/'  + fileName.replace('.', '-*.')
    );
    var hashedFilename = glob.sync(searchPath)[0];
    if (!hashedFilename) {
      throw new Error(
        'Hashed file of "' + fileName + '" ' +
        'not found when searching with "' + searchPath + '"'
      );
    }

    files[fileName] = path.basename(hashedFilename);
  });
}

IndexPage.getPageLocations().forEach(function(fileName) {
  fs.writeFileSync(
    path.join(sitePath, fileName),
    IndexPage.renderToString({
      location: fileName,
      devMode: process.env.NODE_ENV !== 'production',
      files: files
    })
  );
});
