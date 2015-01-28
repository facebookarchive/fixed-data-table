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

function parseDocblock(str) {
  var lines = str.split('\n');
  for (var i = 0, l = lines.length; i < l; i++) {
    lines[i] = lines[i].trim().replace(/^\*\s?/, '');
  }
  return lines.join('\n').trim();
}

function componentDocblockHandler(symbol, value) {
  // Find docblocks above the component definition. Comments are already ordered
  var start = value.loc.start.line;
  var comments =
    ReactDocumentationParser.getComments().filter(function(comment) {
      return comment.type === 'Block' &&
             comment.value.indexOf('*\n') === 0 && // docblock
             comment.loc.end.line === start - 1;
    });

  symbol.description = comments.length > 0 ?
    parseDocblock(comments[comments.length - 1].value) :
    '';
}

module.exports = componentDocblockHandler;
