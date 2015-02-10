#!/usr/bin/env node
// -*- mode: js -*-
"use strict";

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var mkdirp = require('mkdirp');
var Constants = require('../site/Constants');
var prerender = require('../__site_prerender__/prerender');

var sitePath = path.join(__dirname, '../__site__');
if (!fs.existsSync(sitePath)) {
  fs.mkdirSync(sitePath);
}

var RESOURCES = [
  'main.css',
  'main.js'
];

var resourcesMap = {};
if (process.env.NODE_ENV !== 'production') {
  // When using the `webpack dev-server` resources wont exist on the file system
  // so we can't search for them.
  RESOURCES.forEach(function(resourceName) {
    resourcesMap[resourceName] = resourceName;
  });
} else {
  RESOURCES.forEach(function(resourceName) {
    var searchPath = path.join(
      __dirname,
      '../__site__/'  + resourceName.replace('.', '-*.')
    );
    var hashedResourceName = glob.sync(searchPath)[0];
    if (!hashedResourceName) {
      throw new Error(
        'Hashed file of "' + resourceName + '" ' +
        'not found when searching with "' + searchPath + '"'
      );
    }

    resourcesMap[resourceName] = path.basename(hashedResourceName);
  });
}

prerender.getRoutePaths().forEach(function(route) {
  var filePath = path.join(sitePath, route);
  if (path.extname(filePath) !== '.html') {
    filePath = path.join(filePath, 'index.html');
  }
  var fileFolder = path.dirname(filePath);
  if (!fs.existsSync(fileFolder)) {
    mkdirp.sync(fileFolder);
  }

  var localResourcesMap = {};
  Object.keys(resourcesMap).forEach(function(key) {
    localResourcesMap[key] = path.join(
      path.relative(fileFolder, sitePath),
      resourcesMap[key]
    );
  });

  var props = {
    resources: localResourcesMap
  };

  prerender.renderPath(route, props, function(content) {
    fs.writeFileSync(filePath, content);
  });
});
