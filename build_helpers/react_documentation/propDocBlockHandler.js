/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
/*jslint node:true*/
"use strict";

var ReactDocumentationParser = require('./ReactDocumentationParser');
var esprima = require('esprima-fb');

var Syntax = esprima.Syntax;

var utils = ReactDocumentationParser.Utils;

function parseDocblock(str) {
  var lines = str.split('\n');
  for (var i = 0, l = lines.length; i < l; i++) {
    lines[i] = lines[i].trim().replace(/^\*\s?/, '');
  }
  return lines.join('\n').trim();
}

function getDescriptionForProperty(property, comments) {
  // Find all comments that are above the property
  var docblock;
  while (
    comments.length &&
    comments[0].loc.end.line < property.loc.start.line
  ) {
    docblock = comments.shift();
  }

  return docblock ? parseDocblock(docblock.value) : '';
}

function getComposedComponents(expr) {
  var declarationStart = expr.loc.start.line;
  var comments =
    ReactDocumentationParser.getComments().filter(function(comment) {
      return comment.type === 'Block' &&
             comment.value.indexOf('*\n') === 0 && // docblock
             comment.loc.end.line === declarationStart - 1;
    });

  if (comments.length > 0) {
    return utils.getDoclets(comments[0].value).composes.split(/\s+/);
  }
  return null;
}

function propDocBlockHandler(documentation, value) {
  if (value.type !== Syntax.ObjectExpression) {
    return;
  }
  // Filter out all non docblock comments that are outside the object
  // expression
  var start = value.loc.start.line;
  var end = value.loc.end.line;
  var comments =
    ReactDocumentationParser.getComments().filter(function(comment) {
      return comment.type === 'Block' &&
             comment.value.indexOf('*\n') === 0 && // docblock
             comment.loc.start.line > start &&
             comment.loc.end.line < end;
    });

  value.properties.forEach(function(property) {
    // we only support documentation of actual properties, not spread
    if (property.type === Syntax.Property) {
      var prop = utils.getPropertyDescriptor(
        documentation,
        utils.getNameOrValue(property.key)
      );

      prop.description = getDescriptionForProperty(property, comments);
    }
  });

  // Find @composes doclet in propType docblock
  var composes = getComposedComponents(value);
  if (composes) {
    var modules = documentation.composes || (documentation.composes = []);
    Array.prototype.push.apply(modules, composes);
  }
}

module.exports = propDocBlockHandler;
