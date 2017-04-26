var Transformer = require('babel-core').Transformer;

module.exports = new Transformer('object-assign', {
  CallExpression: function(node, parent, scope, file) {
    if (this.get('callee').matchesPattern('Object.assign')) {
      node.callee = file.addHelper('extends');
    }
  }
});
