/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
/*jslint node: true */
"use strict";

/**
 * How this parser works:
 *
 * 1. For each given file path do:
 *
 *   a. Find component definition
 *    -. Find the rvalue module.exports assignment.
 *       Otherwise inspect assignments to exports. If there are multiple
 *       components that are exported, we don't continue with parsing the file.
 *    -. If the previous step results in a variable name, resolve it.
 *    -. Extract the object literal from the React.createClass call.
 *
 *   b. Execute definition handlers (handlers working with the object
 *      expression).
 *
 *   c. For each property of the definition object, execute the registered
 *    callbacks, if they are eligible for this property.
 *
 * 2. Return the aggregated results
 */

var esprima = require('esprima-fb');
var fs = require('fs');
var hasOwnProperty = Object.prototype.hasOwnProperty;
var Syntax = esprima.Syntax;

/**
 * Executes visitor on the object and its children (recursively).
 * While traversing the tree, a scope chain is built and passed to the visitor.
 *
 * If the visitor returns false, the object's children are not traversed.
 *
 * @param {object} object
 * @param {function} visitor
 * @param {?array} scopeChain
 */
function traverse(object, visitor, scopeChain) {
  scopeChain = scopeChain || [{}];

  var scope = scopeChain[0];

  switch (object.type) {
    case Syntax.VariableDeclaration:
      object.declarations.forEach(function(decl) {
        scope[decl.id.name] = decl.init;
      });
      break;
    case Syntax.ClassDeclaration:
      scope[object.id.name] = object;
      break;
    case Syntax.FunctionDeclaration:
      // A function declaration creates a symbol in the current scope
      scope[object.id.name] = object;
      /* falls through */
    case Syntax.FunctionExpression:
    case Syntax.Program:
      scopeChain = [{}].concat(scopeChain);
      break;
  }

  if (object.type === Syntax.FunctionExpression ||
      object.type === Syntax.FunctionDeclaration) {
    // add parameters to the new scope
    object.params.forEach(function(param) {
      // since the value of the parameters are  unknown during parsing time
      // we set the value to `undefined`.
      scopeChain[0][param.name] = undefined;
    });
  }

  if (object.type) {
    if (visitor.call(null, object, scopeChain) === false) {
      return;
    }
  }

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      var child = object[key];
      if (typeof child === 'object' && child !== null) {
        traverse(child, visitor, scopeChain);
      }
    }
  }
}

/**
 * Executes visitor on the object and its children, but only traverses into
 * children which can be statically analyzed and don't depend on runtime
 * information.
 *
 * @param {object} object
 * @param {function} visitor
 * @param {?array} scopeChain
 */
function traverseFlat(object, visitor, scopeChain) {
  traverse(object, function(node, scopeChain) {
    switch (node.type) {
      case Syntax.FunctionDeclaration:
      case Syntax.FunctionExpression:
      case Syntax.IfStatement:
      case Syntax.WithStatement:
      case Syntax.SwitchStatement:
      case Syntax.TryStatement:
      case Syntax.WhileStatement:
      case Syntax.DoWhileStatement:
      case Syntax.ForStatement:
      case Syntax.ForInStatement:
        return false;
    }
    return visitor(node, scopeChain);
  }, scopeChain);
}

/**
 * If the expression is an identifier, it is resolved in the scope chain.
 * If it is an assignment expression, it resolves to the right hand side.
 *
 * In all other cases the expression itself is returned.
 *
 * Since the scope chain constructed by the traverse function is very simple
 * (it doesn't take into account *changes* to the variable through assignment
 * statements), this function doesn't return the correct value in every
 * situation. But it's good enough for how it is used in the parser.
 *
 * @param {object} expr
 * @param {array} scopeChain
 *
 * @return {object}
 */
function resolveToValue(expr, scopeChain) {
  switch (expr.type) {
    case Syntax.AssignmentExpression:
      if (expr.operator === '=') {
        return resolveToValue(expr.right, scopeChain);
      }
      break;
    case Syntax.Identifier:
      var value;
      scopeChain.some(function(scope, i) {
        if (hasOwnProperty.call(scope, expr.name) && scope[expr.name]) {
          value = resolveToValue(scope[expr.name], scopeChain.slice(i));
          return true;
        }
      });
      return value;
  }
  return expr;
}

/**
 * Given an expression (e.g. call expression, member expression or identifier),
 * this function tries to find the name of module from which the "root value"
 * was imported.
 *
 * @param {object} expr
 * @param {array} scopeChain
 * @return {?string}
 */
function resolveToModule(expr, scopeChain) {
  switch(expr.type) {
    case Syntax.VariableDeclarator:
      if (expr.init) {
        return resolveToModule(expr.init, scopeChain);
      }
      break;
    case Syntax.CallExpression:
      if (expr.callee.type === Syntax.Identifier &&
          expr.callee.name === 'require') {
        return expr['arguments'][0].value;
      } else {
        return resolveToModule(expr.callee, scopeChain);
      }
      break;
    case Syntax.Identifier:
      var name = expr.name;
      scopeChain = scopeChain.slice();
      while (scopeChain[0] && !hasOwnProperty.call(scopeChain[0], name)) {
        scopeChain.shift();
      }
      if (scopeChain[0]) {
        return resolveToModule(scopeChain[0][name], scopeChain);
      }
      break;
    case Syntax.MemberExpression:
      while (expr && expr.type === Syntax.MemberExpression) {
        expr = expr.object;
      }
      if (expr) {
        return resolveToModule(expr, scopeChain);
      }
  }
}

/**
 * Helper function to get the scope chain for a given node. Since we don't know
 * how deep the node is in the AST, we cannot use traverseFlat. For this reason
 * the resulting scope chain might include values which are only determined at
 * runtime.
 *
 * @param {object} needle - Node in the AST
 * @param {object} ast - The AST
 *
 * @return {array}
 */
function getScopeChainForNode(needle, ast) {
  var scope;
  traverse(ast, function(node, scopeChain) {
    if (scope) {
      return false;
    }
    if (node === needle) {
      scope = scopeChain;
    }
  });
  return scope;
}


/**
 * Splits a member or call expression into parts. E.g. foo.bar.baz becomes
 * ['foo', 'bar', 'baz']
 *
 * @param {object} expr
 * @return {array}
 */
function expressionToArray(expr) {
  var parts = [];
  switch(expr.type) {
    case Syntax.CallExpression:
      parts = expressionToArray(expr.callee);
      break;
    case Syntax.MemberExpression:
      parts = expressionToArray(expr.object);
      if (expr.computed) {
        parts.push('...');
      } else {
        parts.push(expr.property.name || expr.property.value);
      }
      break;
    case Syntax.Identifier:
      parts = [expr.name];
      break;
    case Syntax.Literal:
      parts = [expr.raw];
      break;
    case Syntax.ThisExpression:
      parts = ['this'];
      break;
    case Syntax.ObjectExpression:
      var properties = expr.properties.map(function(property) {
        return expressionToString(property.key) +
          ': ' +
          expressionToString(property.value);
      });
      parts = ['{' + properties.join(', ') + '}'];
      break;
    case Syntax.ArrayExpression:
      parts = ['[' + expr.elements.map(expressionToString).join(', ') + ']'];
      break;
  }
  return parts;
}

/**
 * Creates a string representation of a member expression.
 *
 * @param {object} expr
 * @return {array}
 */
function expressionToString(expr) {
  return expressionToArray(expr).join('.');
}

/**
 * If node is an Identifier, it returns its name. If it is a literal, it returns
 * its value.
 *
 * @param {object} node
 * @param {bool} raw
 * @return {string}
 */
function getNameOrValue(node, raw) {
  switch (node.type) {
    case Syntax.Identifier:
      return node.name;
    case Syntax.Literal:
      return raw ? node.raw : node.value;
    default:
      throw new TypeError('Argument must be an Identifier or a Literal');
  }
}

/**
 * Given a string, this functions returns an object with docletnames as keys
 * and their "content" as values. This only works for strings that are docblock
 * comments, i.e. every line starts with `*`.
 *
 * @param {string} str
 * @return {object}
 */
function getDoclets(str) {
  var doclets = {};
  var currentValue = [];
  var currentDoclet = null;
  var docletPattern = /^\s*\*\s?@(\w+)(?:\s(.*))/;
  var linePattern = /^\s*\*\s(.*)$/;
  str.split('\n').forEach(function(line) {
    var match;
    if (docletPattern.test(line)) {
      if (currentDoclet) {
        doclets[currentDoclet] = currentValue.join('\n');
        currentValue.length = 0;
      }
      match = line.match(docletPattern);
      currentDoclet = match[1];
      if (match[2]) {
        currentValue.push(match[2].trim());
      }
    } else if (linePattern.test(line)) {
      match = line.match(linePattern);
      if (match[1]) {
        currentValue.push(match[1].replace(/\s+$/, '')); // rtrim
      }
    }
  });

  if (currentDoclet) {
    doclets[currentDoclet] = currentValue.join('\n');
  }

  return doclets;
}

/**
 * A simpler helper method which returns the descriptor for the specified
 * property, or creates it first if it doesn't exist yet.
 *
 * @param {object} documentation
 * @param {string} propertyName
 * @return {object}
 */
function getPropertyDescriptor(documentation, propertyName) {
  var prop = documentation.props[propertyName];
  if (!prop) {
    prop = documentation.props[propertyName] = {};
  }
  return prop;
}

/**
 * Returns true if the statement is of form `foo = bar;`.
 *
 * @param {object} node
 * @return {bool}
 */
function isAssignmentStatement(node) {
  return node.type === Syntax.ExpressionStatement &&
    node.expression.type === Syntax.AssignmentExpression &&
    node.expression.operator === '=';
}

/**
 * Returns true if the expression is of form `exports.foo = bar;` or
 * `modules.exports = foo;`.
 *
 * @param {object} node
 * @return {bool}
 */
function isExportsOrModuleExpression(expr) {
  if (expr.left.type !== Syntax.MemberExpression) {
    return false;
  }
  var exprArr = expressionToArray(expr.left);
  return (exprArr[0] === 'module' && exprArr[1] === 'exports') ||
    exprArr[0] == 'exports';
}

/**
 * Returns true if the expression is a function call of the form
 * `React.createClass(...)`.
 *
 * @param {object} node
 * @param {array} scopeChain
 * @return {bool}
 */
function isReactCreateClassCall(node, scopeChain) {
  return node.type === Syntax.CallExpression &&
    node.callee.type === Syntax.MemberExpression &&
    node.callee.property.name === 'createClass' &&
    resolveToModule(node.callee.object, scopeChain) === 'React';
}

/**
 * Given an AST, this function tries to find the object expression that is
 * passed to `React.createClass`, by resolving all references properly.
 *
 * @param {object} ast
 * @return {?object}
 */
function findComponentDefinition(ast) {
  var definition;
  traverseFlat(ast, function(node, scopeChain ) {
    // Ignore anything that is not `exports.X = ...;` or `module.exports = ...;`
    if (!isAssignmentStatement(node) ||
        !isExportsOrModuleExpression(node.expression)) {
      return false;
    }
    // Resolve the value of the right hand side. It should resolve to a call
    // expression, something like React.createClass
    var expr = resolveToValue(node.expression.right, scopeChain);
    if (!isReactCreateClassCall(expr, scopeChain)) {
      return false;
    }

    if (definition) { // If a file exports multiple components, ... complain!
      throw new Error(ReactDocumentationParser.ERROR_MULTIPLE_DEFINITIONS);
    }
    // We found React.createClass. Lets get cracking!
    definition = resolveToValue(expr['arguments'][0]);
  });

  return definition;
}

var propertyHandlers = {};
var componentHandlers = [];

var ReactDocumentationParser = {

  /**
   * Handlers extract information from the component definition.
   *
   * @param {function} handler
   * @param {?string} property - Only executes the handler for this property in
   *    the configuration object. If not provided, the handler is executed for
   *    every property.
   */
  addHandler: function(handler, property) {
    if (!property) {
      componentHandlers.push(handler);
    } else {
      if (!propertyHandlers[property]) {
        propertyHandlers[property] = [];
      }
      propertyHandlers[property].push(handler);
    }
  },

  getAST: function() {
    return this._ast;
  },

  getComments: function() {
    return this._comments;
  },

  /**
   * Takes JavaScript source code and returns an object with the information
   * extract from it.
   *
   * @param {string} source
   * @return {object}
   */
  parseSource: function(source) {
    var documentation = {props: {}, error: null, description: ''};
    try {
      var ast = esprima.parse(source, {loc: true, comment: true});
      // Find the component definition first. The return value should be
      // an ObjectExpression.
      var componentDefinition = findComponentDefinition(ast.body);
      if (!componentDefinition) {
        throw new Error(this.ERROR_MISSING_DEFINITION);
      }

      this._ast = ast;
      this._comments = ast.comments;

      // Execute all the handlers to extract the information
      this._executeHandlers(documentation, componentDefinition, ast);

    } catch (ex) {
      documentation.error = ex.message;
    }
    return documentation;
  },

  /**
   * Extracts documentation information from each of the React files at those
   * paths. Since reading files is asynchronous, the function accepts a callback
   * to which an object is passed, keyed by path for each file.
   *
   * @param {array}
   * @param {function} callback
   */
  processPaths: function(paths, callback) {
    var results = {};
    var count = paths.length;
    paths.forEach(function(path) {
      fs.readFile(path, function(err, data) {
        var documentation = this.parseSource(data);
        if (documentation.error) {
          console.error('Error processing ' + path);
          console.error(documentation.error);
        }
        results[path] = documentation;
        if (--count === 0) {
          callback(results);
        }
      }.bind(this));
    }, this);
  },

  _executeHandlers: function(documentation, componentDefinition, ast) {
    var scopeChain = getScopeChainForNode(componentDefinition, ast);
    componentDefinition.properties.forEach(function(property) {
      var name = getNameOrValue(property.key);
      if (!propertyHandlers[name]) {
        return;
      }
      propertyHandlers[name].forEach(function(handler) {
        handler(documentation, property.value, scopeChain);
      });
    });
    componentHandlers.forEach(function(handler) {
      handler(documentation, componentDefinition, scopeChain);
    });
  }
};

ReactDocumentationParser.ERROR_MISSING_DEFINITION =
  'No suitable component definition found.';

ReactDocumentationParser.ERROR_MULTIPLE_DEFINITIONS =
  'Multiple exported component definitions found.';

ReactDocumentationParser.Utils = {
  expressionToArray: expressionToArray,
  expressionToString: expressionToString,
  getDoclets: getDoclets,
  getNameOrValue: getNameOrValue,
  getPropertyDescriptor: getPropertyDescriptor,
  isAssignmentStatement: isAssignmentStatement,
  isExportsOrModuleExpression: isExportsOrModuleExpression,
  resolveToModule: resolveToModule,
  resolveToValue: resolveToValue,
  traverse: traverse,
  traverseFlat: traverseFlat
};

module.exports = ReactDocumentationParser;
