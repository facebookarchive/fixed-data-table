/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule cx
 */

var slashReplaceRegex = /\//g;
var cache = {};

function getClassName(className) {
  if (cache[className]) {
    return cache[className];
  }

  cache[className] = className.replace(slashReplaceRegex, '_');
  return cache[className];
}

/**
 * This function is used to mark string literals representing CSS class names
 * so that they can be transformed statically. This allows for modularization
 * and minification of CSS class names.
 *
 * In static_upstream, this function is actually implemented, but it should
 * eventually be replaced with something more descriptive, and the transform
 * that is used in the main stack should be ported for use elsewhere.
 *
 * @param string|object className to modularize, or an object of key/values.
 *                      In the object case, the values are conditions that
 *                      determine if the className keys should be included.
 * @param [string ...]  Variable list of classNames in the string case.
 * @return string       Renderable space-separated CSS className.
 */
function cx(classNames) {
  var classNamesArray;
  if (typeof classNames == 'object') {
    classNamesArray = Object.keys(classNames).filter(function(className) {
      return classNames[className];
    });
  } else {
    classNamesArray = Array.prototype.slice.call(arguments);
  }

  return classNamesArray.map(getClassName).join(' ');
}

module.exports = cx;
