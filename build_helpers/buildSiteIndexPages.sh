#!/usr/bin/env node
// -*- mode: js -*-
"use strict";

require('node-jsx').install({harmony: true});
require('./nodeMarkdown').install();
require('./nodeLessStub').install();

var fs = require('fs');
var path = require('path');
var IndexPage = require('../site/IndexPage');

var isDevMode = process.argv[2] === '--devMode';

var sitePath = path.join(__dirname, '../__site__');
if (!fs.existsSync(sitePath)) {
  fs.mkdirSync(sitePath);
}

IndexPage.getPageLocations().forEach(function(fileName) {
  fs.writeFileSync(
    path.join(sitePath, fileName),
    IndexPage.renderToString({
      location: fileName,
      devMode: isDevMode
    })
  );
});
