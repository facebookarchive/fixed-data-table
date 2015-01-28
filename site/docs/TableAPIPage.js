"use strict";

var DocsHTMLWrapper = require('./DocsHTMLWrapper');
var TableAPIHTML = require('../../docs/TableAPI.md');
var React = require('react');

var TableAPIPage = React.createClass({
  render() {
    return (
      <DocsHTMLWrapper
        html={TableAPIHTML}
      />
    );
  }
});

module.exports = TableAPIPage;
