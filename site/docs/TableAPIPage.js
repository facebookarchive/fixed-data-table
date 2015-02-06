"use strict";

var Constants = require('../Constants');
var DocsHTMLWrapper = require('./DocsHTMLWrapper');
var TableAPIHTML = require('../../docs/TableAPI.md');
var React = require('react');

var TableAPIPage = React.createClass({
  render() {
    return (
      <DocsHTMLWrapper
        html={TableAPIHTML}
        example={Constants.APIPages.TABLE_API}
      />
    );
  }
});

module.exports = TableAPIPage;
