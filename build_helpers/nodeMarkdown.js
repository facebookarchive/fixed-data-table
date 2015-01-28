var fs = require('fs');
var markdownLoader = require('./markdownLoader');

var installed = false;

function install() {
  if (installed) {
    return;
  }

  require.extensions['.md'] = function(module, filename) {
    var src = fs.readFileSync(filename, {encoding: 'utf8'});
    try {
      src = markdownLoader(src);
    } catch (e) {
      throw new Error('Error transforming ' + filename + ' to markdown: ' + e.toString());
    }
    module._compile(
      'module.exports = ' + JSON.stringify(src),
      filename
    );
  };

  installed = true;
}

module.exports = {
  install: install
};
