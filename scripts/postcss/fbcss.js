const postcss = require('postcss');

const colors = {
  'fbui-desktop-background-light': '#f6f7f8',
  'fbui-white': '#fff',
  'scrollbar-face-active-color': '#7d7d7d',
  'scrollbar-face-color': '#c2c2c2',
  'scrollbar-face-margin': '4px',
  'scrollbar-face-radius': '6px',
  'scrollbar-size-large': '17px',
  'scrollbar-size': '15px',
  'scrollbar-track-color': 'rgba(255, 255, 255, 0.8)',
};

module.exports = postcss.plugin('fbcss', (options) => {
  return css => {
    css.walkRules(rule => {
      // TODO: use - instead of _ to match forked cx in fbjs
      rule.selector = rule.selector.replace(/\//g, '_');
    });
    css.walkDecls(decl => {
      const matches = decl.value.match(/var\((.+)\)/);
      if (matches) {
        if (matches[1] in colors) {
          decl.value = colors[matches[1]];
        } else {
          throw new Error(`Missing ${matches[1]} from color mapping.`);
        }
      }
    });
  };
});
