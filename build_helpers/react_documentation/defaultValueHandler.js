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

function getDefaultValue(expr) {
  var defaultValue = utils.expressionToString(expr);
  if (typeof defaultValue !== 'undefined') {
    return {
      value: defaultValue,
      computed: Syntax.CallExpression === expr.type ||
                Syntax.MemberExpression === expr.type ||
                Syntax.Identifier === expr.type
    };
  }
}


function defaultValueHandler(documentation, value) {
  if (value.type !== Syntax.FunctionExpression) {
    return;
  }

  // Find the value that is returned from the function and process it if it is
  // an object literal.
  var objectExpression;
  utils.traverseFlat(value.body, function(node) {
    if (node.type === Syntax.ReturnStatement) {
      var value = utils.resolveToValue(node.argument);
      if (value.type === Syntax.ObjectExpression) {
        objectExpression = value;
      }
    }
  });

  if (objectExpression) {
    objectExpression.properties.forEach(function(property) {
      var prop = utils.getPropertyDescriptor(
        documentation,
        utils.getNameOrValue(property.key)
      );
      var defaultValue = getDefaultValue(property.value);
      if (defaultValue) {
        prop.defaultValue = defaultValue;
      }
    });
  }
}

module.exports = defaultValueHandler;
