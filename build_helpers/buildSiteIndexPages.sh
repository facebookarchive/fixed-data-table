#!/usr/bin/env node
// -*- mode: js -*-
"use strict";

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Constants = require('../site/Constants');
var renderPath = require('../__site_prerender__/renderPath');

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

function getAllLocations(pages) {
  var locations = [];
  for (var key in pages) {
    if (!pages.hasOwnProperty(key) || typeof pages[key] !== 'object') {
      continue;
    }

    if (pages[key].groupTitle) {
      locations = [].concat(locations, getAllLocations(pages[key]));
    }

    if (pages[key].location) {
      locations.push(pages[key].location);
    }
  }

  return locations;
}

var locations = Constants.ALL_PAGES.reduce(function(allPages, pages) {
  return [].concat(allPages, getAllLocations(pages));
}, []);

locations.forEach(function(fileName) {
  var props = {
    location: fileName,
    devMode: process.env.NODE_ENV !== 'production',
    files: files
  };

  renderPath(fileName, props, function(content) {
    fs.writeFileSync(
      path.join(sitePath, fileName),
      content
    );
  });
});
