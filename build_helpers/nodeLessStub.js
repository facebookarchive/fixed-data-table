var installed = false;

function install() {
  if (installed) {
    return;
  }

  require.extensions['.less'] =
    require.extensions['.css'] =
    require.extensions['.png'] = function(module, filename) {
    module._compile('', filename);
  };

  installed = true;
}

module.exports = {
  install: install
};
