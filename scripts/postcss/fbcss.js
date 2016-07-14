const fbCSSVars = require('fbjs-css-vars');
const postcss = require('postcss');

module.exports = postcss.plugin('fbcss', (options) => {
  return css => {
    css.walkRules(rule => {
      // TODO: use - instead of _ to match forked cx in fbjs
      rule.selector = rule.selector.replace(/\//g, '_');
    });
    css.walkDecls(decl => {
      const matches = decl.value.match(/var\((.+)\)/);
      if (matches) {
        if (matches[1] in fbCSSVars) {
          decl.value = fbCSSVars[matches[1]];
        } else {
          throw new Error(`Missing ${matches[1]} from fbjs-css-vars.`);
        }
      }
    });
  };
});
