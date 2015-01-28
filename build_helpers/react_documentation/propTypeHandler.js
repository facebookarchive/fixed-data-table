/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
/*jslint node: true */
'use strict';

var ReactDocumentationParser = require('./ReactDocumentationParser');
var esprima = require('esprima-fb');

var Syntax = esprima.Syntax;

var utils = ReactDocumentationParser.Utils;
var simplePropTypes = {
  array: 1,
  bool: 1,
  func: 1,
  number: 1,
  object: 1,
  string: 1,
  any: 1,
  element: 1,
  node: 1
};

function isPropTypesExpression(expr, scopeChain) {
  var moduleName = utils.resolveToModule(expr, scopeChain);
  return moduleName === 'React' || moduleName === 'ReactPropTypes';
}

function getEnumValues(expr) {
  return expr.elements.map(function(element) {
    return {
      value: utils.expressionToString(element),
      computed: element.type !== Syntax.Literal
    };
  });
}

function getPropTypeOneOf(expr, arg) {
  var type = {name: 'enum'};
  if (arg.type !== Syntax.ArrayExpression) {
    type.computed = true;
    type.value = utils.expressionToString(arg);
  } else {
    type.value = getEnumValues(arg);
  }
  return type;
}

function getPropTypeOneOfType(expr, arg, scopeChain) {
  var type = {name: 'union'};
  if (arg.type !== Syntax.ArrayExpression) {
    type.computed = true;
    type.value = utils.expressionToString(arg);
  } else {
    type.value = arg.elements.map(function(e) {
      return getPropType(e, scopeChain);
    });
  }
  return type;
}

function getPropTypeArrayOf(expr, arg, scopeChain) {
  var type = {name: 'arrayof'};
  type.value = getPropType(arg, scopeChain);
  if (type.value.name === 'unknown') {
    type.value = utils.expressionToString(arg);
    type.computed = true;
  }
  return type;
}

function getPropTypeShape(expr, arg, scopeChain) {
  var type = {name: 'shape'};
  var value = arg;
  if (arg.type !== 'ObjectExpression') {
    value = utils.resolveToValue(arg, scopeChain);
  }

  if (value.type === 'ObjectExpression') {
    type.value = {};
    value.properties.forEach(function(property) {
      type.value[utils.getNameOrValue(property.key)] =
        getPropType(property.value, scopeChain);
    });
  } else {
    type.value = 'unknown';
  }

  return type;
}

function getPropTypeInstanceOf(expr, arg) {
  return {
    name: 'instance',
    value: utils.expressionToString(arg)
  };
}

var propTypes = {
  oneOf: getPropTypeOneOf,
  oneOfType: getPropTypeOneOfType,
  instanceOf: getPropTypeInstanceOf,
  arrayOf: getPropTypeArrayOf,
  shape: getPropTypeShape
};

/**
 * Tries to identify the prop type by the following rules:
 *
 * Member expressions which resolve to the `React` or `ReactPropTypes` module
 * are inspected to see whether their properties are prop types. Strictly
 * speaking we'd have to test whether the Member expression resolves to
 * require('React').PropTypes, but we are not doing this right now for
 * simplicity.
 *
 * Everything else is treated as custom validator
 */
function getPropType(expr, scopeChain) {
  if (expr.type === Syntax.FunctionExpression ||
      (expr.type !== Syntax.CallExpression &&
      expr.type !== Syntax.MemberExpression) ||
      !isPropTypesExpression(expr, scopeChain)
  ) {
    return {name: 'custom'};
  }

  var expressionParts, arg;

  if (expr.type === Syntax.MemberExpression) {
    if (isRequired(expr)) {
      expr = expr.object;
    }
    expressionParts = utils.expressionToArray(expr);
  }
  if (expr.type === Syntax.CallExpression) {
    expressionParts = utils.expressionToArray(expr.callee);
    arg = expr.arguments[0];
  }

  var propType = expressionParts.pop();
  var type;
  if (propType in propTypes) {
    type = propTypes[propType](expr, arg, scopeChain);
  } else  {
    type = {name: (propType in simplePropTypes) ? propType : 'unknown'};
  }
  return type;
}

/**
 * Returns true of the prop is required, according to its type defintion
 *
 * @param {object} propTypeExpression
 * @return {bool}
 */
function isRequired(expr) {
  if (expr.type === Syntax.MemberExpression) {
    var expressionParts = utils.expressionToArray(expr);
    if (expressionParts[expressionParts.length - 1] === 'isRequired') {
      return true;
    }
  }
  return false;
}

/**
 * Handles member expressions of the form
 *
 *  ComponentA.propTypes
 *
 * it resolves ComponentA to its module name and adds it to the "composes" entry
 * in the documentation.
 *
 * @param {object} documentation
 * @param {object} expr
 * @param {array} scopeChain
 */
function amendComposes(
  documentation,
  expr,
  scopeChain
) {
  if (expr.type !== Syntax.MemberExpression ||
      utils.getNameOrValue(expr.property) !== 'propTypes' ||
      expr.object.type !== Syntax.Identifier) {
    return;
  }

  var moduleName = utils.resolveToModule(expr.object, scopeChain);
  var modules = documentation.composes || (documentation.composes = []);
  modules.push(moduleName);
}

function amendPropTypes(documentation, objectExpression, scopeChain) {
  objectExpression.properties.forEach(function(property) {
    switch (property.type) {
      case Syntax.Property:
        var type = getPropType(property.value, scopeChain);
        var decl = utils.getPropertyDescriptor(
          documentation,
          utils.getNameOrValue(property.key)
        );
        if (type) {
          decl.type = type;
          decl.required = type.name !== 'custom' && isRequired(property.value);
        }
        break;
      case Syntax.SpreadProperty:
        var expr = utils.resolveToValue(property.argument, scopeChain);
        if (expr.type) {
          switch (expr.type) {
            case Syntax.ObjectExpression: // normal object literal
              amendPropTypes(documentation, expr, scopeChain);
              break;
            case Syntax.MemberExpression:
              amendComposes(documentation, expr, scopeChain);
            break;
          }
        }
        break;
    }
  });
}

function propTypeHandler(documentation, expr, scopeChain) {
  // We only handle object literals for now. In the future we might also resolve
  // member expressions to other modules.
  expr = utils.resolveToValue(expr);
  switch (expr.type) {
    case Syntax.ObjectExpression:
      amendPropTypes(documentation, expr, scopeChain);
      break;
    case Syntax.MemberExpression:
      amendComposes(documentation, expr, scopeChain);
  }
}

module.exports = propTypeHandler;
